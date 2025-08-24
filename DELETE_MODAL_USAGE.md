# Generic Delete Modal Usage Guide

## Overview
The `DeleteObjectModal` component is a flexible, reusable modal for deleting database objects. It automatically handles different object types, API endpoints, and provides proper error handling and user feedback.

## Features
- ✅ Generic design that works with any object type
- ✅ Automatic API endpoint selection based on object type
- ✅ Proper error handling with user-friendly messages
- ✅ Loading states and disabled buttons during operations
- ✅ Customizable warning messages
- ✅ Automatic redirects after successful deletion
- ✅ History logging for audit trails
- ✅ Protection against deleting objects with related data

## Usage

### Basic Usage
```jsx
import DeleteObjectModal from '../modals/delete_object';

<DeleteObjectModal
  object_id="GRR"
  object_name="Greece"
  object_type="Country"
/>
```

### Advanced Usage with Custom Callbacks
```jsx
<DeleteObjectModal
  object_id="GRR"
  object_name="Greece"
  object_type="Country"
  warningMessage="This will also delete all provinces and cities associated with this country."
  onDeleteSuccess={(response) => {
    // Custom success handling
    console.log('Deleted:', response);
    window.location.href = "/regions/all_countries";
  }}
  trigger={
    <Button color="red" size="small">
      <Icon name="trash" /> Delete Country
    </Button>
  }
/>
```

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `object_id` | string | ✅ | The unique identifier of the object to delete |
| `object_name` | string | ❌ | Display name of the object (shown in confirmation) |
| `object_type` | string | ✅ | Type of object (Country, Province, City, User, etc.) |
| `warningMessage` | string | ❌ | Custom warning message to display |
| `onDeleteSuccess` | function | ❌ | Callback function called after successful deletion |
| `trigger` | React element | ❌ | Custom trigger button (defaults to "Delete {object_type}") |

## Supported Object Types

### Currently Supported
- **Country** - Deletes country and all related provinces/cities
- **Province** - Deletes province and all related cities  
- **City** - Deletes city and all related clients
- **User** - Deletes user account

### Adding New Object Types

To add support for a new object type:

1. **Add Backend Endpoint** (in `region_xhr.py` or appropriate file):
```python
class DeleteNewObject(generics.UpdateAPIView):
    @csrf_exempt
    def post(self, request):
        # Implementation similar to DeleteCountry
        pass
```

2. **Add URL Pattern** (in appropriate `urls.py`):
```python
path('delete_newobject/', xhr.DeleteNewObject.as_view()),
```

3. **Update Frontend Configuration** (in `delete_object.js`):
```javascript
const DELETE_ENDPOINTS = {
  // ... existing endpoints
  'NewObject': 'http://localhost:8000/api/regions/delete_newobject/',
};

const REDIRECT_URLS = {
  // ... existing redirects
  'NewObject': '/regions/all_newobjects',
};

const ID_FIELD_MAPPING = {
  // ... existing mappings
  'NewObject': 'newobject_id',
};
```

## Error Handling

The modal automatically handles various error scenarios:

- **Object not found** - Shows "Object does not exist" message
- **Protected object** - Shows "Object is protected" message with details
- **Network errors** - Shows generic error message
- **Validation errors** - Shows specific validation messages

## Security Features

- **CSRF Protection** - All endpoints use `@csrf_exempt` decorator
- **Authentication** - Requires valid user token
- **Authorization** - Logs all deletion attempts for audit
- **Data Integrity** - Prevents deletion of objects with foreign key relationships

## Example Implementation

### Country Overview Component
```jsx
<Card.Footer>
  <DeleteObjectModal
    object_id={country.country_id}
    object_name={country.title}
    object_type="Country"
    warningMessage="This will also delete all provinces and cities associated with this country."
    onDeleteSuccess={() => {
      window.location.href = "/regions/all_countries";
    }}
  />
</Card.Footer>
```

### Province Overview Component
```jsx
<Card.Footer>
  <DeleteObjectModal
    object_id={province.province_id}
    object_name={province.title}
    object_type="Province"
    warningMessage="This will also delete all cities associated with this province."
    onDeleteSuccess={() => {
      window.location.href = "/regions/all_provinces";
    }}
  />
</Card.Footer>
```

## Best Practices

1. **Always provide meaningful warning messages** for objects that have related data
2. **Use descriptive object names** to help users identify what they're deleting
3. **Implement proper redirects** after successful deletion
4. **Test with objects that have related data** to ensure protection works
5. **Monitor deletion logs** for audit purposes

## Troubleshooting

### Common Issues

1. **"No delete endpoint configured"** - Add the object type to `DELETE_ENDPOINTS`
2. **"No ID field mapping configured"** - Add the object type to `ID_FIELD_MAPPING`
3. **"Object is protected"** - Remove related objects first or handle the relationship properly
4. **"Object does not exist"** - Check that the object_id is correct and exists in the database 