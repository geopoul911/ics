import React, { useState, useEffect } from 'react';
import {
  Card,
  Form,
  Row,
  Col,
  Button,
  Badge,
  Collapse
} from 'react-bootstrap';
import { FaSearch, FaFilter, FaTimes } from 'react-icons/fa';

const AdvancedSearch = ({
  filters = [],
  onSearch,
  onClear,
  showAdvanced = false,
  onToggleAdvanced
}) => {
  const [searchCriteria, setSearchCriteria] = useState({});
  const [activeFilters, setActiveFilters] = useState(0);

  // Initialize search criteria based on available filters
  useEffect(() => {
    const initialCriteria = {};
    filters.forEach(filter => {
      if (filter.type === 'dateRange') {
        initialCriteria[`${filter.key}_from`] = '';
        initialCriteria[`${filter.key}_to`] = '';
      } else if (filter.type === 'select' && filter.multiple) {
        initialCriteria[filter.key] = [];
      } else {
        initialCriteria[filter.key] = '';
      }
    });
    setSearchCriteria(initialCriteria);
  }, [filters]);

  // Count active filters
  useEffect(() => {
    let count = 0;
    Object.values(searchCriteria).forEach(value => {
      if (Array.isArray(value)) {
        if (value.length > 0) count++;
      } else if (value && value.toString().trim() !== '') {
        count++;
      }
    });
    setActiveFilters(count);
  }, [searchCriteria]);

  const handleInputChange = (key, value) => {
    setSearchCriteria(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleDateRangeChange = (key, field, value) => {
    setSearchCriteria(prev => ({
      ...prev,
      [`${key}_${field}`]: value
    }));
  };

  const handleSelectChange = (key, value, multiple = false) => {
    if (multiple) {
      setSearchCriteria(prev => ({
        ...prev,
        [key]: value
      }));
    } else {
      setSearchCriteria(prev => ({
        ...prev,
        [key]: value
      }));
    }
  };

  const handleSearch = () => {
    // Clean up empty values
    const cleanCriteria = {};
    Object.entries(searchCriteria).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        if (value.length > 0) cleanCriteria[key] = value;
      } else if (value && value.toString().trim() !== '') {
        cleanCriteria[key] = value;
      }
    });
    onSearch(cleanCriteria);
  };

  const handleClear = () => {
    const clearedCriteria = {};
    filters.forEach(filter => {
      if (filter.type === 'dateRange') {
        clearedCriteria[`${filter.key}_from`] = '';
        clearedCriteria[`${filter.key}_to`] = '';
      } else if (filter.type === 'select' && filter.multiple) {
        clearedCriteria[filter.key] = [];
      } else {
        clearedCriteria[filter.key] = '';
      }
    });
    setSearchCriteria(clearedCriteria);
    onClear();
  };

  const renderFilterField = (filter) => {
    const { key, type, label, placeholder, options = [] } = filter;

    switch (type) {
      case 'text':
        return (
          <Form.Control
            type="text"
            placeholder={placeholder || `Search ${label}...`}
            value={searchCriteria[key] || ''}
            onChange={(e) => handleInputChange(key, e.target.value)}
          />
        );

      case 'select':
        return (
          <Form.Select
            value={searchCriteria[key] || ''}
            onChange={(e) => handleSelectChange(key, e.target.value)}
          >
            <option value="">All {label}</option>
            {options.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Form.Select>
        );

      case 'multiSelect':
        return (
          <Form.Select
            multiple
            value={searchCriteria[key] || []}
            onChange={(e) => {
              const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
              handleSelectChange(key, selectedOptions, true);
            }}
          >
            {options.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Form.Select>
        );

      case 'dateRange':
        return (
          <Row>
            <Col>
              <Form.Control
                type="date"
                placeholder="From"
                value={searchCriteria[`${key}_from`] || ''}
                onChange={(e) => handleDateRangeChange(key, 'from', e.target.value)}
              />
            </Col>
            <Col>
              <Form.Control
                type="date"
                placeholder="To"
                value={searchCriteria[`${key}_to`] || ''}
                onChange={(e) => handleDateRangeChange(key, 'to', e.target.value)}
              />
            </Col>
          </Row>
        );

      case 'status':
        return (
          <div className="d-flex flex-wrap gap-2">
            {options.map(option => (
              <Form.Check
                key={option.value}
                type="checkbox"
                id={`${key}_${option.value}`}
                label={
                  <Badge bg={option.color || 'secondary'}>
                    {option.label}
                  </Badge>
                }
                checked={searchCriteria[key]?.includes(option.value) || false}
                onChange={(e) => {
                  const currentValues = searchCriteria[key] || [];
                  const newValues = e.target.checked
                    ? [...currentValues, option.value]
                    : currentValues.filter(v => v !== option.value);
                  handleSelectChange(key, newValues, true);
                }}
              />
            ))}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Card className="mb-3">
      <Card.Body>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div className="d-flex align-items-center">
            <FaSearch className="me-2" />
            <h6 className="mb-0">Advanced Search</h6>
            {activeFilters > 0 && (
              <Badge bg="primary" className="ms-2">
                {activeFilters} active
              </Badge>
            )}
          </div>
          <div>
            <Button
              variant="outline-secondary"
              size="sm"
              onClick={onToggleAdvanced}
              className="me-2"
            >
              <FaFilter className="me-1" />
              {showAdvanced ? 'Hide' : 'Show'} Advanced
            </Button>
            {activeFilters > 0 && (
              <Button
                variant="outline-danger"
                size="sm"
                onClick={handleClear}
              >
                <FaTimes className="me-1" />
                Clear
              </Button>
            )}
          </div>
        </div>

        <Collapse in={showAdvanced}>
          <div>
            <Row className="g-3">
              {filters.map((filter, index) => (
                <Col key={index} md={filter.width || 6} lg={filter.width || 4}>
                  <Form.Group>
                    <Form.Label>{filter.label}</Form.Label>
                    {renderFilterField(filter)}
                  </Form.Group>
                </Col>
              ))}
            </Row>
            
            <div className="d-flex justify-content-end mt-3">
              <Button
                variant="primary"
                onClick={handleSearch}
                disabled={activeFilters === 0}
              >
                <FaSearch className="me-1" />
                Search
              </Button>
            </div>
          </div>
        </Collapse>
      </Card.Body>
    </Card>
  );
};

export default AdvancedSearch;
