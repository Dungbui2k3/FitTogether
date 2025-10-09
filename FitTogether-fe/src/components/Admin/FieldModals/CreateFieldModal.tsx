import React, { useState } from "react";
import { X, Plus, Trash2, Upload, AlertTriangle } from "lucide-react";
import { fieldService } from "../../../services/fieldService";
import { useToast } from "../../../hooks";
import type { CreateFieldRequest } from "../../../types/field";
import { CreateSubFieldRequest } from "../../../types/subField";

interface CreateFieldModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const CreateFieldModal: React.FC<CreateFieldModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { success, error } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<CreateFieldRequest>({
    name: "",
    address: "",
    phone: "",
    facilities: [""],
    slots: [""],
    description: "",
    images: [],
    subFields: [],
  });

  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>([]);

  if (!isOpen) return null;

  const handleInputChange = (
    field: keyof CreateFieldRequest,
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleFacilityChange = (index: number, value: string) => {
    const newFacilities = [...formData.facilities];
    newFacilities[index] = value;
    setFormData((prev) => ({
      ...prev,
      facilities: newFacilities,
    }));
  };

  const addFacility = () => {
    setFormData((prev) => ({
      ...prev,
      facilities: [...prev.facilities, ""],
    }));
  };

  const removeFacility = (index: number) => {
    if (formData.facilities.length > 1) {
      const newFacilities = formData.facilities.filter((_, i) => i !== index);
      setFormData((prev) => ({
        ...prev,
        facilities: newFacilities,
      }));
    }
  };

  // SubFields management
  const handleSubFieldChange = (index: number, field: keyof CreateSubFieldRequest, value: string | number) => {
    const newSubFields = [...(formData.subFields || [])];
    if (!newSubFields[index]) {
      newSubFields[index] = {
        name: '',
        type: '',
        pricePerHour: 0,
        status: 'available'
      };
    }
    newSubFields[index] = { ...newSubFields[index], [field]: value };
    setFormData((prev) => ({
      ...prev,
      subFields: newSubFields,
    }));
  };

  const addSubField = () => {
    const newSubField: CreateSubFieldRequest = {
      name: '',
      type: '',
      pricePerHour: 0,
      status: 'available'
    };
    setFormData((prev) => ({
      ...prev,
      subFields: [...(prev.subFields || []), newSubField],
    }));
  };

  const removeSubField = (index: number) => {
    const newSubFields = (formData.subFields || []).filter((_, i) => i !== index);
    setFormData((prev) => ({
      ...prev,
      subFields: newSubFields,
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      setImageFiles((prev) => [...prev, ...files]);

      // Create preview URLs
      files.forEach((file) => {
        const url = URL.createObjectURL(file);
        setImageUrls((prev) => [...prev, url]);
      });
    }
  };

  const removeImage = (index: number) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
    setImageUrls((prev) => {
      // Revoke the URL to prevent memory leaks
      URL.revokeObjectURL(prev[index]);
      return prev.filter((_, i) => i !== index);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.name.trim()) {
      error("Tên sân là bắt buộc");
      return;
    }
    if (!formData.address.trim()) {
      error("Địa chỉ là bắt buộc");
      return;
    }
    if (!formData.phone.trim()) {
      error("Số điện thoại là bắt buộc");
      return;
    }

    // Filter out empty facilities and ensure we have a valid array
    const facilities = Array.isArray(formData.facilities)
      ? formData.facilities.filter((f) => f && f.trim() !== "")
      : [];

    if (facilities.length === 0) {
      error("Ít nhất một tiện ích là bắt buộc");
      return;
    }

    // Validate time slots
    const invalidSlots = formData.slots.filter(slot => !isValidSlot(slot));
    if (invalidSlots.length > 0) {
      error("Thời gian bắt đầu phải nhỏ hơn thời gian kết thúc trong tất cả các khung giờ");
      return;
    }

    setLoading(true);

    try {
      const formDataToSend = new FormData();

      // Append text fields
      formDataToSend.append("name", formData.name.trim());
      formDataToSend.append("address", formData.address.trim());
      formDataToSend.append("phone", formData.phone.trim());
      formDataToSend.append("description", formData.description?.trim() || "");

      formDataToSend.append("facilities", JSON.stringify(facilities));
      formDataToSend.append("slots", JSON.stringify(formData.slots));

      // Append subFields if any (try as individual form fields)
      if (formData.subFields && formData.subFields.length > 0) {
        // Filter out empty subFields
        const validSubFields = formData.subFields.filter(subField => 
          subField.name && subField.name.trim() !== ''
        );
        
        if (validSubFields.length > 0) {
          // Try sending each subField as individual form fields
          validSubFields.forEach((subField, index) => {
            formDataToSend.append(`subFields[${index}][name]`, subField.name);
            formDataToSend.append(`subFields[${index}][type]`, subField.type || '');
            formDataToSend.append(`subFields[${index}][pricePerHour]`, subField.pricePerHour.toString());
            formDataToSend.append(`subFields[${index}][status]`, subField.status || 'available');
          });
        }
      }

      // Append image files
      imageFiles.forEach((file) => {
        formDataToSend.append("images", file);
      });

      // Debug: Log what we're sending
      console.log("Form data being sent:");
      console.log("subFields:", formData.subFields);
      
      // Log FormData contents for debugging
      console.log("FormData contents:");
      for (let [key, value] of formDataToSend.entries()) {
        if (key.startsWith('subFields')) {
          console.log(`${key}:`, value);
        }
      }
      
      const response = await fieldService.createField(formDataToSend as any);

      if (response.success) {
        success("Tạo sân thể thao thành công");
        onSuccess();
        handleClose();
      } else {
        // Hiển thị lỗi từ response
        const errorMessage =
          response.error || response.message || "Không thể tạo sân thể thao";
        error(errorMessage);
      }
    } catch (err: any) {
      console.error("Error creating field:", err);

      // Xử lý các loại lỗi khác nhau
      let errorMessage = "Có lỗi xảy ra khi tạo sân thể thao";

      if (err?.response?.data) {
        // Lỗi từ API response với cấu trúc {status, code, message}
        const data = err.response.data;
        errorMessage = data.message || data.error || errorMessage;
      } else if (err?.message) {
        // Lỗi JavaScript general
        errorMessage = err.message;
      } else if (typeof err === "object" && err.message) {
        // Lỗi object trực tiếp với message
        errorMessage = err.message;
      }

      error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    // Clean up preview URLs
    imageUrls.forEach((url) => URL.revokeObjectURL(url));

    // Reset form
    setFormData({
      name: "",
      address: "",
      phone: "",
      facilities: [""],
      slots: [""],
      description: "",
      images: [],
    });
    setImageFiles([]);
    setImageUrls([]);

    onClose();
  };


  // Thêm slot mới
  const addSlot = () => {
    setFormData((prev) => ({ ...prev, slots: [...prev.slots, ""] }));
  };

  // Thay đổi slot theo start hoặc end
  const handleSlotChange = (
    index: number,
    key: "start" | "end",
    value: string
  ) => {
    const [start, end] = formData.slots[index]?.split("-") || ["", ""];
    const updated = [...formData.slots];
    
    if (key === "start") {
      updated[index] = `${value}-${end}`;
    } else {
      updated[index] = `${start}-${value}`;
    }
    
    setFormData((prev) => ({ ...prev, slots: updated }));
  };

  // Kiểm tra slot có hợp lệ không (start < end)
  const isValidSlot = (slot: string) => {
    const [start, end] = slot.split("-");
    if (!start || !end) return true; // Allow empty values during input
    return start < end;
  };

  // Xóa slot
  const removeSlot = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      slots: prev.slots.filter((_, i) => i !== index),
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">
            Tạo Sân Thể Thao Mới
          </h2>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-6 w-6 text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Thông Tin Cơ Bản
            </h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tên Sân *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Nhập tên sân thể thao"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Địa Chỉ *
              </label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => handleInputChange("address", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Nhập địa chỉ sân thể thao"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Số Điện Thoại *
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Nhập số điện thoại liên hệ"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mô Tả
              </label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  handleInputChange("description", e.target.value)
                }
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Nhập mô tả về sân thể thao"
              />
            </div>
          </div>

          {/* Facilities */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Tiện Ích</h3>
              <button
                type="button"
                onClick={addFacility}
                className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 transition-colors"
              >
                <Plus className="h-4 w-4" />
                <span className="text-sm">Thêm tiện ích</span>
              </button>
            </div>

            <div className="space-y-2">
              {formData.facilities.map((facility, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={facility}
                    onChange={(e) =>
                      handleFacilityChange(index, e.target.value)
                    }
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Nhập tiện ích"
                  />
                  {formData.facilities.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeFacility(index)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Slots */}
         
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Slot</h3>
               <button
            type="button"
            onClick={addSlot}
            className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span className="text-sm">Thêm khung giờ</span>
          </button>
            </div>

            {formData.slots.map((slot, index) => {
              const [start, end] = slot.split("-");
              const isValid = isValidSlot(slot);
              return (
                <div key={index} className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <input
                      type="time"
                      value={start || ""}
                      onChange={(e) =>
                        handleSlotChange(index, "start", e.target.value)
                      }
                      className={`flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:border-transparent ${
                        isValid 
                          ? "border-gray-300 focus:ring-blue-500" 
                          : "border-red-300 focus:ring-red-500 bg-red-50"
                      }`}
                    />
                    <span className="text-gray-500">-</span>
                    <input
                      type="time"
                      value={end || ""}
                      onChange={(e) =>
                        handleSlotChange(index, "end", e.target.value)
                      }
                      className={`flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:border-transparent ${
                        isValid 
                          ? "border-gray-300 focus:ring-blue-500" 
                          : "border-red-300 focus:ring-red-500 bg-red-50"
                      }`}
                    />
                    {formData.slots.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeSlot(index)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                  {!isValid && start && end && (
                    <p className="text-sm text-red-600 flex items-center">
                      <AlertTriangle className="h-4 w-4 mr-1" />
                      Thời gian bắt đầu phải nhỏ hơn thời gian kết thúc
                    </p>
                  )}
                </div>
              );
            })}
          </div>

          {/* SubField */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                Danh sách SubField
              </h3>
              <button
                type="button"
                onClick={addSubField}
                className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 transition-colors"
              >
                <Plus className="h-4 w-4" />
                <span className="text-sm">Thêm sân con</span>
              </button>
            </div>

            <div className="space-y-2">
              {(formData.subFields || []).map((subField, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={subField.name || ""}
                    onChange={(e) =>
                      handleSubFieldChange(index, "name", e.target.value)
                    }
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Tên sân con"
                  />
                  <input
                    type="text"
                    value={subField.type || ""}
                    onChange={(e) =>
                      handleSubFieldChange(index, "type", e.target.value)
                    }
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Loại sân"
                  />
                  <input
                    type="number"
                    value={subField.pricePerHour || 0}
                    onChange={(e) =>
                      handleSubFieldChange(index, "pricePerHour", Number(e.target.value))
                    }
                    className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Giá/giờ"
                  />
                  {(formData.subFields || []).length > 0 && (
                    <button
                      type="button"
                      onClick={() => removeSubField(index)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Images */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Hình Ảnh</h3>

            <div>
              <label className="block">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors cursor-pointer">
                  <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">
                    Nhấp để chọn hình ảnh hoặc kéo thả vào đây
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    PNG, JPG, GIF tối đa 10MB
                  </p>
                </div>
              </label>
            </div>

            {/* Image Preview */}
            {imageUrls.length > 0 && (
              <div className="grid grid-cols-2 gap-4">
                {imageUrls.map((url, index) => (
                  <div key={index} className="relative">
                    <img
                      src={url}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end space-x-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {loading && (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              )}
              <span>{loading ? "Đang tạo..." : "Tạo Sân"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateFieldModal;
