# PFE Gestion Platform

> A complete digital platform for managing university final-year projects, internships, supervision, tasks, and academic reporting.

PFE Gestion Platform centralizes the full internship lifecycle between students, academic supervisors, program managers, companies, and administrators. It combines a role-aware React dashboard with a Spring Boot REST API and a MySQL persistence layer.

## Overview

The platform is designed to replace fragmented internship follow-up processes with a shared workspace where each stakeholder can access the information relevant to their responsibilities:

- Administrators manage the academic structure, users, companies, supervisors, internships, and reports.
- Program managers (`Responsable Filière`) monitor students and internships within their academic program.
- Academic supervisors (`Encadrant Académique`) follow assigned internships and manage work tasks.
- Students consult their internship, track assigned tasks, and follow their progress.

The application interface is primarily in French, while the backend API and persisted enum values use English identifiers for consistency.

## Main capabilities

### Internship management

- Create, update, search, filter, and delete internships.
- Associate an internship with:
  - one student;
  - a company;
  - an academic supervisor;
  - a professional supervisor.
- Track the internship through the following statuses:
  - `PENDING`
  - `APPROVED`
  - `IN_PROGRESS`
  - `COMPLETED`
  - `REJECTED`
  - `CANCELLED`
- Enforce one internship per student.
- Validate internship date consistency.

### Task tracking

- Create and edit internship tasks.
- Organize tasks by status in a Kanban-style board.
- Track due dates and task descriptions.
- Use the statuses `TODO`, `IN_PROGRESS`, `COMPLETED`, and `BLOCKED`.
- Display task progress on role-specific dashboards.

### Academic administration

- Manage filières and their responsible managers.
- Manage student records and academic affiliations.
- Manage academic supervisors.
- Manage companies and professional supervisors.
- Search and paginate domain records through the REST API.

### Dashboards and reporting

- Global administrator statistics.
- Filière-scoped statistics for program managers.
- Supervision dashboards for academic supervisors.
- Personal internship and task dashboards for students.
- PDF report generation for internships and students.

### Security

- Stateless JWT authentication.
- Access and refresh token endpoints.
- BCrypt password hashing.
- Role-based route and endpoint protection.
- CORS configuration for local frontend development.

## Architecture

```text
┌──────────────────────────────┐
│ React 19 + Vite + Tailwind   │
│ Role-based dashboard SPA     │
└──────────────┬───────────────┘
               │ Axios / JSON / JWT
┌──────────────▼───────────────┐
│ Spring Boot REST API         │
│ Controllers                  │
│ Services                    │
│ DTOs + MapStruct mappers    │
│ Spring Security + JWT       │
└──────────────┬───────────────┘
               │ Spring Data JPA
┌──────────────▼───────────────┐
│ MySQL 8                      │
└──────────────────────────────┘
```

The backend follows a conventional layered monolith:

```text
Controller
    -> Service
        -> Repository
            -> Entity / MySQL
```

DTOs define API contracts, MapStruct handles entity mapping, and service methods define transaction boundaries and business validation.

## Repository structure

```text
PFE Gestion Platform Complete/
├── README.md
├── PROJECT_CONTEXT.md
├── PFE Gestion Platform/
│   ├── pom.xml
│   ├── Dockerfile
│   ├── docker-compose.yml
│   └── src/
│       └── main/
│           ├── java/ma/univ/pfe/
│           │   ├── config/
│           │   ├── controller/
│           │   ├── dto/
│           │   ├── entity/
│           │   ├── enums/
│           │   ├── exception/
│           │   ├── mapper/
│           │   ├── repository/
│           │   ├── security/
│           │   └── service/
│           └── resources/application.yml
└── PFE Gestion Frontend/
    └── pfe-front/
        ├── package.json
        ├── vite.config.js
        ├── public/
        └── src/
            ├── api/
            ├── components/
            ├── context/
            ├── layouts/
            ├── lib/
            ├── pages/
            └── routes/
```

`PROJECT_CONTEXT.md` is the detailed architectural handoff document. It records module responsibilities, business rules, known risks, validation results, and recommended next steps.

## Technology stack

### Backend

- Java 21
- Spring Boot 3.2.5
- Spring Web
- Spring Security
- Spring Data JPA / Hibernate
- Spring Validation
- MySQL Connector/J
- JJWT 0.12.5
- MapStruct 1.5.5
- Lombok 1.18.32
- Springdoc OpenAPI
- iText PDF
- Maven

### Frontend

- React 19
- React DOM
- React Router
- Axios
- Tailwind CSS 4
- Vite
- ESLint

### Infrastructure

- MySQL 8.0
- Docker
- Docker Compose

## Requirements

Install the following before running the project manually:

- Java 21
- Maven 3.9+
- Node.js and npm
- MySQL 8, or Docker Desktop

## Running with Docker Compose

From the backend directory:

```powershell
cd "PFE Gestion Platform"
docker compose up --build
```

The Compose configuration defines:

- MySQL on host port `3306`
- Backend container on port `8090`
- Database name `pfe_db`
- Database user `pfe_user`

The backend image is built with a Java 21 Maven build stage and runs on a Java 21 JRE image.

## Running the backend locally

```powershell
cd "PFE Gestion Platform"
mvn spring-boot:run
```

The current `application.yml` configures:

- Server port: `8085`
- Servlet context path: `/api`
- API base URL: `http://localhost:8085/api`

Swagger/OpenAPI is available at:

```text
http://localhost:8085/api/swagger-ui.html
```

> **Configuration note:** the current frontend Axios client points to `http://localhost:8080/api`, while the backend YAML uses port `8085` and Docker Compose exposes port `8090`. Choose one canonical runtime configuration and align the frontend, backend, and Compose settings before connecting the applications.

## Running the frontend locally

```powershell
cd "PFE Gestion Frontend\pfe-front"
npm install
npm run dev
```

The Vite development server normally starts at:

```text
http://localhost:5173
```

Available scripts:

```powershell
npm run dev       # Start the development server
npm run build     # Build the production bundle
npm run lint      # Run ESLint
npm run preview   # Preview the production bundle
```

## Demo accounts

When the database is empty, the backend seed runner creates development accounts:

| Role | Email | Password |
|---|---|---|
| Administrator | `admin@univ.ma` | `admin123` |
| Program manager | `responsable@univ.ma` | `resp123` |
| Academic supervisor | `encadrant@univ.ma` | `enc123` |
| Student | `etudiant@univ.ma` | `etu123` |

These credentials are for local development only. They must be replaced or disabled in any real deployment.

## API resources

All API resources are served below the `/api` context path.

| Resource | Purpose |
|---|---|
| `/auth` | Registration, login, token refresh, current user |
| `/users` | User lookup and role filtering |
| `/admin/responsables` | Program manager administration |
| `/filieres` | Academic program management |
| `/students` | Student management |
| `/academic-supervisors` | Academic supervisor management |
| `/professional-supervisors` | Professional contact management |
| `/companies` | Company management |
| `/internships` | Internship lifecycle and assignments |
| `/tasks` | Internship task management |
| `/dashboard/stats` | Role-aware dashboard aggregates |
| `/reports` | Internship and student PDF reports |

Most responses follow this shape:

```json
{
  "success": true,
  "message": "Operation successful",
  "data": {},
  "timestamp": "2026-10-11T19:00:00"
}
```

Paginated resources return `content`, `page`, `size`, `totalElements`, `totalPages`, and `last` inside `data`.

## Authentication flow

1. The frontend submits credentials to `POST /api/auth/login`.
2. The backend authenticates the user and returns access and refresh tokens.
3. The frontend stores the tokens locally and requests `GET /api/auth/me`.
4. Subsequent Axios requests attach the access token as a Bearer token.
5. Spring Security validates the JWT and applies role-based authorization.

The frontend stores authentication state in `localStorage` and exposes it through `AuthContext`.

## Quality status

The current project baseline has been verified as follows:

| Check | Result |
|---|---|
| Frontend production build | Passing |
| Frontend ESLint | Passing with 7 React Hook dependency warnings |
| Backend Maven test lifecycle | Passing, but no test sources exist |

## Current limitations and important warnings

This project is functional but still requires hardening before production use:

- Public registration currently accepts a caller-supplied role and must not be trusted for privileged account creation.
- Resource ownership checks need to be strengthened for ID-based student, internship, and task operations.
- Access and refresh JWTs should be explicitly distinguished and issuer validation should be enforced.
- The default JWT secret and seeded credentials must not be used in production.
- Hibernate currently uses `ddl-auto: create`; a migration system should be introduced before persistent deployment.
- Frontend, backend, and Docker ports are currently inconsistent.
- There is no automated backend test suite or frontend test suite.
- Several screens load up to 500 records and filter locally, which may not scale for large datasets.

For the complete risk register and handoff state, see [PROJECT_CONTEXT.md](./PROJECT_CONTEXT.md).

## Recommended roadmap

### Security

1. Restrict public registration to a safe role such as `ETUDIANT`.
2. Add token-purpose claims for access and refresh tokens.
3. Validate JWT issuer, token purpose, expiry, and user state.
4. Add service-level ownership and scope checks.
5. Remove default production secrets and credentials.

### Reliability

1. Align frontend, backend, and Docker environment configuration.
2. Add Flyway or Liquibase migrations.
3. Replace `ddl-auto: create` with a safe production schema strategy.
4. Add structured backend logging and request correlation.

### Maintainability

1. Add integration tests for authentication and authorization.
2. Add domain tests for internship and task workflows.
3. Standardize server-side filtering and pagination.
4. Resolve React hook dependency warnings.
5. Model valid internship status transitions explicitly.

## License

No license file is currently included in the repository. Define and add an appropriate license before distributing the project publicly.
