import {
  BadRequestException,
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { CreateFieldDto } from './dto/create-field.dto';
import { UpdateFieldDto } from './dto/update-field.dto';
import { GetFieldsQueryDto } from './dto/get-fields-query.dto';
import { Field, FieldDocument } from 'src/schemas/field.schema';
import { SubField, SubFieldDocument } from 'src/schemas/subField.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { FieldsRepository } from './fields.repository';
import { ResponseUtil } from '../../common/utils/response.util';
import { CloudinaryService } from '../../common/services/cloudinary.service';

@Injectable()
export class FieldsService {
  constructor(
    private readonly fieldsRepository: FieldsRepository,
    @InjectModel(Field.name)
    private readonly fieldModel: Model<FieldDocument>,
    @InjectModel(SubField.name)
    private readonly subFieldModel: Model<SubFieldDocument>,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async create(createFieldDto: CreateFieldDto, userId: string): Promise<any> {
    try {
      // Check if field name already exists
      const existingField = await this.fieldModel.findOne({
        name: createFieldDto.name,
        isDeleted: { $ne: true },
      });

      if (existingField) {
        throw new ConflictException('Field with this name already exists');
      }

      // Check if phone number already exists
      const existingPhone = await this.fieldModel.findOne({
        phone: createFieldDto.phone,
        isDeleted: { $ne: true },
      });

      if (existingPhone) {
        throw new ConflictException(
          'Field with this phone number already exists',
        );
      }

      let uploadedUrls: string[] = [];

      // Upload images if provided
      if (createFieldDto.images && createFieldDto.images.length > 0) {
        const files = createFieldDto.images.map((file) => ({
          buffer: file.buffer,
          originalName: file.originalname,
        }));

        const uploads = await this.cloudinaryService.uploadMultipleFiles(
          files,
          'image',
        );
        uploadedUrls = uploads.map((upload) => upload.secure_url);
      }

      const { subFields, images, ...fieldDataWithoutSubFields } =
        createFieldDto;

      const fieldData = {
        ...fieldDataWithoutSubFields,
        images: uploadedUrls,
        userId: new Types.ObjectId(userId),
      };

      const newField = new this.fieldModel(fieldData);
      const savedField = await newField.save();

      if (createFieldDto.subFields && createFieldDto.subFields.length > 0) {
        for (const subField of createFieldDto.subFields) {
          const newSubField = new this.subFieldModel({
            fieldId: savedField._id,
            ...subField,
          });
          await newSubField.save();
        }
      }

      return ResponseUtil.created(
        this.formatFieldResponse(savedField),
        'Field created successfully',
      );
    } catch (error) {
      if (
        error instanceof ConflictException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new BadRequestException(`Failed to create field: ${error.message}`);
    }
  }

  async findAll(query: GetFieldsQueryDto = {}): Promise<any> {
    try {
      const {
        page = 1,
        limit = 10,
        name,
        address,
        search,
        sortBy = 'createdAt',
        sortOrder = 'desc',
      } = query;

      // Build filter object
      const filter: any = { isDeleted: { $ne: true } };

      if (search) {
        filter.$or = [
          { name: { $regex: search, $options: 'i' } },
          { address: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
          { facilities: { $elemMatch: { $regex: search, $options: 'i' } } },
        ];
      }

      if (name) {
        filter.name = { $regex: name, $options: 'i' };
      }

      if (address) {
        filter.address = { $regex: address, $options: 'i' };
      }

      // Calculate pagination
      const skip = (page - 1) * limit;

      // Build sort object
      const sort: any = {};
      sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

      // Get total count
      const total = await this.fieldModel.countDocuments(filter);

      // Get fields with pagination
      const fields = await this.fieldModel
        .find(filter)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .exec();

      const formattedFields = fields.map((field: any) =>
        this.formatFieldResponse(field),
      );

      return ResponseUtil.success(
        {
          fields: formattedFields,
          pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
            hasNextPage: page * limit < total,
            hasPrevPage: page > 1,
          },
        },
        'Fields retrieved successfully',
      );
    } catch (error) {
      throw new BadRequestException(
        `Failed to retrieve fields: ${error.message}`,
      );
    }
  }

  async findByUserId(
    userId: string,
    query: GetFieldsQueryDto = {},
  ): Promise<any> {
    try {
      if (!Types.ObjectId.isValid(userId)) {
        throw new BadRequestException('Invalid user ID');
      }

      const {
        page = 1,
        limit = 10,
        name,
        address,
        phone,
        search,
        sortBy = 'createdAt',
        sortOrder = 'desc',
      } = query;

      // Build filter object for user's fields
      const filter: any = {
        userId: new Types.ObjectId(userId),
        isDeleted: { $ne: true },
      };

      if (search) {
        filter.$or = [
          { name: { $regex: search, $options: 'i' } },
          { address: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
          { facilities: { $elemMatch: { $regex: search, $options: 'i' } } },
        ];
      }

      if (name) {
        filter.name = { $regex: name, $options: 'i' };
      }

      if (address) {
        filter.address = { $regex: address, $options: 'i' };
      }

      if (phone) {
        filter.phone = { $regex: phone, $options: 'i' };
      }

      // Build sort object
      const sort: any = {};
      sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

      // Calculate pagination
      const skip = (page - 1) * limit;

      // Get total count
      const total = await this.fieldModel.countDocuments(filter);

      // Get fields with subFields using aggregation
      const fields = await this.fieldModel.aggregate([
        { $match: filter },
        {
          $lookup: {
            from: 'subfields',
            localField: '_id',
            foreignField: 'fieldId',
            as: 'subFields',
          },
        },
        {
          $lookup: {
            from: 'users',
            localField: 'userId',
            foreignField: '_id',
            as: 'owner',
          },
        },
        {
          $addFields: {
            owner: { $arrayElemAt: ['$owner', 0] },
          },
        },
        {
          $project: {
            _id: 1,
            name: 1,
            address: 1,
            phone: 1,
            facilities: 1,
            slots: 1,
            description: 1,
            images: 1,
            userId: 1,
            isDeleted: 1,
            deletedAt: 1,
            createdAt: 1,
            updatedAt: 1,
            subFields: {
              $map: {
                input: '$subFields',
                as: 'subField',
                in: {
                  id: '$$subField._id',
                  name: '$$subField.name',
                  type: '$$subField.type',
                  pricePerHour: '$$subField.pricePerHour',
                  status: '$$subField.status',
                  createdAt: '$$subField.createdAt',
                  updatedAt: '$$subField.updatedAt',
                },
              },
            },
            owner: {
              id: '$owner._id',
              name: '$owner.name',
              email: '$owner.email',
              role: '$owner.role',
            },
          },
        },
        { $sort: sort },
        { $skip: skip },
        { $limit: limit },
      ]);

      const formattedFields = fields.map((field: any) =>
        this.formatFieldResponseWithSubFields(field),
      );

      return ResponseUtil.success(
        {
          fields: formattedFields,
          pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
            hasNextPage: page * limit < total,
            hasPrevPage: page > 1,
          },
        },
        'My fields retrieved successfully',
      );
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException(
        `Failed to retrieve my fields: ${error.message}`,
      );
    }
  }

  async getFieldsStatsByUserId(userId: string): Promise<any> {
    try {
      if (!Types.ObjectId.isValid(userId)) {
        throw new BadRequestException('Invalid user ID');
      }

      const filter = {
        userId: new Types.ObjectId(userId),
        isDeleted: { $ne: true },
      };

      // Get total fields count
      const totalFields = await this.fieldModel.countDocuments(filter);

      // Get fields with subFields count
      const fieldsWithSubFields = await this.fieldModel.aggregate([
        { $match: filter },
        {
          $lookup: {
            from: 'subfields',
            localField: '_id',
            foreignField: 'fieldId',
            as: 'subFields',
          },
        },
        {
          $project: {
            _id: 1,
            name: 1,
            subFieldsCount: { $size: '$subFields' },
          },
        },
      ]);

      // Calculate total subFields
      const totalSubFields = fieldsWithSubFields.reduce(
        (sum, field) => sum + field.subFieldsCount,
        0,
      );

      // Get recent fields (last 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const recentFields = await this.fieldModel.countDocuments({
        ...filter,
        createdAt: { $gte: thirtyDaysAgo },
      });

      // Get fields by status (if we had status field)
      const fieldsByStatus = await this.fieldModel.aggregate([
        { $match: filter },
        {
          $group: {
            _id: '$isActive', // Using isActive as status indicator
            count: { $sum: 1 },
          },
        },
      ]);

      const stats = {
        totalFields,
        totalSubFields,
        recentFields,
        fieldsByStatus: fieldsByStatus.reduce((acc, item) => {
          acc[item._id ? 'active' : 'inactive'] = item.count;
          return acc;
        }, {}),
        fieldsWithSubFields: fieldsWithSubFields.map((field) => ({
          id: field._id,
          name: field.name,
          subFieldsCount: field.subFieldsCount,
        })),
      };

      return ResponseUtil.success(
        stats,
        'My fields statistics retrieved successfully',
      );
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException(
        `Failed to retrieve my fields statistics: ${error.message}`,
      );
    }
  }

  async findById(id: string): Promise<any> {
    try {
      if (!Types.ObjectId.isValid(id)) {
        throw new BadRequestException('Invalid field ID 2');
      }

      const field = await this.fieldModel
        .findOne({ _id: id, isDeleted: { $ne: true } })
        .populate('userId', 'name -_id')
        .exec();

      if (!field) {
        throw new NotFoundException('Field not found');
      }

      return ResponseUtil.success(
        this.formatFieldResponse(field),
        'Field retrieved successfully',
      );
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new BadRequestException(
        `Failed to retrieve field: ${error.message}`,
      );
    }
  }

  async update(id: string, updateFieldDto: UpdateFieldDto): Promise<any> {
    try {
      if (!Types.ObjectId.isValid(id)) {
        throw new BadRequestException('Invalid field ID');
      }

      const existingField = await this.fieldModel.findOne({
        _id: id,
        isDeleted: { $ne: true },
      });

      if (!existingField) {
        throw new NotFoundException('Field not found');
      }

      // Check name conflict
      if (updateFieldDto.name && updateFieldDto.name !== existingField.name) {
        const conflict = await this.fieldModel.findOne({
          name: updateFieldDto.name,
          _id: { $ne: id },
          isDeleted: { $ne: true },
        });
        if (conflict) {
          throw new ConflictException('Field with this name already exists');
        }
      }

      // Check phone conflict
      if (
        updateFieldDto.phone &&
        updateFieldDto.phone !== existingField.phone
      ) {
        const conflict = await this.fieldModel.findOne({
          phone: updateFieldDto.phone,
          _id: { $ne: id },
          isDeleted: { $ne: true },
        });
        if (conflict) {
          throw new ConflictException(
            'Field with this phone number already exists',
          );
        }
      }

      let finalUrls = [...(existingField.images || [])];

      // 1. Delete old images
      if (updateFieldDto.removedImages?.length) {
        try {
          await this.cloudinaryService.deleteMultipleFiles(
            updateFieldDto.removedImages,
            'image',
          );
        } catch (error) {
          console.warn(
            'Failed to delete some images from Cloudinary:',
            error.message,
          );
        }
        finalUrls = finalUrls.filter(
          (u) => !updateFieldDto.removedImages!.includes(u),
        );
      }

      // 2. Upload new images
      if (updateFieldDto.images?.length) {
        const files = updateFieldDto.images.map((file) => ({
          buffer: file.buffer,
          originalName: file.originalname,
        }));

        const uploads = await this.cloudinaryService.uploadMultipleFiles(
          files,
          'image',
        );
        finalUrls.push(...uploads.map((u) => u.secure_url));
      }

      // 3. Prepare update data
      const updateData: any = {
        ...updateFieldDto,
      };

      // Remove the files and removedImages from updateData as they're not part of the schema
      delete updateData.images;
      delete updateData.removedImages;

      // 4. Handle subFields updates
      if (updateFieldDto.subFields && Array.isArray(updateFieldDto.subFields)) {
        await this.updateSubFields(id, updateFieldDto.subFields);
      }

      // Remove subFields from updateData as they're handled separately
      delete updateData.subFields;

      const updatedField = await this.fieldModel
        .findByIdAndUpdate(
          id,
          { ...updateData, images: finalUrls },
          { new: true },
        )
        .exec();

      return ResponseUtil.success(
        this.formatFieldResponse(updatedField),
        'Field updated successfully',
      );
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException ||
        error instanceof ConflictException
      ) {
        throw error;
      }
      throw new BadRequestException(`Failed to update field: ${error.message}`);
    }
  }

  async remove(id: string): Promise<any> {
    try {
      if (!Types.ObjectId.isValid(id)) {
        throw new BadRequestException('Invalid field ID');
      }

      const field = await this.fieldModel.findOne({
        _id: id,
        isDeleted: { $ne: true },
      });

      if (!field) {
        throw new NotFoundException('Field not found');
      }

      // Soft delete
      await this.fieldModel.findByIdAndUpdate(id, {
        isDeleted: true,
        deletedAt: new Date(),
      });

      return ResponseUtil.success(null, 'Field deleted successfully');
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new BadRequestException(`Failed to delete field: ${error.message}`);
    }
  }

  private formatFieldResponse(field: any) {
    return {
      id: field._id,
      name: field.name,
      address: field.address,
      owner: field.userId
        ? {
            name: field.userId.name,
          }
        : null,
      phone: field.phone,
      facilities: field.facilities,
      slots: field.slots,
      description: field.description,
      images: field.images,
      createdAt: field.createdAt,
      updatedAt: field.updatedAt,
    };
  }

  private formatFieldResponseWithSubFields(field: any) {
    return {
      id: field._id,
      name: field.name,
      address: field.address,
      phone: field.phone,
      facilities: field.facilities,
      slots: field.slots,
      description: field.description,
      images: field.images,
      createdAt: field.createdAt,
      updatedAt: field.updatedAt,
      subFields: field.subFields || [],
      owner: field.owner || null,
      subFieldsCount: field.subFields ? field.subFields.length : 0,
    };
  }

  async getSubFields(fieldId: string): Promise<any> {
    try {
      if (!Types.ObjectId.isValid(fieldId)) {
        throw new BadRequestException('Invalid field ID');
      }

      const field = await this.fieldModel.findById(fieldId);
      if (!field) {
        throw new NotFoundException('Field not found');
      }

      const subFields = await this.subFieldModel
        .find({
          fieldId: new Types.ObjectId(fieldId),
        })
        .sort({ createdAt: -1 });

      return ResponseUtil.success(
        subFields.map((subField: any) => ({
          id: subField._id,
          name: subField.name,
          type: subField.type,
          pricePerHour: subField.pricePerHour,
          status: subField.status,
          createdAt: subField.createdAt,
          updatedAt: subField.updatedAt,
        })),
        'Sub-fields retrieved successfully',
      );
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new BadRequestException(
        `Failed to retrieve sub-fields: ${error.message}`,
      );
    }
  }

  private async updateSubFields(
    fieldId: string,
    subFieldsData: any[],
  ): Promise<void> {
    try {
      const fieldObjectId = new Types.ObjectId(fieldId);

      // Get existing subFields for this field
      const existingSubFields = await this.subFieldModel.find({
        fieldId: fieldObjectId,
      });

      const existingSubFieldIds = existingSubFields.map((sf: any) =>
        sf._id.toString(),
      );
      const incomingSubFieldIds = subFieldsData
        .filter((sf) => sf._id)
        .map((sf) => sf._id);

      // Delete subFields that are no longer in the incoming data
      const subFieldsToDelete = existingSubFieldIds.filter(
        (id) => !incomingSubFieldIds.includes(id),
      );

      if (subFieldsToDelete.length > 0) {
        await this.subFieldModel.deleteMany({
          _id: { $in: subFieldsToDelete.map((id) => new Types.ObjectId(id)) },
        });
      }

      // Process each subField in the incoming data
      for (const subFieldData of subFieldsData) {
        if (subFieldData._id) {
          // Update existing subField
          await this.subFieldModel.findByIdAndUpdate(
            subFieldData._id,
            {
              name: subFieldData.name,
              type: subFieldData.type,
              pricePerHour: subFieldData.pricePerHour,
              status: subFieldData.status || 'available',
            },
            { new: true },
          );
        } else {
          // Create new subField
          const newSubField = new this.subFieldModel({
            fieldId: fieldObjectId,
            name: subFieldData.name,
            type: subFieldData.type,
            pricePerHour: subFieldData.pricePerHour,
            status: subFieldData.status || 'available',
          });
          await newSubField.save();
        }
      }
    } catch (error) {
      throw new BadRequestException(
        `Failed to update sub-fields: ${error.message}`,
      );
    }
  }
}
