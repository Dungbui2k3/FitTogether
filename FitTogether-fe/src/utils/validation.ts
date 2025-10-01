/**
 * Validation utilities for form inputs
 */

/**
 * Validates Vietnamese phone number format
 * Supports formats: +84xxxxxxxxx, 84xxxxxxxxx, 0xxxxxxxxx
 */
export const validateVietnamesePhone = (phone: string): { isValid: boolean; message?: string } => {
  const phoneRegex = /^(\+84|84|0)[1-9][0-9]{8,9}$/;
  
  if (!phone) {
    return { isValid: false, message: "Phone number is required" };
  }
  
  if (!phoneRegex.test(phone)) {
    return { isValid: false, message: "Please enter a valid Vietnamese phone number" };
  }
  
  return { isValid: true };
};

/**
 * Validates email format
 */
export const validateEmail = (email: string): { isValid: boolean; message?: string } => {
  if (!email) {
    return { isValid: true }; // Email is optional
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  if (!emailRegex.test(email)) {
    return { isValid: false, message: "Please enter a valid email address" };
  }
  
  return { isValid: true };
};

/**
 * Validates required text fields
 */
export const validateRequired = (value: string, fieldName: string): { isValid: boolean; message?: string } => {
  if (!value || value.trim() === '') {
    return { isValid: false, message: `${fieldName} is required` };
  }
  
  return { isValid: true };
};

/**
 * Validates checkout form data
 */
export interface CheckoutFormData {
  fullName: string;
  email: string;
  address: string;
}

export const validateCheckoutForm = (formData: CheckoutFormData): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  // Validate required fields
  const fullNameValidation = validateRequired(formData.fullName, "Full name");
  if (!fullNameValidation.isValid) {
    errors.push(fullNameValidation.message!);
  }
  
  const addressValidation = validateRequired(formData.address, "Address");
  if (!addressValidation.isValid) {
    errors.push(addressValidation.message!);
  }
  
  
  // Validate email (optional)
  const emailValidation = validateEmail(formData.email);
  if (!emailValidation.isValid) {
    errors.push(emailValidation.message!);
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Validates order items (ensures digital products have quantity = 1)
 */
export interface OrderItemValidation {
  productId: string;
  type: 'digital' | 'physical';
  quantity: number;
}

export const validateOrderItems = (items: OrderItemValidation[]): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  for (const item of items) {
    if (item.type === 'digital' && item.quantity !== 1) {
      errors.push(`Digital product ${item.productId} must have quantity 1`);
    }
    if (item.quantity < 1) {
      errors.push(`Product ${item.productId} must have quantity at least 1`);
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};
