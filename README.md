# Special Academy - Admin Dashboard

A modern, responsive React admin dashboard built with Vite for managing the Special Academy learning platform. This dashboard provides comprehensive CRUD operations for users, categories, subcategories, and content items with a beautiful, professional UI.

## 🚀 Features

### Authentication & Authorization
- **Secure Login**: Email and password authentication
- **JWT Token Management**: Stored in localStorage with automatic refresh
- **Admin-Only Access**: Only users with `admin` role can access the dashboard
- **Protected Routes**: All dashboard routes require authentication
- **User Profile Management**: View and edit admin profile information

### User Interface
- **Modern Design**: Clean, premium-looking UI with Tailwind CSS
- **Responsive Layout**: Works perfectly on desktop, tablet, and mobile devices
- **Dark Mode Support**: Toggle between light and dark themes
- **Sidebar Navigation**: Collapsible sidebar with intuitive navigation
- **Toast Notifications**: Success/error messages for all actions
- **Loading States**: Smooth loading indicators throughout the app

### CRUD Operations
- **Users Management**: Create, read, update, delete user accounts
- **Categories**: Organize content with main categories
- **Subcategories**: Create subcategories within parent categories
- **Items**: Manage content items (PDF files and YouTube videos)

### Advanced Features
- **Search & Filter**: Real-time search across all data tables
- **Form Validation**: Comprehensive validation using React Hook Form + Yup
- **File Upload**: Drag & drop file upload for PDF items
- **Conditional Fields**: Dynamic form fields based on item type
- **Responsive Tables**: Mobile-friendly data tables with actions
- **Error Handling**: Graceful error handling with user-friendly messages

## 🛠 Tech Stack

- **Frontend Framework**: React 19.1.0
- **Build Tool**: Vite 6.3.5
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Icons**: Lucide React
- **Routing**: React Router v6
- **State Management**: React Context API
- **Form Handling**: React Hook Form
- **Validation**: Yup
- **HTTP Client**: Axios
- **Notifications**: React Hot Toast
- **Package Manager**: pnpm

## 📁 Project Structure

```
special-academy-admin/
├── public/                 # Static assets
├── src/
│   ├── components/         # Reusable components
│   │   ├── ui/            # shadcn/ui components
│   │   ├── Layout.jsx     # Main layout with sidebar
│   │   ├── ProtectedRoute.jsx
│   │   ├── FileUpload.jsx
│   │   ├── LoadingSpinner.jsx
│   │   └── Pagination.jsx
│   ├── pages/             # Page components
│   │   ├── Login.jsx      # Authentication page
│   │   ├── Dashboard.jsx  # Main dashboard
│   │   ├── Users.jsx      # User management
│   │   ├── Categories.jsx # Category management
│   │   ├── Subcategories.jsx
│   │   ├── Items.jsx      # Content items
│   │   └── Profile.jsx    # User profile
│   ├── context/           # React contexts
│   │   └── AuthContext.jsx
│   ├── services/          # API services
│   │   └── api.js         # Axios configuration
│   ├── utils/             # Utility functions
│   │   ├── validationSchemas.js
│   │   └── helpers.js
│   ├── App.jsx           # Main app component
│   ├── main.jsx          # Entry point
│   └── App.css           # Global styles
├── package.json
├── vite.config.js
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- pnpm (recommended) or npm

### Installation

1. **Extract the project files**
   ```bash
   unzip special-academy-admin-dashboard.zip
   cd special-academy-admin
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   # or
   npm install
   ```

3. **Start the development server**
   ```bash
   pnpm run dev
   # or
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

### Build for Production

```bash
pnpm run build
# or
npm run build
```

The built files will be in the `dist/` directory.

## 🔧 Configuration

### API Configuration
The dashboard is configured to connect to the backend API at:
```
https://special-academy-server.vercel.app/api
```

To change the API endpoint, update the `API_BASE_URL` in `src/services/api.js`:

```javascript
const API_BASE_URL = 'your-api-endpoint';
```

### Environment Variables
Create a `.env` file in the root directory for environment-specific configuration:

```env
VITE_API_BASE_URL=https://your-api-endpoint.com/api
```

## 📱 Usage

### Login
1. Navigate to the application
2. Enter admin credentials:
   - Email: Your admin email
   - Password: Your admin password
3. Click "Sign In"

**Note**: Only users with `admin` role can access the dashboard.

### Navigation
- **Dashboard**: Overview with statistics and quick actions
- **Users**: Manage user accounts (CRUD operations)
- **Categories**: Create and manage content categories
- **Subcategories**: Organize content with subcategories
- **Items**: Manage content items (PDFs and YouTube videos)
- **Profile**: View and edit your admin profile

### Managing Content

#### Users
- Create new users with email, password, and role
- Edit existing user information
- Delete users (with confirmation)
- Search users by name or email

#### Categories
- Create categories with name and description
- Edit category information
- Delete categories (cascades to subcategories and items)

#### Subcategories
- Create subcategories within parent categories
- Edit subcategory details
- Delete subcategories (cascades to items)

#### Items
- Create content items with two types:
  - **PDF**: Upload PDF files or provide file paths
  - **YouTube**: Add YouTube video URLs
- Edit item information and content
- Delete items with confirmation
- Search items by title, description, or category

## 🎨 UI Features

### Responsive Design
- Mobile-first approach
- Collapsible sidebar on mobile
- Touch-friendly interface
- Responsive tables and forms

### Dark Mode
- Toggle between light and dark themes
- Persistent theme preference
- Smooth transitions

### Accessibility
- Keyboard navigation support
- Screen reader friendly
- High contrast ratios
- Focus indicators

## 🔒 Security Features

- JWT token authentication
- Automatic token refresh
- Protected routes
- Role-based access control
- Input validation and sanitization
- CORS handling

## 🐛 Troubleshooting

### Common Issues

1. **Blank page on load**
   - Check browser console for errors
   - Ensure all dependencies are installed
   - Verify API endpoint is accessible

2. **Login fails**
   - Verify API endpoint is correct
   - Check network connectivity
   - Ensure user has admin role

3. **Build errors**
   - Clear node_modules and reinstall
   - Check Node.js version compatibility
   - Verify all imports are correct

### Development Tips

- Use browser dev tools for debugging
- Check network tab for API call issues
- Enable React Developer Tools for component inspection
- Use the console for error messages

## 📄 API Endpoints

The dashboard expects the following API endpoints:

```
POST /api/auth/login          # User authentication
GET  /api/users              # Get all users
POST /api/users              # Create user
PUT  /api/users/:id          # Update user
DELETE /api/users/:id        # Delete user

GET  /api/categories         # Get all categories
POST /api/categories         # Create category
PUT  /api/categories/:id     # Update category
DELETE /api/categories/:id   # Delete category

GET  /api/subcategories      # Get all subcategories
POST /api/subcategories      # Create subcategory
PUT  /api/subcategories/:id  # Update subcategory
DELETE /api/subcategories/:id # Delete subcategory

GET  /api/items              # Get all items
POST /api/items              # Create item
PUT  /api/items/:id          # Update item
DELETE /api/items/:id        # Delete item
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Check the troubleshooting section
- Review the browser console for errors
- Ensure API connectivity
- Verify user permissions

---

**Built with ❤️ for Special Academy**

