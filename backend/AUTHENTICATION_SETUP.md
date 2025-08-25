# Authentication System Setup

## Overview

The Client Management System uses a custom authentication system built with Django REST Framework and Django Axes for security. The system uses the `Consultant` model as the custom user model.

## Architecture

### User Model
- **Custom User Model**: `accounts.Consultant`
- **Primary Key**: `consultant_id` (CharField, max_length=10)
- **Username Field**: `username` (CharField, max_length=15, unique=True)
- **Authentication**: Token-based authentication via DRF

### Security Features
- **Django Axes**: Brute force protection with IP and username tracking
- **Token Authentication**: Secure API access with DRF tokens
- **IP Whitelisting**: Support for whitelisted IPs that bypass lockout
- **Automatic Lockout**: Accounts are locked after 5 failed attempts

## Configuration

### Django Settings (`core/settings.py`)

```python
# Custom User Model
AUTH_USER_MODEL = "accounts.Consultant"

# Django Axes Configuration
AXES_ENABLED = True
AXES_FAILURE_LIMIT = 5
AXES_LOCK_OUT_BY_COMBINATION_USER_AND_IP = True
AXES_RESET_ON_SUCCESS = True
AXES_COOLOFF_TIME = 0  # Permanent lockout
AXES_LOCKOUT_TEMPLATE = 'axes/lockout.html'
AXES_LOCKOUT_URL = '/api/user/lockout/'

# Authentication Backends
AUTHENTICATION_BACKENDS = [
    'axes.backends.AxesBackend',
    'django.contrib.auth.backends.ModelBackend',
]

# REST Framework Configuration
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework.authentication.TokenAuthentication',
        'rest_framework.authentication.SessionAuthentication',
    ],
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticated',
    ],
}
```

## API Endpoints

### Authentication Endpoints

#### 1. Login
- **URL**: `POST /api/user/login/`
- **Request Body**:
  ```json
  {
    "username": "testuser",
    "password": "testpass123"
  }
  ```
- **Response**:
  ```json
  {
    "user": {
      "id": "TEST001",
      "consultant_id": "TEST001",
      "username": "testuser",
      "fullname": "Test User",
      "email": "test@example.com",
      "role": "C",
      "role_display": "User",
      "is_active": true,
      "active": true,
      "is_staff": true,
      "permissions": []
    },
    "token": "your-auth-token-here",
    "logged_in": true
  }
  ```

#### 2. Logout
- **URL**: `POST /api/user/logout/`
- **Headers**: `Authorization: Token your-token-here`
- **Response**: `200 OK`

#### 3. Check Access Status
- **URL**: `GET /api/user/check_access_status/`
- **Response**:
  ```json
  {
    "isBlocked": false,
    "attempts_remaining": 5
  }
  ```

## Frontend Integration

### API Configuration (`frontend/src/utils/api.js`)

The frontend uses a centralized API configuration with automatic token handling:

```javascript
const API_BASE_URL = 'http://localhost:8000/api';

// Get authentication token from localStorage
const getAuthToken = () => {
  return localStorage.getItem('user-token') || localStorage.getItem('authToken');
};

// API request function with automatic token handling
export const apiRequest = async (method, endpoint, data = null) => {
  const headers = {
    'Content-Type': 'application/json',
  };

  const authToken = getAuthToken();
  if (authToken) {
    headers['Authorization'] = `Token ${authToken}`;
  }

  // ... rest of implementation
};
```

### Login Component (`frontend/src/components/core/login/login.jsx`)

The login component has been updated to use the new API:

```javascript
// Login attempt
onSubmit = async (e) => {
  e.preventDefault();
  const username = e.target.username.value;
  const password = e.target.password.value;
  
  try {
    const response = await apiPost('/api/user/login/', {
      username,
      password,
    });
    
    // Store token and user info
    const token = response.token;
    localStorage.setItem("userToken", token);
    localStorage.setItem("user-token", token);
    localStorage.setItem("user", username);
    localStorage.setItem("user_id", response.user.id);
    localStorage.setItem("user_email", response.user.email);

    this.props.setUserToken(token);
    this.props.history.push("/");
  } catch (error) {
    // Handle login errors
    console.error('Login error:', error);
  }
};
```

## Testing

### Create Test User

Use the management command to create a test user:

```bash
python manage.py create_test_user
```

This creates a user with:
- **Username**: `testuser`
- **Password**: `testpass123`
- **Consultant ID**: `TEST001`

### Test Authentication

Use the provided test script:

```bash
python test_auth.py
```

This script tests:
1. Access status endpoint
2. Failed login attempts (should trigger Axes lockout)
3. Successful login with valid credentials

### Manual Testing

#### Test Login with Valid Credentials
```bash
curl -X POST http://localhost:8000/api/user/login/ \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"testpass123"}'
```

#### Test Login with Invalid Credentials
```bash
curl -X POST http://localhost:8000/api/user/login/ \
  -H "Content-Type: application/json" \
  -d '{"username":"invalid","password":"invalid"}'
```

#### Check Access Status
```bash
curl -X GET http://localhost:8000/api/user/check_access_status/
```

## Security Features

### Django Axes Integration

1. **Automatic Tracking**: Failed login attempts are automatically tracked
2. **IP-based Lockout**: Users are locked out by IP address after 5 failed attempts
3. **Username-based Lockout**: Users are also locked out by username
4. **Combination Lockout**: Lockout considers both IP and username
5. **Whitelist Support**: Certain IPs can bypass lockout restrictions

### Token Security

1. **Automatic Token Generation**: Tokens are created on successful login
2. **Token Validation**: All API requests require valid tokens
3. **Token Storage**: Tokens are stored securely in localStorage
4. **Automatic Headers**: API requests automatically include token headers

## Troubleshooting

### Common Issues

1. **"ModuleNotFoundError: No module named 'django_ipware'"**
   - Solution: The system now uses built-in IP detection without external dependencies

2. **"AxesProxyHandler object has no attribute 'log_failure'"**
   - Solution: The system now uses Django Axes middleware for automatic tracking

3. **Authentication not working in frontend**
   - Check that the API base URL is correct
   - Verify that tokens are being stored in localStorage
   - Ensure CORS is properly configured

### Debug Commands

```bash
# Check Django configuration
python manage.py check

# Test authentication endpoints
python test_auth.py

# Create test user
python manage.py create_test_user

# Check Axes configuration
python manage.py shell
>>> from axes.conf import settings
>>> print(settings.AXES_ENABLED)
```

## Production Considerations

1. **HTTPS**: Always use HTTPS in production
2. **Token Expiration**: Consider implementing token expiration
3. **Rate Limiting**: Implement additional rate limiting if needed
4. **Logging**: Enable proper logging for security events
5. **Monitoring**: Monitor failed login attempts and lockouts

## Files Modified

### Backend Files
- `accounts/models.py` - Consultant user model
- `accounts/views.py` - Authentication views
- `accounts/serializers.py` - User serializers
- `accounts/urls.py` - Authentication URLs
- `core/settings.py` - Django and Axes configuration
- `core/urls.py` - Main URL configuration

### Frontend Files
- `frontend/src/utils/api.js` - API configuration
- `frontend/src/components/core/login/login.jsx` - Login component
- `frontend/src/components/data_management/projects/projects.jsx` - Updated to use new API
- `frontend/src/components/data_management/projects/project_detail.jsx` - Updated to use new API

### Test Files
- `backend/test_auth.py` - Authentication test script
- `backend/accounts/management/commands/create_test_user.py` - Test user creation command
