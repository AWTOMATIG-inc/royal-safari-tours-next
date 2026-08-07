# Royal Safari Tours — HRM & Auth REST API Documentation

This document contains full Postman testing instructions, request headers, query parameters, sample request payloads, and sample responses for all API endpoints implemented across all phases.

---

## 🌐 Server Configuration & Postman Collection

- **Base URL**: `http://localhost:5000/api/v1`
- **Postman Collection File**: [hrm_api_postman_collection.json](file:///C:/Users/office3/.gemini/antigravity-ide/brain/4eac59e5-ad26-4ea0-90f0-46e140b1bd2a/scratch/hrm_api_postman_collection.json) *(Import directly into Postman)*

---

## 🔒 1. Dual JWT Token Architecture

- **Access Token (`accessToken`)**: Short-lived (1 day default). Included in JSON response body (`accessToken` and `token`) and set as an HTTP-only `token` cookie. Pass via `Authorization: Bearer <accessToken>` header for protected endpoints.
- **Refresh Token (`refreshToken`)**: Long-lived (7 days default). Included in JSON response body and HTTP-only `refreshToken` cookie. Used to issue new access tokens via `POST /api/v1/auth/refresh-token`.

---

## 🔑 2. Authentication Module (`/api/v1/auth`)

### 2.1 Login User / Super Admin
- **Method**: `POST`
- **URL**: `http://localhost:5000/api/v1/auth/login`
- **Headers**: `Content-Type: application/json`
- **Request Body**:
```json
{
  "email": "admin@gmail.com",
  "password": "Admin@123"
}
```
- **Sample Success Response (200 OK)**:
```json
{
  "success": true,
  "message": "Login successful",
  "accessToken": "eyJhbGciOiJIUzI1Ni...",
  "refreshToken": "eyJhbGciOiJIUzI1Ni...",
  "token": "eyJhbGciOiJIUzI1Ni...",
  "user": {
    "id": "uuid-v4-string",
    "name": "Super Admin",
    "email": "admin@gmail.com",
    "role": "SUPER_ADMIN",
    "avatar": null
  }
}
```

### 2.2 Refresh Access Token
- **Method**: `POST`
- **URL**: `http://localhost:5000/api/v1/auth/refresh-token`
- **Headers**: `Content-Type: application/json`
- **Request Body**:
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1Ni..."
}
```
- **Sample Success Response (200 OK)**:
```json
{
  "success": true,
  "message": "Access token refreshed successfully",
  "accessToken": "eyJhbGciOiJIUzI1Ni...",
  "token": "eyJhbGciOiJIUzI1Ni...",
  "user": {
    "id": "uuid-v4-string",
    "name": "Super Admin",
    "email": "admin@gmail.com",
    "role": "SUPER_ADMIN"
  }
}
```

### 2.3 Register User
- **Method**: `POST`
- **URL**: `http://localhost:5000/api/v1/auth/register`
- **Headers**: `Content-Type: application/json`
- **Request Body**:
```json
{
  "name": "John Staff",
  "email": "john@example.com",
  "password": "Password123"
}
```

### 2.4 Get Current User Profile
- **Method**: `GET`
- **URL**: `http://localhost:5000/api/v1/auth/profile`
- **Headers**: `Authorization: Bearer <accessToken>`

### 2.5 Logout User
- **Method**: `POST`
- **URL**: `http://localhost:5000/api/v1/auth/logout`

---

## 🏢 3. Department Master Module (`/api/v1/departments`)

### 3.1 Get All Departments
- **Method**: `GET`
- **URL**: `http://localhost:5000/api/v1/departments`
- **Headers**: `Authorization: Bearer <accessToken>`
- **Sample Response (200 OK)**:
```json
{
  "success": true,
  "message": "Departments retrieved successfully",
  "data": [
    {
      "id": "dept-uuid-1",
      "name": "Operations & Safaris",
      "description": "Safari management & field logistics",
      "_count": { "employees": 5 }
    }
  ]
}
```

### 3.2 Get Department By ID
- **Method**: `GET`
- **URL**: `http://localhost:5000/api/v1/departments/:id`
- **Headers**: `Authorization: Bearer <accessToken>`

### 3.3 Create Department
- **Method**: `POST`
- **URL**: `http://localhost:5000/api/v1/departments`
- **Headers**: `Authorization: Bearer <accessToken>`, `Content-Type: application/json`
- **Role Required**: `SUPER_ADMIN`, `ADMIN`, `HR_MANAGER`
- **Request Body**:
```json
{
  "name": "Quality Assurance",
  "description": "Software QA & System Compliance Testing"
}
```

### 3.4 Update Department
- **Method**: `PATCH`
- **URL**: `http://localhost:5000/api/v1/departments/:id`
- **Headers**: `Authorization: Bearer <accessToken>`, `Content-Type: application/json`
- **Role Required**: `SUPER_ADMIN`, `ADMIN`, `HR_MANAGER`
- **Request Body**:
```json
{
  "name": "Quality Assurance & Compliance",
  "description": "Updated QA department scope"
}
```

### 3.5 Delete Department
- **Method**: `DELETE`
- **URL**: `http://localhost:5000/api/v1/departments/:id`
- **Headers**: `Authorization: Bearer <accessToken>`
- **Role Required**: `SUPER_ADMIN`, `ADMIN`
- **Safety Note**: Cannot delete if employees are currently assigned to this department.

---

## 🏷️ 4. Designation Master Module (`/api/v1/designations`)

### 4.1 Get All Designations
- **Method**: `GET`
- **URL**: `http://localhost:5000/api/v1/designations`
- **Headers**: `Authorization: Bearer <accessToken>`

### 4.2 Get Designation By ID
- **Method**: `GET`
- **URL**: `http://localhost:5000/api/v1/designations/:id`
- **Headers**: `Authorization: Bearer <accessToken>`

### 4.3 Create Designation
- **Method**: `POST`
- **URL**: `http://localhost:5000/api/v1/designations`
- **Headers**: `Authorization: Bearer <accessToken>`, `Content-Type: application/json`
- **Role Required**: `SUPER_ADMIN`, `ADMIN`, `HR_MANAGER`
- **Request Body**:
```json
{
  "name": "Lead QA Engineer",
  "description": "Test automation & quality assurance lead"
}
```

### 4.4 Update Designation
- **Method**: `PATCH`
- **URL**: `http://localhost:5000/api/v1/designations/:id`
- **Headers**: `Authorization: Bearer <accessToken>`, `Content-Type: application/json`
- **Role Required**: `SUPER_ADMIN`, `ADMIN`, `HR_MANAGER`

### 4.5 Delete Designation
- **Method**: `DELETE`
- **URL**: `http://localhost:5000/api/v1/designations/:id`
- **Headers**: `Authorization: Bearer <accessToken>`
- **Role Required**: `SUPER_ADMIN`, `ADMIN`

---

## 📋 5. Employment Type Master Module (`/api/v1/employment-types`)

### 5.1 Get All Employment Types
- **Method**: `GET`
- **URL**: `http://localhost:5000/api/v1/employment-types`
- **Headers**: `Authorization: Bearer <accessToken>`

### 5.2 Get Employment Type By ID
- **Method**: `GET`
- **URL**: `http://localhost:5000/api/v1/employment-types/:id`
- **Headers**: `Authorization: Bearer <accessToken>`

### 5.3 Create Employment Type
- **Method**: `POST`
- **URL**: `http://localhost:5000/api/v1/employment-types`
- **Headers**: `Authorization: Bearer <accessToken>`, `Content-Type: application/json`
- **Role Required**: `SUPER_ADMIN`, `ADMIN`, `HR_MANAGER`
- **Request Body**:
```json
{
  "name": "Consultant"
}
```

### 5.4 Update Employment Type
- **Method**: `PATCH`
- **URL**: `http://localhost:5000/api/v1/employment-types/:id`
- **Headers**: `Authorization: Bearer <accessToken>`, `Content-Type: application/json`
- **Role Required**: `SUPER_ADMIN`, `ADMIN`, `HR_MANAGER`

### 5.5 Delete Employment Type
- **Method**: `DELETE`
- **URL**: `http://localhost:5000/api/v1/employment-types/:id`
- **Headers**: `Authorization: Bearer <accessToken>`
- **Role Required**: `SUPER_ADMIN`, `ADMIN`

---

## ⚡ 6. Employment Status Master Module (`/api/v1/employment-statuses`)

### 6.1 Get All Employment Statuses
- **Method**: `GET`
- **URL**: `http://localhost:5000/api/v1/employment-statuses`
- **Headers**: `Authorization: Bearer <accessToken>`

### 6.2 Get Employment Status By ID
- **Method**: `GET`
- **URL**: `http://localhost:5000/api/v1/employment-statuses/:id`
- **Headers**: `Authorization: Bearer <accessToken>`

### 6.3 Create Employment Status
- **Method**: `POST`
- **URL**: `http://localhost:5000/api/v1/employment-statuses`
- **Headers**: `Authorization: Bearer <accessToken>`, `Content-Type: application/json`
- **Role Required**: `SUPER_ADMIN`, `ADMIN`, `HR_MANAGER`
- **Request Body**:
```json
{
  "name": "Notice Period"
}
```

### 6.4 Update Employment Status
- **Method**: `PATCH`
- **URL**: `http://localhost:5000/api/v1/employment-statuses/:id`
- **Headers**: `Authorization: Bearer <accessToken>`, `Content-Type: application/json`
- **Role Required**: `SUPER_ADMIN`, `ADMIN`, `HR_MANAGER`

### 6.5 Delete Employment Status
- **Method**: `DELETE`
- **URL**: `http://localhost:5000/api/v1/employment-statuses/:id`
- **Headers**: `Authorization: Bearer <accessToken>`
- **Role Required**: `SUPER_ADMIN`, `ADMIN`

---

## 👥 7. Phase 3: Employee Directory Module (`/api/v1/employees`)

### 7.1 Get Employee Self-Profile
- **Method**: `GET`
- **URL**: `http://localhost:5000/api/v1/employees/me`
- **Headers**: `Authorization: Bearer <accessToken>`
- **Description**: Returns personal profile details for logged-in staff member (excludes sensitive internal HR notes).

### 7.2 Get All Employees (Search, Filter, Pagination & Sorting)
- **Method**: `GET`
- **URL**: `http://localhost:5000/api/v1/employees`
- **Query Parameters**:
  - `search` (Optional): Search by name, email, or employeeId (e.g. `?search=EMP-2026`)
  - `departmentId` (Optional): Filter by Department UUID
  - `designationId` (Optional): Filter by Designation UUID
  - `employmentStatusId` (Optional): Filter by Status UUID
  - `employmentTypeId` (Optional): Filter by Employment Type UUID
  - `page` (Optional, Default: `1`)
  - `limit` (Optional, Default: `10`)
  - `sortBy` (Optional, Default: `createdAt`)
  - `sortOrder` (Optional: `asc` | `desc`)
- **Headers**: `Authorization: Bearer <accessToken>`
- **Sample Success Response (200 OK)**:
```json
{
  "success": true,
  "message": "Employees retrieved successfully",
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 1,
    "totalPages": 1
  },
  "data": [
    {
      "id": "emp-uuid-1",
      "employeeId": "EMP-2026-0001",
      "name": "Kabir Hasan",
      "email": "kabir.hasan@royalsafari.com",
      "phone": "+8801700112233",
      "photo": "/uploads/photos/photo-17849000-123.jpg",
      "joiningDate": "2026-08-01T00:00:00.000Z",
      "hrNotes": "Newly hired Senior Safari Guide",
      "department": { "id": "dept-1", "name": "Operations & Safaris" },
      "designation": { "id": "desig-1", "name": "Senior Safari Guide" },
      "employmentType": { "id": "type-1", "name": "Full-Time" },
      "employmentStatus": { "id": "status-1", "name": "Active" },
      "manager": null
    }
  ]
}
```

### 7.3 Get Detailed Employee Profile By ID
- **Method**: `GET`
- **URL**: `http://localhost:5000/api/v1/employees/:id`
- **Headers**: `Authorization: Bearer <accessToken>`
- **Description**: Returns employee details including master relations, reporting manager, direct subordinates list, linked user credentials info, and document library files.

### 7.4 Create Employee Record
- **Method**: `POST`
- **URL**: `http://localhost:5000/api/v1/employees`
- **Headers**: `Authorization: Bearer <accessToken>`, `Content-Type: application/json` or `multipart/form-data`
- **Role Required**: `SUPER_ADMIN`, `ADMIN`, `HR_MANAGER`
- **Auto Feature**: Auto-generates `employeeId` sequence (e.g. `EMP-2026-0001`). If `createUserAccount` is `true`, creates linked User login credentials automatically.
- **Request Body (JSON)**:
```json
{
  "name": "Kabir Hasan",
  "email": "kabir.hasan@royalsafari.com",
  "phone": "+8801700112233",
  "departmentId": "c0a80101-0000-0000-0000-000000000001",
  "designationId": "c0a80102-0000-0000-0000-000000000001",
  "employmentTypeId": "c0a80103-0000-0000-0000-000000000001",
  "employmentStatusId": "c0a80104-0000-0000-0000-000000000001",
  "joiningDate": "2026-08-01",
  "managerId": null,
  "hrNotes": "Verified safari license & background checks",
  "createUserAccount": true,
  "password": "Employee@123"
}
```

### 7.5 Update Employee Record
- **Method**: `PATCH`
- **URL**: `http://localhost:5000/api/v1/employees/:id`
- **Headers**: `Authorization: Bearer <accessToken>`, `Content-Type: application/json` or `multipart/form-data`
- **Role Required**: `SUPER_ADMIN`, `ADMIN`, `HR_MANAGER`

### 7.6 Delete Employee Record
- **Method**: `DELETE`
- **URL**: `http://localhost:5000/api/v1/employees/:id`
- **Headers**: `Authorization: Bearer <accessToken>`
- **Role Required**: `SUPER_ADMIN`, `ADMIN`

---

## 📑 8. Phase 3: Employee Document Library Module (`/api/v1/employees`)

### 8.1 Upload Employee Document (NID, Passport, Certificates)
- **Method**: `POST`
- **URL**: `http://localhost:5000/api/v1/employees/:id/documents`
- **Headers**: `Authorization: Bearer <accessToken>`, `Content-Type: multipart/form-data`
- **Form Data Fields**:
  - `file` (File): Document file (PDF, PNG, JPG, DOCX, max 20MB)
  - `documentName` (Text): e.g. `National_ID_Card.pdf`
- **Role Required**: `SUPER_ADMIN`, `ADMIN`, `HR_MANAGER`
- **Sample Success Response (201 Created)**:
```json
{
  "success": true,
  "message": "Employee document uploaded successfully",
  "data": {
    "id": "doc-uuid-1",
    "employeeId": "emp-uuid-1",
    "documentName": "National_ID_Card.pdf",
    "fileUrl": "/uploads/documents/doc-17849000-456.pdf",
    "fileType": "application/pdf",
    "uploadedAt": "2026-08-07T10:38:00.000Z"
  }
}
```

### 8.2 Delete Employee Document
- **Method**: `DELETE`
- **URL**: `http://localhost:5000/api/v1/employees/documents/:docId`
- **Headers**: `Authorization: Bearer <accessToken>`
- **Role Required**: `SUPER_ADMIN`, `ADMIN`, `HR_MANAGER`

---

## 📊 9. Phase 4: Basic HRM Dashboard Stats Module (`/api/v1/hrm`)

### 9.1 Get HRM Dashboard Statistics
- **Method**: `GET`
- **URL**: `http://localhost:5000/api/v1/hrm/dashboard/stats`
- **Headers**: `Authorization: Bearer <accessToken>`
- **Role Required**: `SUPER_ADMIN`, `ADMIN`, `HR_MANAGER`
- **Sample Success Response (200 OK)**:
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
        "departmentId": "c0a80101-0000-0000-0000-000000000001",
        "name": "Operations & Safaris",
        "count": 5
      },
      {
        "departmentId": "c0a80101-0000-0000-0000-000000000002",
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
        "photo": "/uploads/photos/photo-17849000-123.jpg",
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

## 🏥 10. System Health Check Endpoint
- **Method**: `GET`
- **URL**: `http://localhost:5000/api/v1/health`
- **Sample Response (200 OK)**:
```json
{
  "success": true,
  "status": "UP",
  "database": "CONNECTED",
  "timestamp": "2026-08-07T16:40:00.000Z"
}
```

---

## 🛡️ 11. Role-Based Access Control (RBAC) Security Matrix

| Endpoint Group | Read Access | Create / Update Access | Delete Access |
| :--- | :--- | :--- | :--- |
| **Auth / Self Profile** | `All Authenticated Users` | N/A | N/A |
| **HRM Dashboard Stats** | `HR_MANAGER`, `ADMIN`, `SUPER_ADMIN` | N/A | N/A |
| **Employee Directory** | `All Authenticated Users` | `HR_MANAGER`, `ADMIN`, `SUPER_ADMIN` | `ADMIN`, `SUPER_ADMIN` |
| **Employee Documents** | `All Authenticated Users` | `HR_MANAGER`, `ADMIN`, `SUPER_ADMIN` | `HR_MANAGER`, `ADMIN`, `SUPER_ADMIN` |
| **Department Master** | `All Authenticated Users` | `HR_MANAGER`, `ADMIN`, `SUPER_ADMIN` | `ADMIN`, `SUPER_ADMIN` |
| **Designation Master** | `All Authenticated Users` | `HR_MANAGER`, `ADMIN`, `SUPER_ADMIN` | `ADMIN`, `SUPER_ADMIN` |
| **Employment Type Master**| `All Authenticated Users` | `HR_MANAGER`, `ADMIN`, `SUPER_ADMIN` | `ADMIN`, `SUPER_ADMIN` |
| **Employment Status Master**| `All Authenticated Users` | `HR_MANAGER`, `ADMIN`, `SUPER_ADMIN` | `ADMIN`, `SUPER_ADMIN` |
