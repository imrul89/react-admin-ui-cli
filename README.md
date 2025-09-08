# React CLI

A custom **React CLI tool** for quickly scaffolding CRUD modules in projects based on the [React Admin Skeleton](https://gitea.vivasoftltd.com/Vivasoft/react-admin-skeleton) architecture.

This CLI helps you save development time by generating boilerplate code (pages, feature components, hooks, services, models, routes) that fits perfectly into the React Admin Skeleton structure.

---

## ✨ Features

- 🚀 Generate full **CRUD modules** with one command
- 📂 Auto-create files following the React Admin Skeleton folder structure
- 🔗 Adds pages, feature components, hooks, services and models automatically
- ⚡ Compatible with **React 18**, **Redux Toolkit**, **Ant Design**, and **Vite**
- 🛠 Simple CLI interface

---

## 📦 Installation

### Global Install

```bash
npm install -g react-admin-ui-cli
```

## 🚀 Usage
### Generate a new CRUD module
Module name should be in Singular or PascalCase (e.g. User, UserGroup).

```bash
rcli generate module <ModuleName>
or
rcli g m <ModuleName>
```

Ensure that the `rcli-settings.json` file is present in the root directory of your project.
This file contains the necessary configuration for the CLI to generate modules correctly.

### 🛠 `rcli-settings.json`
```
{
  "moduleName": "Customer",
  "options": {
    "fields": [
      {
        "name": "name",
        "type": "string",
        "required": true
      },
      {
        "name": "email",
        "type": "string",
        "required": true
      },
      {
        "name": "phone_number",
        "type": "string",
        "required": false
      },
      {
        "name": "status",
        "type": "boolean",
        "required": false
      }
    ]
  }
}
```

## Example
```bash
rcli g m Customer
```
This command will create a new `Customer` module with the following structure:

```
src/
  features/
    users/
      customer-form.tsx
      customer-table.tsx
      customer-table-columns.tsx
  hooks/
    useCustomers.ts  
  models/
    customer-model.ts
  pages/
    customers/
      index.jsx
      create.jsx
      edit.jsx
  services/
    customers-service.ts
``` 

It will also update the following files:
- `src/routes/routes.tsx` to include the new routes for customers
- `src/services/core/base-service.ts` to include the new service tags
- `src/utils/constants/api-end-points.ts` to include the new api end points

### Example

### Routes: `src/routes/routes.tsx`
```
{
  path: 'customers',
  breadcrumb: 'Customers',
  component: '',
  exact: true,
  children: [
    {
      path: '',
      breadcrumb: 'Customers',
      component: Customers,
      exact: true
    },
    {
      path: 'create',
      breadcrumb: 'Create Customer',
      component: CustomerCreate,
      exact: true
    },
    {
      path: ':id',
      breadcrumb: 'Edit Customer',
      component: CustomerEdit,
      exact: true
    }
  ]
}
```

### Service Tags: `src/services/core/base-service.ts`
```
const baseService = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReAuth,
  keepUnusedDataFor: 120,
  tagTypes: [
    ...,
    'customers',
    'customer'
  ],
  endpoints: () => ({}),
});
```

### API End Points: `src/utils/constants/api-end-points.ts`
```
export const API_END_POINTS = {
  ...,
  customers: '/api/v1/customers',
};
```
   
        