# Profit Tracking System Implementation

## Overview
I've implemented a complete profit calculation system for your food delivery application. The system tracks:
- Raw materials and their costs
- Recipes (ingredients needed for each food item)
- Purchase history for materials
- Daily/weekly profit calculations
- Material usage statistics

## What Was Added

### Backend Models
1. **RawMaterial.cs** - Tracks raw materials (buns, patties, sauce, etc.)
   - Properties: Name, Unit, CostPerUnit, CurrentStock, MinimumStock
2. **Recipe.cs & RecipeIngredient.cs** - Links food items to raw materials
3. **MaterialPurchase.cs** - Records material purchases with supplier info
4. **Updated FoodItem.cs** - Added: IsDirectPurchase, DirectPurchaseCost, ProfitMargin

### Backend Controllers
1. **RawMaterialsController.cs** - CRUD for raw materials + purchase recording
2. **RecipesController.cs** - CRUD for recipes
3. **AdminController.cs** - Enhanced with 3 new endpoints:
   - `/Admin/profit/daily` - Daily profit breakdown
   - `/Admin/profit/weekly` - 7-day profit trend
   - `/Admin/profit/materials-usage` - Material usage report

### Frontend Pages
1. **ManageMaterials.jsx** - Full UI for:
   - View all raw materials with stock levels
   - Add/edit materials
   - Record purchases (updates stock + cost)
   - Low stock alerts
2. **ProfitReport.jsx** - Comprehensive profit dashboard:
   - Date selector for daily reports
   - Profit/Revenue/Cost stats
   - 7-day trend chart
   - Item-wise profit breakdown
   - Materials usage table

### Database Seeding
The system comes pre-seeded with:
- **5 Food Items**: Burger, Chicken, French Fries, Beef Steak, Mojo
- **15 Raw Materials**: Buns, Patties, Cheese, Lettuce, Tomato, Sauce, Chicken, Flour, Spices, Oil, Potato, Salt, Beef Steak Cut, Pepper, Butter
- **4 Recipes** with cost calculations:
  - Burger: ~51 taka cost → 150 selling → 99 profit
  - Chicken: ~65 taka cost → 120 selling → 55 profit
  - French Fries: ~20 taka cost → 80 selling → 60 profit
  - Beef Steak: ~95 taka cost → 250 selling → 155 profit
  - Mojo: 20 taka cost → 30 selling → 10 profit (direct purchase)

## How It Works

### For Items with Recipes (Burger, Chicken, Fries, Steak):
1. Recipe defines ingredients needed per serving
2. Cost = Sum of (Ingredient Quantity × Cost Per Unit)
3. Profit = Selling Price - Cost
4. When order is placed, system calculates exact cost based on current material prices

### For Direct Purchase Items (Mojo):
1. Admin sets DirectPurchaseCost = 20 taka
2. Admin sets ProfitMargin = 10 taka
3. Selling Price = 30 taka
4. Profit is fixed at 10 taka per item

### Dashboard Shows:
- Today's total profit (Revenue - Cost)
- Item-wise breakdown (which items are most profitable)
- Materials used today and their costs
- Low stock warnings

## Next Steps to Test

### 1. Apply Database Migration
```bash
cd FoodE-Backend
dotnet ef migrations add AddProfitTracking
dotnet ef database update
```

### 2. Run the Application
```bash
dotnet run
```

### 3. Login as Admin
- Email: admin@foode.com
- Password: Admin@123

### 4. Navigate to New Pages
- **Raw Materials**: http://localhost:5173/admin/materials
- **Profit Report**: http://localhost:5173/admin/profit

### 5. Test Scenarios

**Scenario 1: Record a Purchase**
1. Go to Materials page
2. Find "Burger Bun" (currently 100 in stock, costs ৳5 each)
3. Click "Purchase"
4. Enter: Quantity = 50, Cost = 5, Supplier = "Local Bakery"
5. Stock should update to 150

**Scenario 2: Check Profit**
1. Create a few test orders (place orders for burgers, chicken, etc.)
2. Go to Profit Report page
3. See today's profit calculation:
   - If 4 burgers sold: Revenue = 600, Cost = 204, Profit = 396
4. View material usage (4 buns, 4 patties, etc.)

**Scenario 3: Low Stock Alert**
1. Go to Materials and edit "Burger Bun"
2. Set Current Stock = 3, Minimum Stock = 10
3. Dashboard will show yellow warning
4. Restock to fix the warning

## API Endpoints Added

### Raw Materials
- GET `/api/RawMaterials` - List all
- POST `/api/RawMaterials` - Create
- PUT `/api/RawMaterials/{id}` - Update
- DELETE `/api/RawMaterials/{id}` - Soft delete
- POST `/api/RawMaterials/purchase` - Record purchase (updates stock)

### Recipes
- GET `/api/Recipes` - List all with costs
- GET `/api/Recipes/fooditem/{id}` - Get recipe for food item
- POST `/api/Recipes` - Create recipe
- PUT `/api/Recipes/{id}` - Update recipe
- DELETE `/api/Recipes/{id}` - Delete recipe

### Profit Analytics
- GET `/api/Admin/profit/daily?date=2024-01-15` - Daily profit report
- GET `/api/Admin/profit/weekly` - 7-day trend
- GET `/api/Admin/profit/materials-usage?startDate=...&endDate=...` - Usage report

## Example Profit Calculation

**Example: Sell 4 Burgers Today**

Materials Used:
- 4 Buns × ৳5 = ৳20
- 4 Patties × ৳25 = ৳100
- 8 Cheese × ৳8 = ৳64
- 4 Lettuce × ৳2 = ৳8
- 4 Tomato × ৳3 = ৳12
- 80ml Sauce × ৳0.5 = ৳40
**Total Cost: ৳204**

Revenue:
- 4 Burgers × ৳150 = ৳600

**Profit: ৳600 - ৳204 = ৳396 (66% margin)**

## Notes

- ESLint warnings (unused imports, function hoisting) are non-blocking
- All profit calculations happen dynamically based on current material costs
- Stock automatically tracked (though stock deduction on order placement needs to be implemented separately if desired)
- The system supports changing material costs over time - new purchases update the cost

## Future Enhancements

1. Auto-deduct stock when orders are placed
2. Purchase order management
3. Supplier management
4. Monthly/yearly profit reports
5. Export reports to PDF/Excel
6. Inventory alerts via email/SMS
7. Recipe versioning (track cost changes over time)
