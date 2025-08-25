// Validation utilities for ICS forms

/**
 * Email validation
 * @param {string} email - Email to validate
 * @returns {boolean} - True if valid email format
 */
export const validateEmail = (email) => {
  if (!email) return true; // Optional field
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Phone number validation (international format)
 * @param {string} phone - Phone number to validate
 * @returns {boolean} - True if valid phone format
 */
export const validatePhone = (phone) => {
  if (!phone) return true; // Optional field
  // Allow digits, spaces, parentheses, plus, minus, forward slash
  // eslint-disable-next-line
  const phoneRegex = /^[\d\s()+\-\/]+$/;
  // eslint-disable-next-line
  return phoneRegex.test(phone) && phone.replace(/[\s()+\-\/]/g, '').length >= 7;
};


/**
 * Tax number validation for different countries
 * @param {string} taxNumber - Tax number to validate
 * @param {string} country - Country code (GR, CA, etc.)
 * @returns {boolean} - True if valid tax number
 */
export const validateTaxNumber = (taxNumber, country) => {
  if (!taxNumber) return true; // Optional field
  
  switch (country) {
    case 'GR': // Greek AFM
      // 9 digits, check digit validation
      if (!/^\d{9}$/.test(taxNumber)) return false;
      return validateGreekAFM(taxNumber);
      
    case 'CA': // Canadian SIN
      // 9 digits, check digit validation
      if (!/^\d{9}$/.test(taxNumber)) return false;
      return validateCanadianSIN(taxNumber);
      
    default:
      // For other countries, just check if it's alphanumeric
      return /^[A-Za-z0-9]+$/.test(taxNumber);
  }
};

/**
 * Greek AFM (ΑΦΜ) validation
 * @param {string} afm - 9-digit AFM
 * @returns {boolean} - True if valid AFM
 */
const validateGreekAFM = (afm) => {
  if (afm.length !== 9) return false;
  
  // Check digit validation algorithm
  const weights = [256, 128, 64, 32, 16, 8, 4, 2, 1];
  let sum = 0;
  
  for (let i = 0; i < 8; i++) {
    sum += parseInt(afm[i]) * weights[i];
  }
  
  const remainder = sum % 11;
  const checkDigit = remainder % 10;
  
  return parseInt(afm[8]) === checkDigit;
};

/**
 * Canadian SIN validation
 * @param {string} sin - 9-digit SIN
 * @returns {boolean} - True if valid SIN
 */
const validateCanadianSIN = (sin) => {
  if (sin.length !== 9) return false;
  
  // Luhn algorithm for SIN validation
  let sum = 0;
  let isEven = false;
  
  for (let i = sin.length - 1; i >= 0; i--) {
    let digit = parseInt(sin[i]);
    
    if (isEven) {
      digit *= 2;
      if (digit > 9) {
        digit = Math.floor(digit / 10) + (digit % 10);
      }
    }
    
    sum += digit;
    isEven = !isEven;
  }
  
  return sum % 10 === 0;
};

/**
 * AMKA (Greek Social Security Number) validation
 * @param {string} amka - 11-digit AMKA
 * @returns {boolean} - True if valid AMKA
 */
export const validateAMKA = (amka) => {
  if (!amka) return true; // Optional field
  if (!/^\d{11}$/.test(amka)) return false;
  
  // Check digit validation for AMKA
  const weights = [2, 4, 8, 3, 5, 9, 7, 6, 10, 1];
  let sum = 0;
  
  for (let i = 0; i < 10; i++) {
    sum += parseInt(amka[i]) * weights[i];
  }
  
  const remainder = sum % 11;
  const checkDigit = remainder === 10 ? 0 : remainder;
  
  return parseInt(amka[10]) === checkDigit;
};

/**
 * Postal code validation for different countries
 * @param {string} postalCode - Postal code to validate
 * @param {string} countryId - Country ID
 * @returns {boolean} - True if valid postal code format
 */
export const validatePostalCode = (postalCode, countryId) => {
  if (!postalCode) return true; // Optional field
  
  switch (countryId) {
    case 'GR': // Greece
      // 5 digits
      return /^\d{5}$/.test(postalCode);
      
    case 'CA': // Canada
      // A9A 9A9 format
      return /^[A-Za-z]\d[A-Za-z]\s?\d[A-Za-z]\d$/.test(postalCode);
      
    default:
      // For other countries, allow alphanumeric with spaces and hyphens
      // eslint-disable-next-line
      return /^[A-Za-z0-9\s\-]+$/.test(postalCode);
  }
};

/**
 * Passport number validation
 * @param {string} passportNumber - Passport number to validate
 * @returns {boolean} - True if valid passport format
 */
export const validatePassportNumber = (passportNumber) => {
  if (!passportNumber) return true; // Optional field
  // Allow alphanumeric characters, typically 6-9 characters
  return /^[A-Za-z0-9]{6,9}$/.test(passportNumber);
};

/**
 * Bank code validation
 * @param {string} bankCode - Bank code to validate
 * @returns {boolean} - True if valid bank code
 */
export const validateBankCode = (bankCode) => {
  if (!bankCode) return true; // Optional field
  // 3 digits for bank code
  return /^\d{3}$/.test(bankCode);
};

/**
 * Branch number validation
 * @param {string} branchNumber - Branch number to validate
 * @returns {boolean} - True if valid branch number
 */
export const validateBranchNumber = (branchNumber) => {
  if (!branchNumber) return true; // Optional field
  // 5 digits for branch number
  return /^\d{5}$/.test(branchNumber);
};

/**
 * SWIFT code validation
 * @param {string} swiftCode - SWIFT code to validate
 * @returns {boolean} - True if valid SWIFT code
 */
export const validateSwiftCode = (swiftCode) => {
  if (!swiftCode) return true; // Optional field
  // 8 or 11 characters, alphanumeric
  return /^[A-Z]{6}[A-Z0-9]{2}([A-Z0-9]{3})?$/.test(swiftCode);
};

/**
 * IBAN validation
 * @param {string} iban - IBAN to validate
 * @returns {boolean} - True if valid IBAN
 */
export const validateIBAN = (iban) => {
  if (!iban) return true; // Optional field
  // Basic IBAN format validation (country code + 2 digits + alphanumeric)
  return /^[A-Z]{2}\d{2}[A-Z0-9]{4,30}$/.test(iban);
};

/**
 * File code validation (TOR/000256/05-2019 format)
 * @param {string} fileCode - File code to validate
 * @returns {boolean} - True if valid file code format
 */
export const validateFileCode = (fileCode) => {
  if (!fileCode) return true; // Optional field
  // Format: 3 uppercase letters / 6 digits / 2 digits - 4 digits
  return /^[A-Z]{3}\/\d{6}\/\d{2}-\d{4}$/.test(fileCode);
};

/**
 * Construction year validation
 * @param {string} year - Year to validate
 * @returns {boolean} - True if valid construction year
 */
export const validateConstructionYear = (year) => {
  if (!year) return true; // Optional field
  const currentYear = new Date().getFullYear();
  const yearNum = parseInt(year);
  return yearNum >= 1800 && yearNum <= currentYear + 1;
};

/**
 * Effort time validation (0.5 step increments)
 * @param {number} effortTime - Effort time in hours
 * @returns {boolean} - True if valid effort time
 */
export const validateEffortTime = (effortTime) => {
  if (!effortTime) return true; // Optional field
  return effortTime >= 0 && effortTime % 0.5 === 0;
};

/**
 * Transaction type validation (E/P)
 * @param {string} transactionType - Transaction type to validate
 * @returns {boolean} - True if valid transaction type
 */
export const validateTransactionType = (transactionType) => {
  if (!transactionType) return true; // Optional field
  return ['E', 'P'].includes(transactionType.toUpperCase());
};

/**
 * Name validation (Greek/English names)
 * @param {string} name - Name to validate
 * @returns {boolean} - True if valid name format
 */
export const validateName = (name) => {
  if (!name) return true; // Optional field
  // Allow letters, spaces, hyphens, apostrophes for names
  return /^[A-Za-zΑ-Ωα-ωάέήίόύώϊϋΐΰ\s\-']+$/.test(name);
};

/**
 * Date validation
 * @param {string} date - Date to validate
 * @returns {boolean} - True if valid date
 */
export const validateDate = (date) => {
  if (!date) return true; // Optional field
  const dateObj = new Date(date);
  return dateObj instanceof Date && !isNaN(dateObj);
};

/**
 * Date range validation
 * @param {string} startDate - Start date
 * @param {string} endDate - End date
 * @returns {boolean} - True if valid date range
 */
export const validateDateRange = (startDate, endDate) => {
  if (!startDate || !endDate) return true; // Optional fields
  const start = new Date(startDate);
  const end = new Date(endDate);
  return start <= end;
};

/**
 * Required field validation
 * @param {*} value - Value to check
 * @returns {boolean} - True if value is not empty
 */
export const validateRequired = (value) => {
  if (typeof value === 'string') {
    return value.trim().length > 0;
  }
  return value !== null && value !== undefined;
};

/**
 * Number range validation
 * @param {number} value - Number to validate
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {boolean} - True if value is within range
 */
export const validateNumberRange = (value, min, max) => {
  if (!value) return true; // Optional field
  const num = parseFloat(value);
  return !isNaN(num) && num >= min && num <= max;
};

/**
 * String length validation
 * @param {string} value - String to validate
 * @param {number} minLength - Minimum length
 * @param {number} maxLength - Maximum length
 * @returns {boolean} - True if string length is within range
 */
export const validateStringLength = (value, minLength, maxLength) => {
  if (!value) return true; // Optional field
  const length = value.length;
  return length >= minLength && length <= maxLength;
};

/**
 * Custom validation function for complex business rules
 * @param {Object} formData - Form data object
 * @param {Object} rules - Validation rules object
 * @returns {Object} - Object with field names as keys and error messages as values
 */
export const validateFormData = (formData, rules) => {
  const errors = {};
  
  Object.keys(rules).forEach(fieldName => {
    const fieldRules = rules[fieldName];
    const fieldValue = formData[fieldName];
    
    // Required validation
    if (fieldRules.required && !validateRequired(fieldValue)) {
      errors[fieldName] = fieldRules.requiredMessage || `${fieldName} is required`;
      return;
    }
    
    // Skip other validations if field is empty and not required
    if (!fieldValue && !fieldRules.required) return;
    
    // Email validation
    if (fieldRules.email && !validateEmail(fieldValue)) {
      errors[fieldName] = fieldRules.emailMessage || 'Invalid email format';
    }
    
    // Phone validation
    if (fieldRules.phone && !validatePhone(fieldValue)) {
      errors[fieldName] = fieldRules.phoneMessage || 'Invalid phone format';
    }
    
    // Tax number validation
    if (fieldRules.taxNumber) {
      const country = fieldRules.taxNumberCountry || 'GR';
      if (!validateTaxNumber(fieldValue, country)) {
        errors[fieldName] = fieldRules.taxNumberMessage || 'Invalid tax number';
      }
    }
    
    // Postal code validation
    if (fieldRules.postalCode) {
      const country = fieldRules.postalCodeCountry || formData.country_id;
      if (!validatePostalCode(fieldValue, country)) {
        errors[fieldName] = fieldRules.postalCodeMessage || 'Invalid postal code';
      }
    }
    
    // Date validation
    if (fieldRules.date && !validateDate(fieldValue)) {
      errors[fieldName] = fieldRules.dateMessage || 'Invalid date';
    }
    
    // Custom validation function
    if (fieldRules.custom && typeof fieldRules.custom === 'function') {
      const customError = fieldRules.custom(fieldValue, formData);
      if (customError) {
        errors[fieldName] = customError;
      }
    }
  });
  
  return errors;
};

// eslint-disable-next-line
export default {
  validateEmail,
  validatePhone,
  validateTaxNumber,
  validateAMKA,
  validatePostalCode,
  validatePassportNumber,
  validateBankCode,
  validateBranchNumber,
  validateSwiftCode,
  validateIBAN,
  validateFileCode,
  validateConstructionYear,
  validateEffortTime,
  validateTransactionType,
  validateName,
  validateDate,
  validateDateRange,
  validateRequired,
  validateNumberRange,
  validateStringLength,
  validateFormData
};
