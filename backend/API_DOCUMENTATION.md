# Data Management API Documentation

## Overview

This API provides comprehensive data management functionality for the Client Management System, including CRUD operations for all entities, advanced filtering, search capabilities, and statistical data generation.

## Base URL

```
http://localhost:8000/api/data_management/
```

## Authentication

The API uses Django REST Framework's authentication system:
- Token Authentication
- Session Authentication

All endpoints require authentication unless specified otherwise.

## API Endpoints

### Reference Data Management

#### Countries
- **GET** `/countries/` - List all countries
- **POST** `/countries/` - Create a new country
- **GET** `/countries/{id}/` - Get country details
- **PUT** `/countries/{id}/` - Update country
- **DELETE** `/countries/{id}/` - Delete country

**Features:**
- Search by title or country_id
- Filter by currency
- Order by title or orderindex

#### Provinces
- **GET** `/provinces/` - List all provinces
- **POST** `/provinces/` - Create a new province
- **GET** `/provinces/{id}/` - Get province details
- **PUT** `/provinces/{id}/` - Update province
- **DELETE** `/provinces/{id}/` - Delete province

**Features:**
- Search by title or province_id
- Filter by country
- Order by title or orderindex

#### Cities
- **GET** `/cities/` - List all cities
- **POST** `/cities/` - Create a new city
- **GET** `/cities/{id}/` - Get city details
- **PUT** `/cities/{id}/` - Update city
- **DELETE** `/cities/{id}/` - Delete city
- **GET** `/cities/by-province/?province_id={id}` - Get cities by province

**Features:**
- Search by title or city_id
- Filter by country and province
- Order by title or orderindex

#### Banks
- **GET** `/banks/` - List all active banks
- **POST** `/banks/` - Create a new bank
- **GET** `/banks/{id}/` - Get bank details
- **PUT** `/banks/{id}/` - Update bank
- **DELETE** `/banks/{id}/` - Delete bank

**Features:**
- Search by bankname, institutionnumber, or swiftcode
- Filter by country and active status
- Order by bankname or orderindex

#### Insurance Carriers
- **GET** `/insurance-carriers/` - List all active insurance carriers
- **POST** `/insurance-carriers/` - Create a new insurance carrier
- **GET** `/insurance-carriers/{id}/` - Get insurance carrier details
- **PUT** `/insurance-carriers/{id}/` - Update insurance carrier
- **DELETE** `/insurance-carriers/{id}/` - Delete insurance carrier

### Client Management

#### Clients
- **GET** `/clients/` - List all clients
- **POST** `/clients/` - Create a new client
- **GET** `/clients/{id}/` - Get client details (with all related data)
- **PUT** `/clients/{id}/` - Update client
- **DELETE** `/clients/{id}/` - Delete client
- **GET** `/clients/search/?q={query}` - Search clients
- **GET** `/clients/statistics/` - Get client statistics

**Features:**
- Search by name, surname, email, phone, mobile, AFM, SIN
- Filter by country, province, city, active status, deceased status, tax management
- Order by surname, name, or registration date
- Detailed view includes all related data (bank accounts, projects, documents, etc.)

#### Bank Client Accounts
- **GET** `/bank-client-accounts/` - List all active bank client accounts
- **POST** `/bank-client-accounts/` - Create a new bank client account
- **GET** `/bank-client-accounts/{id}/` - Get bank client account details
- **PUT** `/bank-client-accounts/{id}/` - Update bank client account
- **DELETE** `/bank-client-accounts/{id}/` - Delete bank client account

### Consultant Management

#### Consultants
- **GET** `/consultants/` - List all active consultants
- **POST** `/consultants/` - Create a new consultant
- **GET** `/consultants/{id}/` - Get consultant details
- **PUT** `/consultants/{id}/` - Update consultant
- **DELETE** `/consultants/{id}/` - Delete consultant

**Features:**
- Search by fullname, email, or username
- Filter by role, active status, and task assignment capability
- Order by fullname or orderindex

### Project Management

#### Project Categories
- **GET** `/project-categories/` - List all active project categories
- **POST** `/project-categories/` - Create a new project category
- **GET** `/project-categories/{id}/` - Get project category details
- **PUT** `/project-categories/{id}/` - Update project category
- **DELETE** `/project-categories/{id}/` - Delete project category

#### Projects
- **GET** `/projects/` - List all projects
- **POST** `/projects/` - Create a new project
- **GET** `/projects/{id}/` - Get project details (with all related data)
- **PUT** `/projects/{id}/` - Update project
- **DELETE** `/projects/{id}/` - Delete project
- **GET** `/projects/search/?q={query}` - Search projects
- **GET** `/projects/statistics/` - Get project statistics

**Features:**
- Search by title or filecode
- Filter by status, consultant, taxation, and categories
- Order by title, registration date, deadline, or status
- Detailed view includes all related data (clients, tasks, documents, properties, etc.)

#### Associated Clients
- **GET** `/associated-clients/` - List all associated clients
- **POST** `/associated-clients/` - Create a new associated client
- **GET** `/associated-clients/{id}/` - Get associated client details
- **PUT** `/associated-clients/{id}/` - Update associated client
- **DELETE** `/associated-clients/{id}/` - Delete associated client

### Document Management

#### Documents
- **GET** `/documents/` - List all documents
- **POST** `/documents/` - Create a new document
- **GET** `/documents/{id}/` - Get document details
- **PUT** `/documents/{id}/` - Update document
- **DELETE** `/documents/{id}/` - Delete document
- **GET** `/documents/expired/` - Get expired documents
- **GET** `/documents/expiring-soon/` - Get documents expiring in next 30 days

**Features:**
- Search by title
- Filter by project, client, status, original, and trafficable
- Order by title, created date, or valid until date

### Professional Management

#### Professions
- **GET** `/professions/` - List all professions
- **POST** `/professions/` - Create a new profession
- **GET** `/professions/{id}/` - Get profession details
- **PUT** `/professions/{id}/` - Update profession
- **DELETE** `/professions/{id}/` - Delete profession

#### Professionals
- **GET** `/professionals/` - List all active professionals
- **POST** `/professionals/` - Create a new professional
- **GET** `/professionals/{id}/` - Get professional details
- **PUT** `/professionals/{id}/` - Update professional
- **DELETE** `/professionals/{id}/` - Delete professional

**Features:**
- Search by fullname, email, phone, or mobile
- Filter by profession, city, reliability, and active status
- Order by fullname

#### Client Contacts
- **GET** `/client-contacts/` - List all active client contacts
- **POST** `/client-contacts/` - Create a new client contact
- **GET** `/client-contacts/{id}/` - Get client contact details
- **PUT** `/client-contacts/{id}/` - Update client contact
- **DELETE** `/client-contacts/{id}/` - Delete client contact

### Property Management

#### Properties
- **GET** `/properties/` - List all active properties
- **POST** `/properties/` - Create a new property
- **GET** `/properties/{id}/` - Get property details
- **PUT** `/properties/{id}/` - Update property
- **DELETE** `/properties/{id}/` - Delete property

**Features:**
- Search by description or location
- Filter by project, country, province, city, type, status, market, and active status
- Order by description or location

#### Bank Project Accounts
- **GET** `/bank-project-accounts/` - List all bank project accounts
- **POST** `/bank-project-accounts/` - Create a new bank project account
- **GET** `/bank-project-accounts/{id}/` - Get bank project account details
- **PUT** `/bank-project-accounts/{id}/` - Update bank project account
- **DELETE** `/bank-project-accounts/{id}/` - Delete bank project account

### Task Management

#### Task Categories
- **GET** `/task-categories/` - List all active task categories
- **POST** `/task-categories/` - Create a new task category
- **GET** `/task-categories/{id}/` - Get task category details
- **PUT** `/task-categories/{id}/` - Update task category
- **DELETE** `/task-categories/{id}/` - Delete task category

#### Project Tasks
- **GET** `/project-tasks/` - List all active project tasks
- **POST** `/project-tasks/` - Create a new project task
- **GET** `/project-tasks/{id}/` - Get project task details (with comments)
- **PUT** `/project-tasks/{id}/` - Update project task
- **DELETE** `/project-tasks/{id}/` - Delete project task
- **GET** `/project-tasks/overdue/` - Get overdue tasks
- **GET** `/project-tasks/my-tasks/?consultant_id={id}` - Get tasks assigned to consultant
- **GET** `/project-tasks/statistics/` - Get task statistics

**Features:**
- Search by title or details
- Filter by project, task category, assigner, assignee, priority, status, and active status
- Order by title, assignment date, deadline, priority, or status
- Detailed view includes all comments

#### Task Comments
- **GET** `/task-comments/` - List all task comments
- **POST** `/task-comments/` - Create a new task comment
- **GET** `/task-comments/{id}/` - Get task comment details
- **PUT** `/task-comments/{id}/` - Update task comment
- **DELETE** `/task-comments/{id}/` - Delete task comment

### Cash and Taxation Management

#### Cash Transactions
- **GET** `/cash/` - List all cash transactions
- **POST** `/cash/` - Create a new cash transaction
- **GET** `/cash/{id}/` - Get cash transaction details
- **PUT** `/cash/{id}/` - Update cash transaction
- **DELETE** `/cash/{id}/` - Delete cash transaction
- **GET** `/cash/statistics/` - Get cash statistics

**Features:**
- Search by reason
- Filter by project, country, consultant, and kind (expense/payment)
- Order by transaction date, expense amount, or payment amount

#### Taxation Projects
- **GET** `/taxation-projects/` - List all taxation projects
- **POST** `/taxation-projects/` - Create a new taxation project
- **GET** `/taxation-projects/{id}/` - Get taxation project details
- **PUT** `/taxation-projects/{id}/` - Update taxation project
- **DELETE** `/taxation-projects/{id}/` - Delete taxation project
- **GET** `/taxation-projects/overdue/` - Get overdue taxation projects

### Notification Management

#### Notifications
- **GET** `/notifications/` - List all notifications
- **POST** `/notifications/` - Create a new notification
- **GET** `/notifications/{id}/` - Get notification details
- **PUT** `/notifications/{id}/` - Update notification
- **DELETE** `/notifications/{id}/` - Delete notification
- **GET** `/notifications/unread/?user_id={id}` - Get unread notifications for user
- **POST** `/notifications/{id}/mark-as-read/` - Mark notification as read

### Reference Data Endpoints (Read-Only)

These endpoints provide simplified data for dropdowns and reference purposes:

- **GET** `/reference/countries/` - Reference countries
- **GET** `/reference/provinces/` - Reference provinces
- **GET** `/reference/cities/` - Reference cities
- **GET** `/reference/banks/` - Reference banks
- **GET** `/reference/consultants/` - Reference consultants
- **GET** `/reference/project-categories/` - Reference project categories
- **GET** `/reference/task-categories/` - Reference task categories
- **GET** `/reference/professions/` - Reference professions
- **GET** `/reference/professionals/` - Reference professionals
- **GET** `/reference/insurance-carriers/` - Reference insurance carriers

## Query Parameters

### Pagination
All list endpoints support pagination:
- `limit` - Number of items per page (default: 100)
- `offset` - Number of items to skip

### Search
Endpoints with search capability support:
- `search` - Search term for text fields

### Filtering
Endpoints support filtering by model fields:
- `field=value` - Filter by exact field value
- `field__in=value1,value2` - Filter by multiple values
- `field__gte=value` - Filter by greater than or equal
- `field__lte=value` - Filter by less than or equal
- `field__contains=value` - Filter by substring match

### Ordering
Endpoints support ordering:
- `ordering=field` - Order by field (ascending)
- `ordering=-field` - Order by field (descending)
- `ordering=field1,-field2` - Order by multiple fields

## Response Format

### List Response
```json
{
    "count": 100,
    "next": "http://localhost:8000/api/data_management/clients/?limit=100&offset=100",
    "previous": null,
    "results": [
        {
            "id": "1",
            "name": "John",
            "surname": "Doe",
            // ... other fields
        }
    ]
}
```

### Detail Response
```json
{
    "id": "1",
    "name": "John",
    "surname": "Doe",
    "email": "john.doe@example.com",
    // ... all fields including related data
}
```

### Error Response
```json
{
    "error": "Error message",
    "detail": "Detailed error information"
}
```

## Usage Examples

### Get all clients with pagination
```bash
curl -X GET "http://localhost:8000/api/data_management/clients/?limit=10&offset=0"
```

### Search for clients
```bash
curl -X GET "http://localhost:8000/api/data_management/clients/?search=john"
```

### Filter clients by country
```bash
curl -X GET "http://localhost:8000/api/data_management/clients/?country=CAN"
```

### Get overdue tasks
```bash
curl -X GET "http://localhost:8000/api/data_management/project-tasks/overdue/"
```

### Create a new client
```bash
curl -X POST "http://localhost:8000/api/data_management/clients/" \
  -H "Content-Type: application/json" \
  -d '{
    "client_id": "CLI001",
    "name": "John",
    "surname": "Doe",
    "email": "john.doe@example.com",
    "country": "CAN",
    "province": "ON",
    "city": "TOR"
  }'
```

## Testing

Run the test script to verify all endpoints are working:

```bash
cd backend
python test_api_endpoints.py
```

## Features

### Advanced Features Implemented

1. **Comprehensive CRUD Operations** - Full create, read, update, delete for all entities
2. **Advanced Filtering** - Filter by any model field with various operators
3. **Search Functionality** - Text search across relevant fields
4. **Pagination** - Efficient data loading with limit/offset pagination
5. **Ordering** - Sort by any field in ascending or descending order
6. **Nested Data** - Detailed views include all related data
7. **Statistics Endpoints** - Get aggregated data for dashboards
8. **Reference Data** - Simplified endpoints for dropdowns
9. **Custom Actions** - Specialized endpoints for common operations
10. **Authentication** - Secure access with token and session authentication

### Specialized Endpoints

- **Search endpoints** - `/clients/search/`, `/projects/search/`
- **Statistics endpoints** - `/clients/statistics/`, `/projects/statistics/`, `/project-tasks/statistics/`, `/cash/statistics/`
- **Overdue items** - `/documents/expired/`, `/documents/expiring-soon/`, `/project-tasks/overdue/`, `/taxation-projects/overdue/`
- **Personal views** - `/project-tasks/my-tasks/`
- **Notifications** - `/notifications/unread/`, `/notifications/{id}/mark-as-read/`
- **Cascading dropdowns** - `/cities/by-province/`

## Dependencies

- Django 3.2.5
- Django REST Framework 3.12.4
- Django Filter 22.1
- CoreAPI 2.3.3 (for documentation)

## Setup

1. Install dependencies:
```bash
pip install -r requirements.txt
```

2. Run migrations:
```bash
python manage.py migrate
```

3. Start the development server:
```bash
python manage.py runserver 8000
```

4. Test the API:
```bash
python test_api_endpoints.py
```

The API is now ready to be consumed by the frontend application!
