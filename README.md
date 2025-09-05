# WiseUp Frontend

> WiseUp is a platform that connects startups with experienced retirees to provide affordable, flexible domain-specific expertise — while giving retirees purpose, recognition and extra income.

This project is using Vite + React + Typescript.

## For Supervisors

This frontend is automatically started when you run `docker compose up -d` from the parent directory (after moving the `docker-compose.yml` file from the Backend folder).

**Access the WiseUp application at:** http://localhost:5173

For complete setup instructions, please refer to the Backend README.md file.

### Email Verification for Testing

For testing purposes, if you use an email address with the domain `example.com`, the magic link verification process will be skipped. This allows to test the application without needing to verify email addresses.

---

### Forms Dummy Data

To make testing, development, and submission easier, the application provides a set dummy data button in each form. This button populates the form with realistic data, allowing you to test the application without manually entering information.

## For Developers - Development Setup

🚨 **ALWAYS UPDATE YOUR ENV FILE AFTER PULLING FROM GIT!** 🚨

To set up the WiseUp Frontend project, follow these steps:

1. Install dependencies:

```bash
npm install
```

2. Create an env file (see Environment Variables section)

3. Start the development server:

```bash
npm run dev
```

4. Format all files (do this always before committing!)

```bash
npm run format
```

5. Run the linter (do this always before committing!)

```bash
npm run lint
```

Fix all lint warnings & errors before committing. Then format again.

6. Build for production:

```bash
npm run build
```

7. Preview the production build:

```bash
npm run preview
```

### Environment Variables

Create a `.env` file in the root directory by copying .env.example and adjusting the values.

### Docker

For Docker instructions during development, see the Backend README.md file.

### Regenerate OpenAPI client

Run this after the OpenAPI spec changed in the backend.

Note: The backend repository must be cloned next to this repo at ../Backend

```bash
npm run generate:api // this will generate the OpenAPI client in Frontend folder only
```

or

```bash
npm run generate:api:all // this will generate the OpenAPI client in Frontend and Backend folders
```

or

```bash
npm run generate:api:backend // this will generate the OpenAPI client in Backend folder only
```

---

## UI Components

We are using [shadcn](https://ui.shadcn.com/) as UI component library.

How to add a component (button component as an example):

```bash
npx shadcn@latest add button
```
