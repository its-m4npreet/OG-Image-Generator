# Admin Template Management System

## Overview

The Admin Template Management System allows administrators to create, manage, and distribute reusable OG image templates throughout the application.

## Features

- **Admin-Only Access**: Only users with `admin` role can create, edit, and delete templates
- **Multiple Format Support**: Store templates as HTML/CSS or React components
- **Template Management UI**: Complete CRUD interface at `/admin/templates`
- **Template Display**: Available templates shown in the Editor's template panel
- **Database Storage**: Templates stored securely in PostgreSQL

## How It Works

### For Admins

#### 1. Access the Templates Manager
Navigate to `/admin/templates` (requires admin role)

#### 2. Create a New Template

Click **"New Template"** button and fill in:

- **Template Name**: Unique identifier for your template
- **Description**: Short description of the template's style/purpose
- **Thumbnail URL**: URL to preview image (optional)
- **HTML Template**: Complete HTML/CSS code for the template
- **React Component**: Optional React/JSX component code
- **Metadata**: Custom JSON data for template configuration

#### 3. Template Code Format

**HTML Template Example:**
```html
<div style="
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 60px;
  font-family: 'Inter', sans-serif;
">
  <div style="text-align: center; color: white;">
    <h1 style="font-size: 48px; margin: 0; font-weight: bold;">{{title}}</h1>
    <p style="font-size: 24px; margin-top: 20px; opacity: 0.9;">{{subtitle}}</p>
  </div>
</div>
```

**React Component Example:**
```jsx
export default function MyTemplate({ title, subtitle, author }) {
  return (
    <div style={{
      width: '100%',
      height: '100%',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'Inter, sans-serif',
    }}>
      <div style={{ textAlign: 'center', color: 'white' }}>
        <h1 style={{ fontSize: '48px', margin: 0 }}>{title}</h1>
        <p style={{ fontSize: '24px', marginTop: 20, opacity: 0.9 }}>{subtitle}</p>
      </div>
    </div>
  );
}
```

#### 4. Edit Templates
Click **"Edit"** on any template to modify its content

#### 5. Delete Templates
Click **"Delete"** to remove a template (with confirmation)

### For Regular Users

1. Open the Editor
2. Look for the **"Templates"** section in the left panel
3. Available templates are listed with their names and descriptions
4. Click on a template to see more details (future: apply template functionality)

## Database Schema

### Templates Table

```sql
CREATE TABLE templates (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  thumbnail_url TEXT,
  html_template TEXT,
  react_component TEXT,
  metadata JSONB DEFAULT '{}',
  created_by TEXT NOT NULL REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  is_active BOOLEAN DEFAULT true
);
```

### Users Table (Updated)

```sql
ALTER TABLE users ADD COLUMN role TEXT DEFAULT 'user';
-- role values: 'user' (default) or 'admin'
```

## API Endpoints

### Get All Templates
```
GET /api/templates
```
Returns all active templates (public endpoint)

### Get Template by ID
```
GET /api/templates/:id
```
Returns a specific template

### Create Template (Admin Only)
```
POST /api/templates
```
Required body:
```json
{
  "name": "Template Name",
  "description": "Template description",
  "thumbnail_url": "https://...",
  "html_template": "<div>...</div>",
  "react_component": "function...",
  "metadata": {}
}
```

### Update Template (Admin Only)
```
PUT /api/templates/:id
```
Partial updates allowed

### Delete Template (Admin Only)
```
DELETE /api/templates/:id
```

## Authentication & Authorization

- **Admin Check**: Done at API level using NextAuth sessions
- **Role Verification**: Each API endpoint verifies user role in database
- **Ownership**: Admin can only modify their own templates
- **Public Access**: Regular users can view available templates via API

## Setting Up Admin Users

To make a user an admin, update their role in the database:

```sql
UPDATE users SET role = 'admin' WHERE email = 'admin@example.com';
```

## Future Enhancements

- [ ] Template preview in editor
- [ ] Click to apply template functionality
- [ ] Template sharing/permissions
- [ ] Template versioning
- [ ] Export/import templates
- [ ] Template categories/tags
- [ ] Template ratings/reviews

## Troubleshooting

### Templates not showing
- Verify admin role: `SELECT email, role FROM users;`
- Check if templates exist: `SELECT COUNT(*) FROM templates WHERE is_active = true;`
- Check browser console for API errors

### Permission denied errors
- Ensure user role is set to 'admin'
- Clear browser cache and re-login
- Check NextAuth session validity

### Template code not rendering
- Verify HTML/CSS is valid
- Check browser DevTools for parsing errors
- Test HTML independently before uploading
