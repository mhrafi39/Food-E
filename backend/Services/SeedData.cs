using backend.Data;
using backend.Models;

namespace backend.Services;

public static class SeedData
{
    public static void Initialize(AppDbContext context)
    {
        // Check if we already have data
        if (context.FoodItems.Any())
        {
            return; // DB has been seeded
        }

        // Create admin user
        var adminUser = new User
        {
            Name = "Admin",
            Email = "mehedihasanrafi39@gmail.com",
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("Blankpassw0rd"),
            Role = "Admin",
            PhoneNumber = "01XXXXXXXXX",
            Address = "Admin Address",
            CreatedAt = DateTime.UtcNow
        };
        context.Users.Add(adminUser);
        context.SaveChanges();

        var foodItems = new List<FoodItem>
        {
            // Burgers
            new FoodItem
            {
                Name = "Signature Beef Burger",
                Description = "Premium beef patty with special sauce, lettuce, tomato",
                Price = 350m,
                Category = "Burgers",
                IsAvailable = true,
                ImageUrl = "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&q=80"
            },
            new FoodItem
            {
                Name = "Crispy Chicken Burger",
                Description = "Crispy fried chicken with mayo and fresh vegetables",
                Price = 320m,
                Category = "Burgers",
                IsAvailable = true,
                ImageUrl = "https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=800&q=80"
            },
            new FoodItem
            {
                Name = "Double Cheese Burger",
                Description = "Two beef patties with double cheese and special sauce",
                Price = 420m,
                Category = "Burgers",
                IsAvailable = true,
                ImageUrl = "https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=800&q=80"
            },
            new FoodItem
            {
                Name = "Double Decker Burger",
                Description = "Two beef patties, cheese, bacon, special sauce",
                Price = 450m,
                Category = "Burgers",
                IsAvailable = true,
                ImageUrl = "https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=800&q=80"
            },
            new FoodItem
            {
                Name = "Spicy Chicken Burger",
                Description = "Hot and spicy fried chicken with jalapeños",
                Price = 340m,
                Category = "Burgers",
                IsAvailable = true,
                ImageUrl = "https://images.unsplash.com/photo-1619740455993-5e4b21f6c1bf?w=800&q=80"
            },
            new FoodItem
            {
                Name = "Grilled Chicken Burger",
                Description = "Grilled chicken breast with honey mustard sauce",
                Price = 330m,
                Category = "Burgers",
                IsAvailable = true,
                ImageUrl = "https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=800&q=80"
            },
            
            // Fries
            new FoodItem
            {
                Name = "Classic French Fries",
                Description = "Crispy golden french fries",
                Price = 120m,
                Category = "Fries",
                IsAvailable = true,
                ImageUrl = "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=800&q=80"
            },
            new FoodItem
            {
                Name = "Cheese Loaded Fries",
                Description = "Golden fries with melted cheddar cheese sauce",
                Price = 180m,
                Category = "Fries",
                IsAvailable = true,
                ImageUrl = "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=800&q=80"
            },
            new FoodItem
            {
                Name = "Spicy Masala Fries",
                Description = "Crispy fries tossed with special masala seasoning",
                Price = 150m,
                Category = "Fries",
                IsAvailable = true,
                ImageUrl = "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=800&q=80"
            },
            new FoodItem
            {
                Name = "Peri Peri Fries",
                Description = "Fries with tangy peri peri seasoning",
                Price = 140m,
                Category = "Fries",
                IsAvailable = true,
                ImageUrl = "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=800&q=80"
            },
            
            // Drinks
            new FoodItem
            {
                Name = "Coca Cola",
                Description = "Classic Coke - 330ml can",
                Price = 50m,
                Category = "Drinks",
                IsAvailable = true,
                ImageUrl = "https://images.unsplash.com/photo-1554866585-cd94860890b7?w=800&q=80"
            },
            new FoodItem
            {
                Name = "Sprite",
                Description = "Lemon-lime flavored soda - 330ml",
                Price = 50m,
                Category = "Drinks",
                IsAvailable = true,
                ImageUrl = "https://images.unsplash.com/photo-1625772299848-391b6a87d7b3?w=800&q=80"
            },
            new FoodItem
            {
                Name = "Fanta",
                Description = "Orange flavored soda - 330ml",
                Price = 50m,
                Category = "Drinks",
                IsAvailable = true,
                ImageUrl = "https://images.unsplash.com/photo-1624517452488-04869289c4ca?w=800&q=80"
            },
            new FoodItem
            {
                Name = "Fresh Lemonade",
                Description = "Freshly squeezed lemon with mint",
                Price = 100m,
                Category = "Drinks",
                IsAvailable = true,
                ImageUrl = "https://images.unsplash.com/photo-1523677011781-c91d1bbe2f9c?w=800&q=80"
            },
            new FoodItem
            {
                Name = "Iced Coffee",
                Description = "Cold brew coffee with ice",
                Price = 150m,
                Category = "Drinks",
                IsAvailable = true,
                ImageUrl = "https://images.unsplash.com/photo-1517487881594-2787fef5ebf7?w=800&q=80"
            },
            new FoodItem
            {
                Name = "Mango Lassi",
                Description = "Traditional mango yogurt drink",
                Price = 120m,
                Category = "Drinks",
                IsAvailable = true,
                ImageUrl = "https://images.unsplash.com/photo-1623065422902-30a2d299bbe4?w=800&q=80"
            },
            
            // Combo Deals
            new FoodItem
            {
                Name = "Mega Combo",
                Description = "2 Burgers + 2 Fries + 2 Drinks",
                Price = 650m,
                Category = "Deals",
                IsAvailable = true,
                IsDeal = true,
                DiscountPercentage = 23.5m,
                ImageUrl = "https://images.unsplash.com/photo-1513185158878-8d8c2a2a3da3?w=800&q=80"
            },
            new FoodItem
            {
                Name = "Family Pack",
                Description = "4 Burgers + 4 Fries + 4 Drinks",
                Price = 1350m,
                Category = "Deals",
                IsAvailable = true,
                IsDeal = true,
                DiscountPercentage = 15.6m,
                ImageUrl = "https://images.unsplash.com/photo-1513185158878-8d8c2a2a3da3?w=800&q=80"
            },
            new FoodItem
            {
                Name = "Solo Meal",
                Description = "1 Burger + 1 Fries + 1 Drink",
                Price = 380m,
                Category = "Deals",
                IsAvailable = true,
                IsDeal = true,
                DiscountPercentage = 15.6m,
                ImageUrl = "https://images.unsplash.com/photo-1513185158878-8d8c2a2a3da3?w=800&q=80"
            },
            new FoodItem
            {
                Name = "Double Trouble",
                Description = "2 Double Decker Burgers + 2 Cheese Fries",
                Price = 950m,
                Category = "Deals",
                IsAvailable = true,
                IsDeal = true,
                DiscountPercentage = 13.6m,
                ImageUrl = "https://images.unsplash.com/photo-1513185158878-8d8c2a2a3da3?w=800&q=80"
            },
            new FoodItem
            {
                Name = "Chicken Feast",
                Description = "3 Chicken Burgers + 3 Fries",
                Price = 1000m,
                Category = "Deals",
                IsAvailable = true,
                IsDeal = true,
                DiscountPercentage = 16.7m,
                ImageUrl = "https://images.unsplash.com/photo-1513185158878-8d8c2a2a3da3?w=800&q=80"
            },
            new FoodItem
            {
                Name = "Weekend Special",
                Description = "2 Premium Burgers + 2 Masala Fries + 2 Lassi",
                Price = 999m,
                Category = "Deals",
                IsAvailable = true,
                IsDeal = true,
                DiscountPercentage = 16.8m,
                ImageUrl = "https://images.unsplash.com/photo-1513185158878-8d8c2a2a3da3?w=800&q=80"
            }
        };

        context.FoodItems.AddRange(foodItems);
        context.SaveChanges();
    }
}
