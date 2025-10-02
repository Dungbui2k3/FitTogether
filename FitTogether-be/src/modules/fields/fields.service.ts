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
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async create(createFieldDto: CreateFieldDto): Promise<any> {
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
        throw new ConflictException('Field with this phone number already exists');
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

      const fieldData = {
        ...createFieldDto,
        images: uploadedUrls,
      };

      const newField = new this.fieldModel(fieldData);
      const savedField = await newField.save();

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
      throw new BadRequestException(
        `Failed to create field: ${error.message}`,
      );
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

  async findById(id: string): Promise<any> {
    try {
      if (!Types.ObjectId.isValid(id)) {
        throw new BadRequestException('Invalid field ID');
      }

      const field = await this.fieldModel
        .findOne({ _id: id, isDeleted: { $ne: true } })
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
      if (
        updateFieldDto.name &&
        updateFieldDto.name !== existingField.name
      ) {
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
          throw new ConflictException('Field with this phone number already exists');
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

      const updatedField = await this.fieldModel
        .findByIdAndUpdate(id, { ...updateData, images: finalUrls }, { new: true })
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
      throw new BadRequestException(
        `Failed to update field: ${error.message}`,
      );
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
      throw new BadRequestException(
        `Failed to delete field: ${error.message}`,
      );
    }
  }

  private formatFieldResponse(field: any) {
    return {
      id: field._id,
      name: field.name,
      address: field.address,
      phone: field.phone,
      facilities: field.facilities,
      description: field.description,
      images: field.images,
      createdAt: field.createdAt,
      updatedAt: field.updatedAt,
    };
  }
}
