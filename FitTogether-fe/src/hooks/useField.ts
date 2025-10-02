import { useState, useEffect, useCallback } from 'react';
import { fieldService } from '../services/fieldService';
import { useToast } from './useToast';
import type { 
  Field, 
  FieldListParams, 
  FieldListResponse, 
  CreateFieldRequest, 
  UpdateFieldRequest 
} from '../types/field';

interface UseFieldsReturn {
  fields: Field[];
  loading: boolean;
  error: string | null;
  pagination: FieldListResponse['pagination'] | null;
  loadFields: (params?: FieldListParams) => Promise<void>;
  createField: (fieldData: CreateFieldRequest) => Promise<boolean>;
  updateField: (id: string, fieldData: UpdateFieldRequest) => Promise<boolean>;
  deleteField: (id: string) => Promise<boolean>;
  restoreField: (id: string) => Promise<boolean>;
  permanentDeleteField: (id: string) => Promise<boolean>;
  searchFields: (query: string) => Promise<Field[]>;
  getFieldById: (id: string) => Promise<Field | null>;
}

export const useFields = (initialParams?: FieldListParams): UseFieldsReturn => {
  const [fields, setFields] = useState<Field[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<FieldListResponse['pagination'] | null>(null);
  const { success, error: showError } = useToast();

  const loadFields = useCallback(async (params: FieldListParams = {}) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fieldService.getFields(params);
      
      if (response.success && response.data) {
        setFields(response.data.fields);
        setPagination(response.data.pagination);
      } else {
        setError(response.error || 'Không thể tải danh sách sân thể thao');
        showError(response.error || 'Không thể tải danh sách sân thể thao');
      }
    } catch (err) {
      const errorMessage = 'Có lỗi xảy ra khi tải danh sách sân thể thao';
      setError(errorMessage);
      showError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [showError]);

  const createField = useCallback(async (fieldData: CreateFieldRequest): Promise<boolean> => {
    setLoading(true);
    
    try {
      const response = await fieldService.createField(fieldData);
      
      if (response.success) {
        success('Tạo sân thể thao thành công!');
        await loadFields(initialParams);
        return true;
      } else {
        showError(response.error || 'Không thể tạo sân thể thao');
        return false;
      }
    } catch (err) {
      showError('Có lỗi xảy ra khi tạo sân thể thao');
      return false;
    } finally {
      setLoading(false);
    }
  }, [success, showError, loadFields, initialParams]);

  const updateField = useCallback(async (id: string, fieldData: UpdateFieldRequest): Promise<boolean> => {
    setLoading(true);
    
    try {
      const response = await fieldService.updateField(id, fieldData);
      
      if (response.success) {
        success('Cập nhật sân thể thao thành công!');
        await loadFields(initialParams);
        return true;
      } else {
        showError(response.error || 'Không thể cập nhật sân thể thao');
        return false;
      }
    } catch (err) {
      showError('Có lỗi xảy ra khi cập nhật sân thể thao');
      return false;
    } finally {
      setLoading(false);
    }
  }, [success, showError, loadFields, initialParams]);

  const deleteField = useCallback(async (id: string): Promise<boolean> => {
    setLoading(true);
    
    try {
      const response = await fieldService.deleteField(id);
      
      if (response.success) {
        success('Xóa sân thể thao thành công!');
        await loadFields(initialParams);
        return true;
      } else {
        showError(response.error || 'Không thể xóa sân thể thao');
        return false;
      }
    } catch (err) {
      showError('Có lỗi xảy ra khi xóa sân thể thao');
      return false;
    } finally {
      setLoading(false);
    }
  }, [success, showError, loadFields, initialParams]);

  const restoreField = useCallback(async (id: string): Promise<boolean> => {
    setLoading(true);
    
    try {
      const response = await fieldService.restoreField(id);
      
      if (response.success) {
        success('Khôi phục sân thể thao thành công!');
        await loadFields(initialParams);
        return true;
      } else {
        showError(response.error || 'Không thể khôi phục sân thể thao');
        return false;
      }
    } catch (err) {
      showError('Có lỗi xảy ra khi khôi phục sân thể thao');
      return false;
    } finally {
      setLoading(false);
    }
  }, [success, showError, loadFields, initialParams]);

  const permanentDeleteField = useCallback(async (id: string): Promise<boolean> => {
    setLoading(true);
    
    try {
      const response = await fieldService.permanentDeleteField(id);
      
      if (response.success) {
        success('Xóa vĩnh viễn sân thể thao thành công!');
        await loadFields(initialParams);
        return true;
      } else {
        showError(response.error || 'Không thể xóa vĩnh viễn sân thể thao');
        return false;
      }
    } catch (err) {
      showError('Có lỗi xảy ra khi xóa vĩnh viễn sân thể thao');
      return false;
    } finally {
      setLoading(false);
    }
  }, [success, showError, loadFields, initialParams]);

  const searchFields = useCallback(async (query: string): Promise<Field[]> => {
    try {
      const response = await fieldService.searchFields(query);
      
      if (response.success && response.data) {
        return response.data;
      } else {
        showError(response.error || 'Không thể tìm kiếm sân thể thao');
        return [];
      }
    } catch (err) {
      showError('Có lỗi xảy ra khi tìm kiếm sân thể thao');
      return [];
    }
  }, [showError]);

  const getFieldById = useCallback(async (id: string): Promise<Field | null> => {
    try {
      const response = await fieldService.getFieldById(id);
      
      if (response.success && response.data) {
        return response.data;
      } else {
        showError(response.error || 'Không thể lấy thông tin sân thể thao');
        return null;
      }
    } catch (err) {
      showError('Có lỗi xảy ra khi lấy thông tin sân thể thao');
      return null;
    }
  }, [showError]);

  // Load initial data
  useEffect(() => {
    if (initialParams) {
      loadFields(initialParams);
    }
  }, [loadFields, initialParams]);

  return {
    fields,
    loading,
    error,
    pagination,
    loadFields,
    createField,
    updateField,
    deleteField,
    restoreField,
    permanentDeleteField,
    searchFields,
    getFieldById,
  };
};

// Hook for single field
interface UseFieldReturn {
  field: Field | null;
  loading: boolean;
  error: string | null;
  loadField: (id: string) => Promise<void>;
  updateField: (fieldData: UpdateFieldRequest) => Promise<boolean>;
  deleteField: () => Promise<boolean>;
  restoreField: () => Promise<boolean>;
}

export const useField = (id?: string): UseFieldReturn => {
  const [field, setField] = useState<Field | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { success, error: showError } = useToast();

  const loadField = useCallback(async (fieldId: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fieldService.getFieldById(fieldId);
      
      if (response.success && response.data) {
        setField(response.data);
      } else {
        setError(response.error || 'Không thể tải thông tin sân thể thao');
        showError(response.error || 'Không thể tải thông tin sân thể thao');
      }
    } catch (err) {
      const errorMessage = 'Có lỗi xảy ra khi tải thông tin sân thể thao';
      setError(errorMessage);
      showError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [showError]);

  const updateField = useCallback(async (fieldData: UpdateFieldRequest): Promise<boolean> => {
    if (!field) return false;
    
    setLoading(true);
    
    try {
      const response = await fieldService.updateField(field._id, fieldData);
      
      if (response.success && response.data) {
        setField(response.data);
        success('Cập nhật sân thể thao thành công!');
        return true;
      } else {
        showError(response.error || 'Không thể cập nhật sân thể thao');
        return false;
      }
    } catch (err) {
      showError('Có lỗi xảy ra khi cập nhật sân thể thao');
      return false;
    } finally {
      setLoading(false);
    }
  }, [field, success, showError]);

  const deleteField = useCallback(async (): Promise<boolean> => {
    if (!field) return false;
    
    setLoading(true);
    
    try {
      const response = await fieldService.deleteField(field._id);
      
      if (response.success) {
        success('Xóa sân thể thao thành công!');
        return true;
      } else {
        showError(response.error || 'Không thể xóa sân thể thao');
        return false;
      }
    } catch (err) {
      showError('Có lỗi xảy ra khi xóa sân thể thao');
      return false;
    } finally {
      setLoading(false);
    }
  }, [field, success, showError]);

  const restoreField = useCallback(async (): Promise<boolean> => {
    if (!field) return false;
    
    setLoading(true);
    
    try {
      const response = await fieldService.restoreField(field._id);
      
      if (response.success && response.data) {
        setField(response.data);
        success('Khôi phục sân thể thao thành công!');
        return true;
      } else {
        showError(response.error || 'Không thể khôi phục sân thể thao');
        return false;
      }
    } catch (err) {
      showError('Có lỗi xảy ra khi khôi phục sân thể thao');
      return false;
    } finally {
      setLoading(false);
    }
  }, [field, success, showError]);

  // Load initial data
  useEffect(() => {
    if (id) {
      loadField(id);
    }
  }, [id, loadField]);

  return {
    field,
    loading,
    error,
    loadField,
    updateField,
    deleteField,
    restoreField,
  };
};
