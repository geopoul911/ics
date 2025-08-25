// Utility functions for advanced search and filtering

/**
 * Filter data based on search criteria
 * @param {Array} data - The data to filter
 * @param {Object} criteria - Search criteria object
 * @returns {Array} - Filtered data
 */
export const filterData = (data, criteria) => {
  if (!criteria || Object.keys(criteria).length === 0) {
    return data;
  }

  return data.filter(item => {
    return Object.entries(criteria).every(([key, value]) => {
      return applyFilter(item, key, value);
    });
  });
};

/**
 * Apply a single filter to an item
 * @param {Object} item - The data item
 * @param {string} key - The filter key
 * @param {any} value - The filter value
 * @returns {boolean} - Whether the item passes the filter
 */
const applyFilter = (item, key, value) => {
  if (!value || (Array.isArray(value) && value.length === 0)) {
    return true;
  }

  // Handle nested object properties (e.g., "client.name")
  const itemValue = getNestedValue(item, key);
  
  if (Array.isArray(value)) {
    // Multi-select filter
    return value.some(v => matchesValue(itemValue, v));
  }

  return matchesValue(itemValue, value);
};

/**
 * Get nested object value using dot notation
 * @param {Object} obj - The object
 * @param {string} path - The path (e.g., "client.name")
 * @returns {any} - The value at the path
 */
const getNestedValue = (obj, path) => {
  return path.split('.').reduce((current, key) => {
    return current && current[key] !== undefined ? current[key] : null;
  }, obj);
};

/**
 * Check if a value matches the filter criteria
 * @param {any} itemValue - The item's value
 * @param {any} filterValue - The filter value
 * @returns {boolean} - Whether the values match
 */
const matchesValue = (itemValue, filterValue) => {
  if (itemValue === null || itemValue === undefined) {
    return false;
  }

  // Convert both values to strings for comparison
  const itemStr = itemValue.toString().toLowerCase();
  const filterStr = filterValue.toString().toLowerCase();

  // Check if item value contains the filter value
  return itemStr.includes(filterStr);
};

/**
 * Filter by date range
 * @param {Array} data - The data to filter
 * @param {string} dateField - The date field name
 * @param {string} fromDate - Start date (YYYY-MM-DD)
 * @param {string} toDate - End date (YYYY-MM-DD)
 * @returns {Array} - Filtered data
 */
export const filterByDateRange = (data, dateField, fromDate, toDate) => {
  if (!fromDate && !toDate) {
    return data;
  }

  return data.filter(item => {
    const itemDate = new Date(item[dateField]);
    const from = fromDate ? new Date(fromDate) : null;
    const to = toDate ? new Date(toDate) : null;

    if (from && to) {
      return itemDate >= from && itemDate <= to;
    } else if (from) {
      return itemDate >= from;
    } else if (to) {
      return itemDate <= to;
    }

    return true;
  });
};

/**
 * Filter by status
 * @param {Array} data - The data to filter
 * @param {string} statusField - The status field name
 * @param {Array} statuses - Array of status values to include
 * @returns {Array} - Filtered data
 */
export const filterByStatus = (data, statusField, statuses) => {
  if (!statuses || statuses.length === 0) {
    return data;
  }

  return data.filter(item => {
    const itemStatus = item[statusField];
    return statuses.includes(itemStatus);
  });
};

/**
 * Filter by boolean field
 * @param {Array} data - The data to filter
 * @param {string} field - The field name
 * @param {boolean} value - The boolean value to filter by
 * @returns {Array} - Filtered data
 */
export const filterByBoolean = (data, field, value) => {
  if (value === null || value === undefined) {
    return data;
  }

  return data.filter(item => item[field] === value);
};

/**
 * Filter by numeric range
 * @param {Array} data - The data to filter
 * @param {string} field - The field name
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {Array} - Filtered data
 */
export const filterByNumericRange = (data, field, min, max) => {
  if (min === null && max === null) {
    return data;
  }

  return data.filter(item => {
    const value = parseFloat(item[field]);
    if (isNaN(value)) return false;

    if (min !== null && max !== null) {
      return value >= min && value <= max;
    } else if (min !== null) {
      return value >= min;
    } else if (max !== null) {
      return value <= max;
    }

    return true;
  });
};

/**
 * Search in multiple fields
 * @param {Array} data - The data to search
 * @param {string} searchTerm - The search term
 * @param {Array} fields - Array of field names to search in
 * @returns {Array} - Filtered data
 */
export const searchInFields = (data, searchTerm, fields) => {
  if (!searchTerm || searchTerm.trim() === '') {
    return data;
  }

  const term = searchTerm.toLowerCase().trim();

  return data.filter(item => {
    return fields.some(field => {
      const value = getNestedValue(item, field);
      if (value === null || value === undefined) return false;
      return value.toString().toLowerCase().includes(term);
    });
  });
};

/**
 * Sort data by multiple criteria
 * @param {Array} data - The data to sort
 * @param {Array} sortCriteria - Array of sort criteria objects
 * @returns {Array} - Sorted data
 */
export const sortData = (data, sortCriteria) => {
  if (!sortCriteria || sortCriteria.length === 0) {
    return data;
  }

  return [...data].sort((a, b) => {
    for (const criteria of sortCriteria) {
      const { field, direction = 'asc' } = criteria;
      const aValue = getNestedValue(a, field);
      const bValue = getNestedValue(b, field);

      if (aValue === bValue) continue;

      let comparison = 0;
      if (aValue < bValue) comparison = -1;
      if (aValue > bValue) comparison = 1;

      return direction === 'desc' ? -comparison : comparison;
    }
    return 0;
  });
};

/**
 * Build search criteria for API calls
 * @param {Object} criteria - The search criteria
 * @returns {Object} - Formatted criteria for API
 */
export const buildApiSearchCriteria = (criteria) => {
  const apiCriteria = {};

  Object.entries(criteria).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      if (value.length > 0) {
        apiCriteria[key] = value.join(',');
      }
    } else if (value && value.toString().trim() !== '') {
      apiCriteria[key] = value;
    }
  });

  return apiCriteria;
};

/**
 * Get unique values from a field for dropdown options
 * @param {Array} data - The data array
 * @param {string} field - The field name
 * @returns {Array} - Array of unique values
 */
export const getUniqueValues = (data, field) => {
  const values = new Set();
  
  data.forEach(item => {
    const value = getNestedValue(item, field);
    if (value !== null && value !== undefined) {
      values.add(value);
    }
  });

  return Array.from(values).sort();
};

/**
 * Create filter options from unique values
 * @param {Array} data - The data array
 * @param {string} field - The field name
 * @param {string} label - The display label
 * @returns {Array} - Array of option objects
 */
export const createFilterOptions = (data, field, label) => {
  const uniqueValues = getUniqueValues(data, field);
  
  return uniqueValues.map(value => ({
    value: value,
    label: value
  }));
};
