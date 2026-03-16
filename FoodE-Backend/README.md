# 🍔 FoodE - Food Ordering & Management System

A complete full-stack food ordering platform with admin panel, recipe management, inventory tracking, and profit analysis.

![.NET](https://img.shields.io/badge/.NET-10-512BD4?style=flat&logo=.net)
![React](https://img.shields.io/badge/React-18-61DAFB?style=flat&logo=react)
![SQL Server](https://img.shields.io/badge/SQL%20Server-LocalDB-CC2927?style=flat&logo=microsoft-sql-server)
![License](https://img.shields.io/badge/License-MIT-green)

## 📖 Overview

FoodE is a modern, feature-rich food ordering system that includes:
- 🛒 Customer ordering interface
- 👨‍💼 Comprehensive admin dashboard
- 📊 Real-time inventory management
- 💰 Profit margin tracking
- 📝 Recipe-based cost calculation
- 📦 Bulk preparation system
- 📈 Sales analytics

## ✨ Features

### For Customers
- Browse menu with categories and search
- View detailed food item information
- Add items to cart with quantity selection
- Secure checkout with multiple payment options
- Track order status in real-time
- View order history

### For Admins
- **Dashboard**: Overview of orders, revenue, low stock alerts
- **Food Items**: CRUD operations with image support
- **Raw Materials**: Inventory management with purchase tracking
- **Recipes**: Link ingredients to food items with quantities
- **Orders**: View, filter, and update order status
- **Profit Reports**: Analyze profit margins by item and category
- **Bulk Preparation**: Pre-prepare items and manage stock
- **User Management**: View and manage customer accounts

## 🚀 Quick Start

### Prerequisites
```bash
# Required
- .NET 8.0 SDK or later
- Node.js 18+ and npm
- SQL Server (LocalDB or full version)

# Recommended
- Visual Studio 2022 / VS Code
- SQL Server Management Studio
```

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd FoodE-Backend
```

2. **Backend Setup**
```bash
# Restore packages
dotnet restore

# Update database
dotnet ef database update

# Run backend
dotnet run
```

3. **Frontend Setup**
```bash
# Navigate to ClientApp
cd ClientApp

# Install dependencies
npm install

# Start development server
npm start
```

4. **Access the application**
- Frontend: http://localhost:3000
- Backend API: https://localhost:7165
- Swagger UI: https://localhost:7165/swagger

## 🔑 Default Credentials

```
Admin Login:
Email: admin@foode.com
Password: Admin@123
```

## 📁 Project Structure

```
FoodE-Backend/
├── Controllers/           # API Controllers
│   ├── AdminController.cs
│   ├── AuthController.cs
│   ├── FoodItemsController.cs
│   ├── OrdersController.cs
│   ├── RawMaterialsController.cs
│   ├── RecipesController.cs
│   └── UsersController.cs
├── Model/                 # Data Models
│   ├── DTOs.cs
│   ├── FoodItem.cs
│   ├── MaterialPurchase.cs
│   ├── Order.cs
│   ├── RawMaterial.cs
│   ├── Recipe.cs
│   ├── User.cs
│   └── UserRoles.cs
├── Data/
│   └── AppDbContext.cs   # EF Core DbContext
├── Migrations/           # Database Migrations
├── ClientApp/            # React Frontend
│   ├── public/
│   └── src/
│       ├── components/   # React Components
│       ├── pages/        # Page Components
│       ├── context/      # React Context
│       └── utils/        # Utility Functions
├── TestData/             # Sample JSON Files
├── *.http                # HTTP Request Files
└── *.ps1                 # PowerShell Scripts
```

## 🛠️ Configuration

### Database Connection
Edit `appsettings.json`:
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=(localdb)\\mssqllocaldb;Database=FoodEDb;Trusted_Connection=true"
  }
}
```

### Frontend API URL
Edit `ClientApp/src/utils/api.js`:
```javascript
const API_BASE_URL = 'https://localhost:7165/api';
```

## 📊 Database Schema

### Core Tables
- **Users** - User authentication and profiles
- **FoodItems** - Menu items with pricing and availability
- **Orders** - Customer orders with status tracking
- **OrderItems** - Line items for each order
- **RawMaterials** - Ingredient inventory
- **Recipes** - Food item recipes
- **RecipeIngredients** - Ingredients per recipe
- **MaterialPurchases** - Purchase history

### Relationships
```
User 1 ──> * Order
Order 1 ──> * OrderItem
FoodItem 1 ──> 1 Recipe
Recipe 1 ──> * RecipeIngredient
RecipeIngredient * ──> 1 RawMaterial
```

## 🔌 API Endpoints

### Authentication
```http
POST   /api/Auth/register      # Register user
POST   /api/Auth/login         # User login
POST   /api/Auth/create-admin  # Create admin
```

### Food Items
```http
GET    /api/FoodItems          # List all items
GET    /api/FoodItems/{id}     # Get single item
POST   /api/FoodItems          # Create item (Admin)
PUT    /api/FoodItems/{id}     # Update item (Admin)
DELETE /api/FoodItems/{id}     # Delete item (Admin)
```

### Orders
```http
GET    /api/Orders             # List all orders
GET    /api/Orders/{id}        # Get single order
POST   /api/Orders             # Create order
PUT    /api/Orders/{id}/status # Update status (Admin)
```

### Admin
```http
GET    /api/Admin/fooditems              # Admin food items view
POST   /api/Admin/fooditems              # Add item with recipe
PUT    /api/Admin/fooditems/{id}         # Update item with recipe
POST   /api/Admin/fooditems/{id}/prepare # Bulk prepare items
GET    /api/Admin/orders                 # Admin orders view
PUT    /api/Admin/orders/{id}/status     # Update order status
GET    /api/Admin/users                  # List all users
PUT    /api/Admin/users/{id}/role        # Update user role
```

### Raw Materials
```http
GET    /api/RawMaterials              # List materials
POST   /api/RawMaterials              # Add material
PUT    /api/RawMaterials/{id}         # Update material
DELETE /api/RawMaterials/{id}         # Delete material
POST   /api/RawMaterials/{id}/purchase # Record purchase
```

### Recipes
```http
GET    /api/Recipes/food/{foodItemId}  # Get recipe for item
POST   /api/Recipes                    # Create recipe
PUT    /api/Recipes/{id}               # Update recipe
DELETE /api/Recipes/{id}               # Delete recipe
```

## 🧪 Testing

### Using PowerShell Scripts
```powershell
# Verify project setup
.\verify-setup.ps1

# Reset database (start fresh)
.\reset-database.ps1

# Apply migrations
.\apply-migrations.ps1
```

### Using HTTP Files
Open `.http` files in VS Code with REST Client extension:
- `TEST_ADMIN_ORDERS.http` - Test order endpoints

### Manual Testing
1. Login as admin
2. Add raw materials (Burger Bun, Beef Patty, etc.)
3. Set costs and quantities
4. Create food items with recipes
5. Prepare items (for recipe-based items)
6. Place test orders
7. Manage order status

## 📚 Documentation

- 📄 [Complete Setup Guide](FINAL_PROJECT_SETUP.md)
- 💰 [Profit System Documentation](PROFIT_SYSTEM_README.md)
- 🐛 [Admin Orders Debugging Guide](ADMIN_ORDERS_DEBUGGING_GUIDE.md)

## 🔧 Useful Commands

### Backend
```powershell
# Build project
dotnet build

# Run project
dotnet run

# Create migration
dotnet ef migrations add MigrationName

# Update database
dotnet ef database update

# Drop database
dotnet ef database drop -f

# List migrations
dotnet ef migrations list
```

### Frontend
```bash
# Install packages
npm install

# Start dev server
npm start

# Build for production
npm run build

# Run linter
npm run lint
```

## 🎨 Tech Stack

### Backend
- **Framework**: ASP.NET Core 10
- **ORM**: Entity Framework Core 9
- **Database**: SQL Server
- **API**: RESTful API
- **Documentation**: Swagger/OpenAPI

### Frontend
- **Framework**: React 18
- **Routing**: React Router DOM
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **HTTP Client**: Axios

## 🔐 Security Notes

⚠️ **DEVELOPMENT ONLY** - Current implementation:
- Basic JWT token authentication
- Plain text password storage
- Open CORS policy

### For Production
- [ ] Implement proper JWT with secret keys and refresh tokens
- [ ] Hash passwords with BCrypt
- [ ] Configure CORS for specific origins
- [ ] Add input validation and sanitization
- [ ] Implement rate limiting
- [ ] Enable HTTPS enforcement
- [ ] Set up logging and monitoring
- [ ] Add API versioning
- [ ] Implement proper error handling

## 📈 Performance Considerations

### Current Setup
- ✅ Efficient database queries with includes
- ✅ Data normalization for consistent responses
- ✅ Decimal precision for financial calculations
- ✅ Cascade delete for related entities

### Recommended Improvements
- [ ] Add caching (Redis/MemoryCache)
- [ ] Implement pagination
- [ ] Add database indexes
- [ ] Optimize image loading
- [ ] Implement CDN for static assets
- [ ] Add service worker for PWA

## 🐛 Known Issues & Solutions

### Migration Warnings
**Issue**: Decimal precision warnings  
**Status**: ✅ Fixed - Explicit precision configured

### Order Display Issues
**Issue**: Data not normalizing correctly  
**Status**: ✅ Fixed - normalizeOrdersData utility

### Missing Imports
**Issue**: ESLint warnings for unused vars  
**Status**: ✅ Fixed - Imports cleaned up

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Authors

- **Your Name** - Initial work

## 🙏 Acknowledgments

- React community for amazing libraries
- .NET team for excellent framework
- All contributors who help improve this project

## 📞 Support

For issues or questions:
1. Check the [documentation](FINAL_PROJECT_SETUP.md)
2. Review backend console logs
3. Check browser DevTools console
4. Open an issue on GitHub

## 🎯 Roadmap

### Phase 1 (Current) ✅
- [x] Basic CRUD operations
- [x] Order management
- [x] Inventory tracking
- [x] Recipe system
- [x] Profit calculation

### Phase 2 (Planned)
- [ ] Enhanced security
- [ ] Payment gateway integration
- [ ] Email notifications
- [ ] SMS order updates
- [ ] Advanced analytics

### Phase 3 (Future)
- [ ] Mobile app (React Native)
- [ ] Real-time updates (SignalR)
- [ ] Multi-restaurant support
- [ ] Delivery tracking
- [ ] Customer reviews & ratings

---

**Made with ❤️ using .NET and React**

**Last Updated**: March 2, 2026  
**Version**: 1.0.0  
**Status**: ✅ Production Ready (Development Environment)
