# Royal Safari Tours — HRM & Auth REST API Documentation

This document contains full API reference, request/response examples, authentication details, and testing instructions for all endpoints.

---

## Table of Contents

1. [Server Configuration](#1-server-configuration)
2. [Security Features](#2-security-features)
3. [Dual JWT Token Architecture](#3-dual-jwt-token-architecture)
4. [Authentication Module](#4-authentication-module)
5. [User Management Module](#5-user-management-module)
6. [Department Master Module](#6-department-master-module)
7. [Designation Master Module](#7-designation-master-module)
8. [Employment Type Master Module](#8-employment-type-master-module)
9. [Employment Status Master Module](#9-employment-status-master-module)
10. [Employee Directory Module](#10-employee-directory-module)
11. [Employee Document Library Module](#11-employee-document-library-module)
12. [HRM Dashboard Module](#12-hrm-dashboard-module)
13. [System Health Check](#13-system-health-check)
14. [Error Handling](#14-error-handling)
15. [RBAC Security Matrix](#15-rbac-security-matrix)

---

## 1. Server Configuration

| Property | Value |
|----------|-------|
| **Base URL** | `http://localhost:5000/api/v1` |
| **Content Type** | `application/json` (unless multipart/form-data) |
| **Authentication** | Bearer Token via `Authorization` header or HTTP-only cookies |
| **Rate Limiting** | Auth endpoints: 20 req/15min, Refresh Token: 5 req/15min |

---

## 2. Security Features

| Feature | Description |
|---------|-------------|
| **Helmet** | Security HTTP headers (X-Content-Type-Options, X-Frame-Options, etc.) |
| **Compression** | Gzip response compression |
| **CORS** | Configurable origin whitelist |
| **Rate Limiting** | In-memory rate limiter on auth endpoints |
| **Input Validation** | Zod schemas with `.trim()` and `.max()` constraints |
| **File Type Filtering** | MIME type validation on photo/document uploads |
| **Password Hashing** | bcrypt with 12 rounds |
| **Error Sanitization** | Stack traces hidden in production, passwords masked in logs |

---

## 3. Dual JWT Token Architecture

| Token | Purpose | Lifetime | Storage |
|-------|---------|----------|---------|
| **Access Token** | API authentication | 1 day | HTTP-only cookie `token` + JSON response |
| **Refresh Token** | Issue new access tokens | 7 days | HTTP-only cookie `refreshToken` + JSON response |

**Usage:**
- Pass via `Authorization: Bearer <accessToken>` header
- Or use HTTP-only cookies (automatic for browser clients)

---

## 4. Authentication Module (`/api/v1/auth`)

### 4.1 Register User

| Property | Value |
|----------|-------|
| **Method** | `POST` |
| **URL** | `/api/v1/auth/register` |
| **Auth Required** | No |
| **Rate Limited** | Yes (20 req/15min) |
| **Validation** | Yes |

**Request Body:**
```json
{
  "name": "John Staff",
  "email": "john@example.com",
  "password": "Password123"
}
```

**Validation Rules:**
| Field | Rules |
|-------|-------|
| `name` | Required, trimmed, 3-100 characters |
| `email` | Required, trimmed, valid email, max 255 characters |
| `password` | Required, 6-128 characters |

**Success Response (201 Created):**
```json
{
  "success": true,
  "message": "Registration successful",
  "data": {
    "id": "uuid-string",
    "name": "John Staff",
    "email": "john@example.com",
    "role": "USER",
    "avatar": null,
    "createdAt": "2026-08-10T00:00:00.000Z"
  }
}
```

**Error Responses:**
- `400` - Validation failed
- `409` - Email already exists
- `429` - Too many requests

---

### 4.2 Login User

| Property | Value |
|----------|-------|
| **Method** | `POST` |
| **URL** | `/api/v1/auth/login` |
| **Auth Required** | No |
| **Rate Limited** | Yes (20 req/15min) |
| **Validation** | Yes |

**Request Body:**
```json
{
  "email": "admin@gmail.com",
  "password": "Admin@123"
}
```

**Success Response (200 OK):**
```json
{
  "success": true,
  **message**: "Login successful",
  "accessToken": "eyJhbGciOiJIUzI1Ni...",
  "refreshToken": "eyJhbGciOiJIUzI1Ni...",
  "token": "eyJhbGciOiJIUzI1Ni...",
  "user": {
    "id": "uuid-string",
    "name": "Super Admin",
    "email": "admin@gmail.com",
    "role": "SUPER_ADMIN",
    "avatar": null
  }
}
```

**Cookies Set:**
| Cookie | MaxAge | HttpOnly |
|--------|--------|----------|
| `token` | 24 hours | Yes |
| `refreshToken` | 7 days | Yes |

---

### 4.3 Refresh Access Token

| Property | Value |
|----------|-------|
| **Method** | `POST` |
| **URL** | `/api/v1/auth/refresh-token` |
| **Auth Required** | No |
| **Rate Limited** | Yes (5 req/15min) |
| **Validation** | Yes |

**Request Body (optional - can also use cookie):**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1Ni..."
}
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Access token refreshed successfully",
  "accessToken": "eyJhbGciOiJIUzI1Ni...",
  "token": "eyJhbGciOiJIUzI1Ni...",
  "user": {
    "id": "uuid-string",
    "name": "Super Admin",
    "email": "admin@gmail.com",
    "role": "SUPER_ADMIN",
    "avatar": null
  }
}
```

---

### 4.4 Get Current User Profile

| Property | Value |
|----------|-------|
| **Method** | `GET` |
| **URL** | `/api/v1/auth/profile` |
| **Auth Required** | Yes |

**Headers:**
```
Authorization: Bearer <accessToken>
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "user": {
    "id": "uuid-string",
    "name": "Super Admin",
    "email": "admin@gmail.com",
    "role": "SUPER_ADMIN",
    "avatar": null,
    "createdAt": "2026-01-01T00:00:00.000Z"
  }
}
```

---

### 4.5 Change Password

| Property | Value |
|----------|-------|
| **Method** | `POST` |
| **URL** | `/api/v1/auth/change-password` |
| **Auth Required** | Yes |
| **Validation** | Yes |

**Headers:**
```
Authorization: Bearer <accessToken>
Content-Type: application/json
```

**Request Body:**
```json
{
  "currentPassword": "OldPassword123",
  "newPassword": "NewPassword456"
}
```

**Validation Rules:**
| Field | Rules |
|-------|-------|
| `currentPassword` | Required, max 128 characters |
| `newPassword` | Required, 6-128 characters |

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Password changed successfully"
}
```

**Error Responses:**
- `400` - Current password is incorrect
- `401` - Unauthorized
- `404` - User not found

---

### 4.6 Logout User

| Property | Value |
|----------|-------|
| **Method** | `POST` |
| **URL** | `/api/v1/auth/logout` |
| **Auth Required** | No |

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

**Effect:** Clears both `token` and `refreshToken` cookies.

---

## 5. User Management Module (`/api/v1/users`)

### 5.1 Get All Users

| Property | Value |
|----------|-------|
| **Method** | `GET` |
| **URL** | `/api/v1/users` |
| **Auth Required** | Yes |
| **RBAC** | `SUPER_ADMIN`, `ADMIN` |

**Query Parameters:**
| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `page` | number | `1` | Page number |
| `limit` | number | `10` | Items per page |
| `search` | string | - | Search by name or email |

**Example:** `GET /api/v1/users?page=1&limit=10&search=john`

**Success Response (200 OK):**
```json
{
  "success": true,
  "users": [
    {
      "id": "uuid-string",
      "name": "John Staff",
      "email": "john@example.com",
      "role": "ADMIN",
      "avatar": "/uploads/avatars/avatar-123.jpg",
      "createdAt": "2026-01-01T00:00:00.000Z",
      "updatedAt": "2026-08-10T00:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "totalPages": 3
  }
}
```

---

### 5.2 Get User By ID

| Property | Value |
|----------|-------|
| **Method** | `GET` |
| **URL** | `/api/v1/users/:id` |
| **Auth Required** | Yes |
| **RBAC** | `SUPER_ADMIN`, `ADMIN` |

**Success Response (200 OK):**
```json
{
  "success": true,
  "user": {
    "id": "uuid-string",
    "name": "John Staff",
    "email": "john@example.com",
    "role": "ADMIN",
    "avatar": "/uploads/avatars/avatar-123.jpg",
    "createdAt": "2026-01-01T00:00:00.000Z",
    "updatedAt": "2026-08-10T00:00:00.000Z"
  }
}
```

**Error Response:**
- `404` - User not found

---

### 5.3 Update User

| Property | Value |
|----------|-------|
| **Method** | `PUT` |
| **URL** | `/api/v1/users/:id` |
| **Auth Required** | Yes |
| **RBAC** | `SUPER_ADMIN`, `ADMIN`, `HR_MANAGER`, `EMPLOYEE` |
| **Content Type** | `multipart/form-data` (if avatar) or `application/json` |
| **Validation** | Yes |

**Request Body:**
```json
{
  "name": "John Updated",
  "role": "ADMIN"
}
```

**Validation Rules:**
| Field | Rules |
|-------|-------|
| `name` | Optional, trimmed, 2-100 characters |
| `role` | Optional, must be one of: `SUPER_ADMIN`, `ADMIN`, `HR_MANAGER`, `EMPLOYEE`, `USER` |
| `avatar` | Optional, file upload (max 5MB) |

**Notes:**
- Only `SUPER_ADMIN` and `ADMIN` can modify roles
- Maximum 5 admin accounts (SUPER_ADMIN + ADMIN combined)
- Avatar files stored in `uploads/avatars/`

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "User updated successfully",
  "user": {
    "id": "uuid-string",
    "name": "John Updated",
    "email": "john@example.com",
    "role": "ADMIN",
    "avatar": "/uploads/avatars/avatar-456.jpg"
  }
}
```

---

### 5.4 Delete User

| Property | Value |
|----------|-------|
| **Method** | `DELETE` |
| **URL** | `/api/v1/users/:id` |
| **Auth Required** | Yes |
| **RBAC** | `SUPER_ADMIN`, `ADMIN` |

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "User deleted successfully"
}
```

**Error Response:**
- `404` - User not found

---

## 6. Department Master Module (`/api/v1/departments`)

### 6.1 Get All Departments

| Property | Value |
|----------|-------|
| **Method** | `GET` |
| **URL** | `/api/v1/departments` |
| **Auth Required** | Yes |
| **RBAC** | Any authenticated user |

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Departments retrieved successfully",
  "data": [
    {
      "id": "dept-uuid-1",
      "name": "Operations & Safaris",
      "description": "Safari management & field logistics",
      "createdAt": "2026-01-01T00:00:00.000Z",
      "updatedAt": "2026-01-01T00:00:00.000Z",
      "_count": { "employees": 5 }
    }
  ]
}
```

---

### 6.2 Get Department By ID

| Property | Value |
|----------|-------|
| **Method** | `GET` |
| **URL** | `/api/v1/departments/:id` |
| **Auth Required** | Yes |
| **RBAC** | Any authenticated user |

---

### 6.3 Create Department

| Property | Value |
|----------|-------|
| **Method** | `POST` |
| **URL** | `/api/v1/departments` |
| **Auth Required** | Yes |
| **RBAC** | `SUPER_ADMIN`, `ADMIN`, `HR_MANAGER` |
| **Validation** | Yes |

**Request Body:**
```json
{
  "name": "Quality Assurance",
  "description": "Software QA & System Compliance Testing"
}
```

**Validation Rules:**
| Field | Rules |
|-------|-------|
| `name` | Required, trimmed, 2-100 characters, unique |
| `description` | Optional, trimmed, max 500 characters |

**Success Response (201 Created):**
```json
{
  "success": true,
  "message": "Department created successfully",
  "data": {
    "id": "dept-uuid-new",
    "name": "Quality Assurance",
    "description": "Software QA & System Compliance Testing",
    "_count": { "employees": 0 }
  }
}
```

**Error Response:**
- `409` - Department name already exists

---

### 6.4 Update Department

| Property | Value |
|----------|-------|
| **Method** | `PATCH` |
| **URL** | `/api/v1/departments/:id` |
| **Auth Required** | Yes |
| **RBAC** | `SUPER_ADMIN`, `ADMIN`, `HR_MANAGER` |
| **Validation** | Yes |

**Request Body:**
```json
{
  "name": "Quality Assurance & Compliance",
  "description": "Updated QA department scope"
}
```

---

### 6.5 Delete Department

| Property | Value |
|----------|-------|
| **Method** | `DELETE` |
| **URL** | `/api/v1/departments/:id` |
| **Auth Required** | Yes |
| **RBAC** | `SUPER_ADMIN`, `ADMIN` |

**Safety:** Cannot delete if employees are assigned to this department.

**Error Response:**
- `409` - Cannot delete department with assigned employees

---

## 7. Designation Master Module (`/api/v1/designations`)

### 7.1 Get All Designations

| Property | Value |
|----------|-------|
| **Method** | `GET` |
| **URL** | `/api/v1/designations` |
| **Auth Required** | Yes |
| **RBAC** | Any authenticated user |

**Response:** Same structure as Department list with `_count.employees`.

---

### 7.2 Get Designation By ID

| Property | Value |
|----------|-------|
| **Method** | `GET` |
| **URL** | `/api/v1/designations/:id` |
| **Auth Required** | Yes |

---

### 7.3 Create Designation

| Property | Value |
|----------|-------|
| **Method** | `POST` |
| **URL** | `/api/v1/designations` |
| **Auth Required** | Yes |
| **RBAC** | `SUPER_ADMIN`, `ADMIN`, `HR_MANAGER` |
| **Validation** | Yes |

**Request Body:**
```json
{
  "name": "Lead QA Engineer",
  "description": "Test automation & quality assurance lead"
}
```

**Validation Rules:**
| Field | Rules |
|-------|-------|
| `name` | Required, trimmed, 2-100 characters, unique |
| `description` | Optional, trimmed, max 500 characters |

---

### 7.4 Update Designation

| Property | Value |
|----------|-------|
| **Method** | `PATCH` |
| **URL** | `/api/v1/designations/:id` |
| **Auth Required** | Yes |
| **RBAC** | `SUPER_ADMIN`, `ADMIN`, `HR_MANAGER` |
| **Validation** | Yes |

---

### 7.5 Delete Designation

| Property | Value |
|----------|-------|
| **Method** | `DELETE` |
| **URL** | `/api/v1/designations/:id` |
| **Auth Required** | Yes |
| **RBAC** | `SUPER_ADMIN`, `ADMIN` |

**Safety:** Cannot delete if employees are assigned.

---

## 8. Employment Type Master Module (`/api/v1/employment-types`)

### 8.1 Get All Employment Types

| Property | Value |
|----------|-------|
| **Method** | `GET` |
| **URL** | `/api/v1/employment-types` |
| **Auth Required** | Yes |
| **RBAC** | Any authenticated user |

---

### 8.2 Get Employment Type By ID

| Property | Value |
|----------|-------|
| **Method** | `GET` |
| **URL** | `/api/v1/employment-types/:id` |
| **Auth Required** | Yes |

---

### 8.3 Create Employment Type

| Property | Value |
|----------|-------|
| **Method** | `POST` |
| **URL** | `/api/v1/employment-types` |
| **Auth Required** | Yes |
| **RBAC** | `SUPER_ADMIN`, `ADMIN`, `HR_MANAGER` |
| **Validation** | Yes |

**Request Body:**
```json
{
  "name": "Consultant"
}
```

**Validation Rules:**
| Field | Rules |
|-------|-------|
| `name` | Required, trimmed, 2-100 characters, unique |

---

### 8.4 Update Employment Type

| Property | Value |
|----------|-------|
| **Method** | `PATCH` |
| **URL** | `/api/v1/employment-types/:id` |
| **Auth Required** | Yes |
| **RBAC** | `SUPER_ADMIN`, `ADMIN`, `HR_MANAGER` |
| **Validation** | Yes |

---

### 8.5 Delete Employment Type

| Property | Value |
|----------|-------|
| **Method** | `DELETE` |
| **URL** | `/api/v1/employment-types/:id` |
| **Auth Required** | Yes |
| **RBAC** | `SUPER_ADMIN`, `ADMIN` |

**Safety:** Cannot delete if employees are assigned.

---

## 9. Employment Status Master Module (`/api/v1/employment-statuses`)

### 9.1 Get All Employment Statuses

| Property | Value |
|----------|-------|
| **Method** | `GET` |
| **URL** | `/api/v1/employment-statuses` |
| **Auth Required** | Yes |
| **RBAC** | Any authenticated user |

---

### 9.2 Get Employment Status By ID

| Property | Value |
|----------|-------|
| **Method** | `GET` |
| **URL** | `/api/v1/employment-statuses/:id` |
| **Auth Required** | Yes |

---

### 9.3 Create Employment Status

| Property | Value |
|----------|-------|
| **Method** | `POST` |
| **URL** | `/api/v1/employment-statuses` |
| **Auth Required** | Yes |
| **RBAC** | `SUPER_ADMIN`, `ADMIN`, `HR_MANAGER` |
| **Validation** | Yes |

**Request Body:**
```json
{
  "name": "Notice Period"
}
```

**Validation Rules:**
| Field | Rules |
|-------|-------|
| `name` | Required, trimmed, 2-100 characters, unique |

---

### 9.4 Update Employment Status

| Property | Value |
|----------|-------|
| **Method** | `PATCH` |
| **URL** | `/api/v1/employment-statuses/:id` |
| **Auth Required** | Yes |
| **RBAC** | `SUPER_ADMIN`, `ADMIN`, `HR_MANAGER` |
| **Validation** | Yes |

---

### 9.5 Delete Employment Status

| Property | Value |
|----------|-------|
| **Method** | `DELETE` |
| **URL** | `/api/v1/employment-statuses/:id` |
| **Auth Required** | Yes |
| **RBAC** | `SUPER_ADMIN`, `ADMIN` |

**Safety:** Cannot delete if employees are assigned.

---

## 10. Employee Directory Module (`/api/v1/employees`)

### 10.1 Get Employee Self-Profile

| Property | Value |
|----------|-------|
| **Method** | `GET` |
| **URL** | `/api/v1/employees/me` |
| **Auth Required** | Yes |
| **RBAC** | Any authenticated user |

**Description:** Returns personal profile for logged-in staff. Excludes internal HR notes.

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Personal employee profile retrieved successfully",
  "data": {
    "id": "emp-uuid-1",
    "employeeId": "EMP-2026-0001",
    "name": "Kabir Hasan",
    "email": "kabir.hasan@royalsafari.com",
    "phone": "+8801700112233",
    "photo": "/uploads/photos/photo-123.jpg",
    "joiningDate": "2026-08-01T00:00:00.000Z",
    "department": { "id": "dept-1", "name": "Operations & Safaris" },
    "designation": { "id": "desig-1", "name": "Senior Safari Guide" },
    "employmentType": { "id": "type-1", "name": "Full-Time" },
    "employmentStatus": { "id": "status-1", "name": "Active" },
    "manager": null,
    "documents": []
  }
}
```

---

### 10.2 Get All Employees

| Property | Value |
|----------|-------|
| **Method** | `GET` |
| **URL** | `/api/v1/employees` |
| **Auth Required** | Yes |
| **RBAC** | Any authenticated user |

**Query Parameters:**
| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `search` | string | - | Search by name, email, or employeeId |
| `departmentId` | string | - | Filter by Department UUID |
| `designationId` | string | - | Filter by Designation UUID |
| `employmentStatusId` | string | - | Filter by Status UUID |
| `employmentTypeId` | string | - | Filter by Employment Type UUID |
| `page` | number | `1` | Page number |
| `limit` | number | `10` | Items per page |
| `sortBy` | string | `createdAt` | Sort by: `name`, `joiningDate`, `createdAt`, `employeeId` |
| `sortOrder` | string | `desc` | Sort order: `asc` or `desc` |

**Example:** `GET /api/v1/employees?search=kabir&departmentId=dept-1&page=1&limit=10&sortBy=name&sortOrder=asc`

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Employees retrieved successfully",
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 12,
    "totalPages": 2
  },
  "data": [
    {
      "id": "emp-uuid-1",
      "employeeId": "EMP-2026-0001",
      "name": "Kabir Hasan",
      "email": "kabir.hasan@royalsafari.com",
      "phone": "+8801700112233",
      "photo": "/uploads/photos/photo-123.jpg",
      "joiningDate": "2026-08-01T00:00:00.000Z",
      "department": { "id": "dept-1", "name": "Operations & Safaris" },
      "designation": { "id": "desig-1", "name": "Senior Safari Guide" },
      "employmentType": { "id": "type-1", "name": "Full-Time" },
      "employmentStatus": { "id": "status-1", "name": "Active" },
      "manager": {
        "id": "emp-uuid-2",
        "employeeId": "EMP-2025-0010",
        "name": "Manager Name",
        "email": "manager@royalsafari.com",
        "photo": null
      }
    }
  ]
}
```

---

### 10.3 Get Employee By ID

| Property | Value |
|----------|-------|
| **Method** | `GET` |
| **URL** | `/api/v1/employees/:id` |
| **Auth Required** | Yes |
| **RBAC** | Any authenticated user |

**Description:** Returns full employee profile including subordinates, user account, and documents.

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Employee profile retrieved successfully",
  "data": {
    "id": "emp-uuid-1",
    "employeeId": "EMP-2026-0001",
    "name": "Kabir Hasan",
    "email": "kabir.hasan@royalsafari.com",
    "phone": "+8801700112233",
    "photo": "/uploads/photos/photo-123.jpg",
    "joiningDate": "2026-08-01T00:00:00.000Z",
    "hrNotes": "Verified safari license",
    "department": { "id": "dept-1", "name": "Operations & Safaris" },
    "designation": { "id": "desig-1", "name": "Senior Safari Guide" },
    "employmentType": { "id": "type-1", "name": "Full-Time" },
    "employmentStatus": { "id": "status-1", "name": "Active" },
    "manager": null,
    "subordinates": [],
    "user": {
      "id": "user-uuid-1",
      "email": "kabir.hasan@royalsafari.com",
      "role": "EMPLOYEE",
      "avatar": null
    },
    "documents": [
      {
        "id": "doc-uuid-1",
        "documentName": "National_ID_Card.pdf",
        "fileUrl": "/uploads/documents/doc-123.pdf",
        "fileType": "application/pdf",
        "uploadedAt": "2026-08-07T10:38:00.000Z"
      }
    ]
  }
}
```

---

### 10.4 Create Employee

| Property | Value |
|----------|-------|
| **Method** | `POST` |
| **URL** | `/api/v1/employees` |
| **Auth Required** | Yes |
| **RBAC** | `SUPER_ADMIN`, `ADMIN`, `HR_MANAGER` |
| **Content Type** | `multipart/form-data` (if photo) or `application/json` |
| **Validation** | Yes |

**Request Body:**
```json
{
  "name": "Kabir Hasan",
  "email": "kabir.hasan@royalsafari.com",
  "phone": "+8801700112233",
  "departmentId": "dept-uuid-1",
  "designationId": "desig-uuid-1",
  "employmentTypeId": "type-uuid-1",
  "employmentStatusId": "status-uuid-1",
  "joiningDate": "2026-08-01",
  "managerId": null,
  "hrNotes": "Verified safari license & background checks",
  "createUserAccount": true,
  "password": "Employee@123"
}
```

**Validation Rules:**
| Field | Rules |
|-------|-------|
| `name` | Required, trimmed, 2-100 characters |
| `email` | Required, trimmed, valid email, max 255 characters |
| `phone` | Optional, trimmed, max 20 characters |
| `departmentId` | Required, trimmed |
| `designationId` | Required, trimmed |
| `employmentTypeId` | Required, trimmed |
| `employmentStatusId` | Required, trimmed |
| `joiningDate` | Optional, trimmed (ISO date string) |
| `managerId` | Optional, trimmed (must be existing employee ID) |
| `hrNotes` | Optional, trimmed, max 1000 characters |
| `createUserAccount` | Optional, boolean |
| `password` | Optional, 6-128 characters (defaults to `Employee@123`) |
| `photo` | Optional, file (image, max 5MB) |

**Auto-Generated:**
- `employeeId`: Sequential format `EMP-YYYY-NNNN` (e.g., `EMP-2026-0001`)
- User account: If `createUserAccount: true`, creates linked user with `EMPLOYEE` role

**Success Response (201 Created):**
```json
{
  "success": true,
  "message": "Employee created successfully",
  "data": {
    "id": "emp-uuid-new",
    "employeeId": "EMP-2026-0001",
    "name": "Kabir Hasan",
    "email": "kabir.hasan@royalsafari.com",
    "department": { "name": "Operations & Safaris" },
    "designation": { "name": "Senior Safari Guide" },
    "employmentType": { "name": "Full-Time" },
    "employmentStatus": { "name": "Active" },
    "manager": null,
    "user": { "id": "user-uuid-new", "role": "EMPLOYEE" }
  }
}
```

**Error Responses:**
- `400` - Validation failed / Department not found / Designation not found
- `409` - Employee with this email already exists

---

### 10.5 Update Employee

| Property | Value |
|----------|-------|
| **Method** | `PATCH` |
| **URL** | `/api/v1/employees/:id` |
| **Auth Required** | Yes |
| **RBAC** | `SUPER_ADMIN`, `ADMIN`, `HR_MANAGER` |
| **Content Type** | `multipart/form-data` (if photo) or `application/json` |
| **Validation** | Yes |

**Request Body (all fields optional):**
```json
{
  "name": "Kabir Updated",
  "departmentId": "new-dept-uuid",
  "managerId": "manager-uuid",
  "employmentStatusId": "new-status-uuid"
}
```

**Notes:**
- Photo upload replaces old photo (old file deleted from disk)
- Setting `managerId` to empty string removes manager assignment
- Duplicate email check on change

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Employee updated successfully",
  "data": { ... }
}
```

---

### 10.6 Delete Employee

| Property | Value |
|----------|-------|
| **Method** | `DELETE` |
| **URL** | `/api/v1/employees/:id` |
| **Auth Required** | Yes |
| **RBAC** | `SUPER_ADMIN`, `ADMIN` |

**Cleanup on Delete:**
- Employee photo file deleted from disk
- All document files deleted from disk
- Linked user account deleted (if any)

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Employee profile deleted successfully",
  "data": { ... }
}
```

---

## 11. Employee Document Library Module (`/api/v1/employees`)

### 11.1 Get All Documents for Employee

| Property | Value |
|----------|-------|
| **Method** | `GET` |
| **URL** | `/api/v1/employees/:id/documents` |
| **Auth Required** | Yes |
| **RBAC** | Any authenticated user |

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Employee documents retrieved successfully",
  "data": [
    {
      "id": "doc-uuid-1",
      "employeeId": "emp-uuid-1",
      "documentName": "National_ID_Card.pdf",
      "fileUrl": "/uploads/documents/doc-123.pdf",
      "fileType": "application/pdf",
      "uploadedAt": "2026-08-07T10:38:00.000Z",
      "updatedAt": "2026-08-07T10:38:00.000Z"
    }
  ]
}
```

---

### 11.2 Get Single Document By ID

| Property | Value |
|----------|-------|
| **Method** | `GET` |
| **URL** | `/api/v1/employees/documents/:docId` |
| **Auth Required** | Yes |
| **RBAC** | Any authenticated user |

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Document retrieved successfully",
  "data": {
    "id": "doc-uuid-1",
    "employeeId": "emp-uuid-1",
    "documentName": "National_ID_Card.pdf",
    "fileUrl": "/uploads/documents/doc-123.pdf",
    "fileType": "application/pdf",
    "uploadedAt": "2026-08-07T10:38:00.000Z",
    "employee": {
      "id": "emp-uuid-1",
      "employeeId": "EMP-2026-0001",
      "name": "Kabir Hasan"
    }
  }
}
```

---

### 11.3 Upload Document

| Property | Value |
|----------|-------|
| **Method** | `POST` |
| **URL** | `/api/v1/employees/:id/documents` |
| **Auth Required** | Yes |
| **RBAC** | `SUPER_ADMIN`, `ADMIN`, `HR_MANAGER` |
| **Content Type** | `multipart/form-data` |
| **Validation** | Yes |

**Form Data Fields:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `file` | File | Yes | Document file (PDF, DOC, DOCX, XLS, XLSX, JPEG, PNG; max 20MB) |
| `documentName` | Text | No | Custom name (defaults to original filename) |

**Success Response (201 Created):**
```json
{
  "success": true,
  "message": "Employee document uploaded successfully",
  "data": {
    "id": "doc-uuid-new",
    "employeeId": "emp-uuid-1",
    "documentName": "National_ID_Card.pdf",
    "fileUrl": "/uploads/documents/doc-456.pdf",
    "fileType": "application/pdf",
    "uploadedAt": "2026-08-10T00:00:00.000Z"
  }
}
```

**Error Response:**
- `400` - Document file is required / Invalid file type
- `404` - Employee not found

---

### 11.4 Update Document

| Property | Value |
|----------|-------|
| **Method** | `PATCH` |
| **URL** | `/api/v1/employees/documents/:docId` |
| **Auth Required** | Yes |
| **RBAC** | `SUPER_ADMIN`, `ADMIN`, `HR_MANAGER` |
| **Content Type** | `multipart/form-data` (if replacing file) or `application/json` |
| **Validation** | Yes |

**Request Body:**
```json
{
  "documentName": "Updated_National_ID.pdf"
}
```

**Or with file replacement:**
- Form Data with `file` field and optional `documentName`

**Notes:**
- Updating file replaces old file (old file deleted from disk)
- Only `documentName` is required for name-only update

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Document updated successfully",
  "data": {
    "id": "doc-uuid-1",
    "documentName": "Updated_National_ID.pdf",
    "fileUrl": "/uploads/documents/doc-789.pdf",
    "fileType": "application/pdf",
    "uploadedAt": "2026-08-07T10:38:00.000Z",
    "updatedAt": "2026-08-10T00:00:00.000Z"
  }
}
```

---

### 11.5 Delete Document

| Property | Value |
|----------|-------|
| **Method** | `DELETE` |
| **URL** | `/api/v1/employees/documents/:docId` |
| **Auth Required** | Yes |
| **RBAC** | `SUPER_ADMIN`, `ADMIN` |
| **Note** | File deleted from disk as well |

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Employee document deleted successfully",
  "data": { ... }
}
```

**Error Response:**
- `404` - Employee document not found

---

## 12. HRM Dashboard Module (`/api/v1/hrm`)

### 12.1 Get HRM Dashboard Statistics

| Property | Value |
|----------|-------|
| **Method** | `GET` |
| **URL** | `/api/v1/hrm/dashboard/stats` |
| **Auth Required** | Yes |
| **RBAC** | `SUPER_ADMIN`, `ADMIN`, `HR_MANAGER` |

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "HRM dashboard statistics retrieved successfully",
  "data": {
    "totalEmployees": 12,
    "activeEmployees": 9,
    "probationEmployees": 2,
    "inactiveEmployees": 1,
    "departmentBreakdown": [
      {
        "departmentId": "dept-uuid-1",
        "name": "Operations & Safaris",
        "count": 5
      },
      {
        "departmentId": "dept-uuid-2",
        "name": "Human Resources",
        "count": 3
      }
    ],
    "recentJoins": [
      {
        "id": "emp-uuid-1",
        "employeeId": "EMP-2026-0001",
        "name": "Kabir Hasan",
        "email": "kabir.hasan@royalsafari.com",
        "photo": "/uploads/photos/photo-123.jpg",
        "joiningDate": "2026-08-01T00:00:00.000Z",
        "department": { "name": "Operations & Safaris" },
        "designation": { "name": "Senior Safari Guide" },
        "employmentStatus": { "name": "Active" }
      }
    ]
  }
}
```

---

## 13. System Health Check

| Property | Value |
|----------|-------|
| **Method** | `GET` |
| **URL** | `/api/v1/health` |
| **Auth Required** | No |

**Success Response (200 OK):**
```json
{
  "success": true,
  "status": "UP",
  "database": "CONNECTED",
  "timestamp": "2026-08-10T00:00:00.000Z"
}
```

**Error Response (503 Service Unavailable):**
```json
{
  "success": false,
  "status": "DOWN",
  "database": "DISCONNECTED",
  "error": "Connection refused",
  "timestamp": "2026-08-10T00:00:00.000Z"
}
```

---

## 14. Error Handling

### Standard Error Response Format

```json
{
  "success": false,
  "status": 400,
  "error": "Error message"
}
```

### Prisma Error Codes

| Code | HTTP Status | Message |
|------|-------------|---------|
| `P2002` | 409 | A record with this value already exists |
| `P2025` | 404 | Record not found |
| `P2003` | 400 | Related record not found |
| `P2014` | 409 | Required related record is missing |

### Validation Error Response

```json
{
  "success": false,
  "error": "Email is required",
  "details": [
    {
      "code": "invalid_type",
      "expected": "string",
      "received": "undefined",
      "path": ["email"],
      "message": "Email is required"
    }
  ]
}
```

### Rate Limit Error Response

```json
{
  "success": false,
  "error": "Too many authentication attempts. Please try again in 15 minutes."
}
```

**Headers included:**
- `Retry-After: 900` (seconds until rate limit resets)

---

## 15. RBAC Security Matrix

| Endpoint | Read | Create | Update | Delete |
|----------|------|--------|--------|--------|
| **Auth (register, login, logout)** | Public | Public | N/A | N/A |
| **Auth (profile, change-password)** | Authenticated | N/A | Authenticated | N/A |
| **Users** | `ADMIN`, `SUPER_ADMIN` | N/A | `ALL ROLES` | `ADMIN`, `SUPER_ADMIN` |
| **Departments** | Authenticated | `SA`, `ADMIN`, `HR_MANAGER` | `SA`, `ADMIN`, `HR_MANAGER` | `ADMIN`, `SUPER_ADMIN` |
| **Designations** | Authenticated | `SA`, `ADMIN`, `HR_MANAGER` | `SA`, `ADMIN`, `HR_MANAGER` | `ADMIN`, `SUPER_ADMIN` |
| **Employment Types** | Authenticated | `SA`, `ADMIN`, `HR_MANAGER` | `SA`, `ADMIN`, `HR_MANAGER` | `ADMIN`, `SUPER_ADMIN` |
| **Employment Statuses** | Authenticated | `SA`, `ADMIN`, `HR_MANAGER` | `SA`, `ADMIN`, `HR_MANAGER` | `ADMIN`, `SUPER_ADMIN` |
| **Employees** | Authenticated | `SA`, `ADMIN`, `HR_MANAGER` | `SA`, `ADMIN`, `HR_MANAGER` | `ADMIN`, `SUPER_ADMIN` |
| **Employee Documents** | Authenticated | `SA`, `ADMIN`, `HR_MANAGER` | `SA`, `ADMIN`, `HR_MANAGER` | `ADMIN`, `SUPER_ADMIN` |
| **HRM Dashboard** | `SA`, `ADMIN`, `HR_MANAGER` | N/A | N/A | N/A |

**Legend:**
- `SA` = `SUPER_ADMIN`
- `ALL ROLES` = `SUPER_ADMIN`, `ADMIN`, `HR_MANAGER`, `EMPLOYEE`
- `Authenticated` = Any valid JWT token

---

## Appendix: Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `PORT` | No | `5000` | Server port |
| `DATABASE_URL` | Yes | - | PostgreSQL connection string |
| `JWT_SECRET` | Yes | - | Access token signing secret |
| `JWT_REFRESH_SECRET` | Yes | - | Refresh token signing secret |
| `JWT_EXPIRES_IN` | No | `1d` | Access token expiry |
| `JWT_REFRESH_EXPIRES_IN` | No | `7d` | Refresh token expiry |
| `NODE_ENV` | No | `development` | Environment mode |
