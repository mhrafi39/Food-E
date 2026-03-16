using Microsoft.EntityFrameworkCore;
using FoodE_Backend.Model;

namespace FoodE_Backend.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        public DbSet<User> Users { get; set; }
        public DbSet<FoodItem> FoodItems { get; set; }
        public DbSet<Order> Orders { get; set; }
        public DbSet<OrderItem> OrderItems { get; set; }
        public DbSet<RawMaterial> RawMaterials { get; set; }
        public DbSet<Recipe> Recipes { get; set; }
        public DbSet<RecipeIngredient> RecipeIngredients { get; set; }
        public DbSet<MaterialPurchase> MaterialPurchases { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configure decimal precision for all decimal properties
            modelBuilder.Entity<Order>()
                .Property(o => o.TotalAmount)
                .HasPrecision(18, 2);

            modelBuilder.Entity<OrderItem>()
                .Property(oi => oi.Price)
                .HasPrecision(18, 2);

            modelBuilder.Entity<RawMaterial>()
                .Property(r => r.CostPerUnit)
                .HasPrecision(18, 2);

            modelBuilder.Entity<RawMaterial>()
                .Property(r => r.CurrentStock)
                .HasPrecision(18, 2);

            modelBuilder.Entity<RawMaterial>()
                .Property(r => r.MinimumStock)
                .HasPrecision(18, 2);

            modelBuilder.Entity<RecipeIngredient>()
                .Property(ri => ri.QuantityNeeded)
                .HasPrecision(18, 2);

            modelBuilder.Entity<FoodItem>()
                .Property(f => f.Price)
                .HasPrecision(18, 2);

            modelBuilder.Entity<FoodItem>()
                .Property(f => f.OriginalPrice)
                .HasPrecision(18, 2);

            modelBuilder.Entity<FoodItem>()
                .Property(f => f.DirectPurchaseCost)
                .HasPrecision(18, 2);

            modelBuilder.Entity<FoodItem>()
                .Property(f => f.ProfitMargin)
                .HasPrecision(18, 2);

            modelBuilder.Entity<MaterialPurchase>()
                .Property(mp => mp.Quantity)
                .HasPrecision(18, 2);

            modelBuilder.Entity<MaterialPurchase>()
                .Property(mp => mp.CostPerUnit)
                .HasPrecision(18, 2);

            modelBuilder.Entity<MaterialPurchase>()
                .Property(mp => mp.TotalCost)
                .HasPrecision(18, 2);

            // Configure Order-OrderItem relationship explicitly
            modelBuilder.Entity<Order>()
                .HasMany(o => o.OrderItems)
                .WithOne(oi => oi.Order)
                .HasForeignKey(oi => oi.OrderId)
                .OnDelete(DeleteBehavior.Cascade);

            // Seed admin user
            modelBuilder.Entity<User>().HasData(
                new User
                {
                    Id = 9999,
                    Name = "Admin User",
                    Email = "admin@foode.com",
                    Password = "Admin@123",
                    Role = "admin"
                }
            );

            // Seed Raw Materials (Admin will set prices and quantities)
            modelBuilder.Entity<RawMaterial>().HasData(
                // Burger Materials (Category: Burger)
                new RawMaterial { Id = 1, Name = "Burger Bun", Unit = "piece", CostPerUnit = 0, CurrentStock = 0, MinimumStock = 20, LastPurchaseDate = new DateTime(2024, 1, 1) },
                new RawMaterial { Id = 2, Name = "Beef Patty", Unit = "piece", CostPerUnit = 0, CurrentStock = 0, MinimumStock = 20, LastPurchaseDate = new DateTime(2024, 1, 1) },
                new RawMaterial { Id = 3, Name = "Cheese Slice", Unit = "piece", CostPerUnit = 0, CurrentStock = 0, MinimumStock = 30, LastPurchaseDate = new DateTime(2024, 1, 1) },
                new RawMaterial { Id = 4, Name = "Lettuce", Unit = "piece", CostPerUnit = 0, CurrentStock = 0, MinimumStock = 10, LastPurchaseDate = new DateTime(2024, 1, 1) },
                new RawMaterial { Id = 5, Name = "Tomato", Unit = "piece", CostPerUnit = 0, CurrentStock = 0, MinimumStock = 15, LastPurchaseDate = new DateTime(2024, 1, 1) },
                new RawMaterial { Id = 6, Name = "Onion", Unit = "piece", CostPerUnit = 0, CurrentStock = 0, MinimumStock = 10, LastPurchaseDate = new DateTime(2024, 1, 1) },
                new RawMaterial { Id = 7, Name = "Pickles", Unit = "piece", CostPerUnit = 0, CurrentStock = 0, MinimumStock = 20, LastPurchaseDate = new DateTime(2024, 1, 1) },
                new RawMaterial { Id = 8, Name = "Ketchup", Unit = "ml", CostPerUnit = 0, CurrentStock = 0, MinimumStock = 500, LastPurchaseDate = new DateTime(2024, 1, 1) },
                new RawMaterial { Id = 9, Name = "Mayonnaise", Unit = "ml", CostPerUnit = 0, CurrentStock = 0, MinimumStock = 500, LastPurchaseDate = new DateTime(2024, 1, 1) },

                // Chicken Fry Materials (Category: Chicken Fry)
                new RawMaterial { Id = 10, Name = "Chicken Pieces", Unit = "piece", CostPerUnit = 0, CurrentStock = 0, MinimumStock = 20, LastPurchaseDate = new DateTime(2024, 1, 1) },
                new RawMaterial { Id = 11, Name = "Flour", Unit = "gm", CostPerUnit = 0, CurrentStock = 0, MinimumStock = 1000, LastPurchaseDate = new DateTime(2024, 1, 1) },
                new RawMaterial { Id = 12, Name = "Breadcrumbs", Unit = "gm", CostPerUnit = 0, CurrentStock = 0, MinimumStock = 500, LastPurchaseDate = new DateTime(2024, 1, 1) },
                new RawMaterial { Id = 13, Name = "Eggs", Unit = "piece", CostPerUnit = 0, CurrentStock = 0, MinimumStock = 12, LastPurchaseDate = new DateTime(2024, 1, 1) },
                new RawMaterial { Id = 14, Name = "Spices Mix", Unit = "gm", CostPerUnit = 0, CurrentStock = 0, MinimumStock = 200, LastPurchaseDate = new DateTime(2024, 1, 1) },
                new RawMaterial { Id = 15, Name = "Cooking Oil", Unit = "ml", CostPerUnit = 0, CurrentStock = 0, MinimumStock = 1000, LastPurchaseDate = new DateTime(2024, 1, 1) },

                // French Fry Materials (Category: French Fry)
                new RawMaterial { Id = 16, Name = "Potato", Unit = "kg", CostPerUnit = 0, CurrentStock = 0, MinimumStock = 5, LastPurchaseDate = new DateTime(2024, 1, 1) },
                new RawMaterial { Id = 17, Name = "Salt", Unit = "gm", CostPerUnit = 0, CurrentStock = 0, MinimumStock = 500, LastPurchaseDate = new DateTime(2024, 1, 1) },
                // Oil is reused from Chicken Fry (Id = 15)

                // Noodles Materials (Category: Noodles)
                new RawMaterial { Id = 18, Name = "Noodles (Dry)", Unit = "packet", CostPerUnit = 0, CurrentStock = 0, MinimumStock = 10, LastPurchaseDate = new DateTime(2024, 1, 1) },
                new RawMaterial { Id = 19, Name = "Mixed Vegetables", Unit = "gm", CostPerUnit = 0, CurrentStock = 0, MinimumStock = 500, LastPurchaseDate = new DateTime(2024, 1, 1) },
                new RawMaterial { Id = 20, Name = "Soy Sauce", Unit = "ml", CostPerUnit = 0, CurrentStock = 0, MinimumStock = 300, LastPurchaseDate = new DateTime(2024, 1, 1) },
                new RawMaterial { Id = 21, Name = "Garlic", Unit = "gm", CostPerUnit = 0, CurrentStock = 0, MinimumStock = 100, LastPurchaseDate = new DateTime(2024, 1, 1) },
                new RawMaterial { Id = 22, Name = "Ginger", Unit = "gm", CostPerUnit = 0, CurrentStock = 0, MinimumStock = 100, LastPurchaseDate = new DateTime(2024, 1, 1) },
                new RawMaterial { Id = 23, Name = "Chili", Unit = "piece", CostPerUnit = 0, CurrentStock = 0, MinimumStock = 10, LastPurchaseDate = new DateTime(2024, 1, 1) },
                new RawMaterial { Id = 24, Name = "Spring Onion", Unit = "bunch", CostPerUnit = 0, CurrentStock = 0, MinimumStock = 5, LastPurchaseDate = new DateTime(2024, 1, 1) },
                // Oil is reused from Chicken Fry (Id = 15)

                // Mojo (Category: Mojo - Direct Purchase Item)
                new RawMaterial { Id = 25, Name = "Mojo Bottle", Unit = "bottle", CostPerUnit = 0, CurrentStock = 0, MinimumStock = 20, LastPurchaseDate = new DateTime(2024, 1, 1) }
            );

            // Seed Food Items (Admin will add recipes and system will calculate prices)
            modelBuilder.Entity<FoodItem>().HasData(
                new FoodItem 
                { 
                    Id = 1, 
                    Name = "Classic Beef Burger", 
                    Description = "Juicy beef patty with fresh vegetables and special sauce", 
                    Price = 0, // Admin will set through recipe
                    Category = "Burger", 
                    ImageUrl = "/images/burger.jpg", 
                    IsAvailable = true,
                    IsDirectPurchase = false,
                    ProfitMargin = 0
                },
                new FoodItem 
                { 
                    Id = 2, 
                    Name = "Crispy Chicken Fry", 
                    Description = "Golden fried chicken pieces with herbs and spices", 
                    Price = 0, // Admin will set through recipe
                    Category = "Chicken Fry", 
                    ImageUrl = "/images/chicken.jpg", 
                    IsAvailable = true,
                    IsDirectPurchase = false,
                    ProfitMargin = 0
                },
                new FoodItem 
                { 
                    Id = 3, 
                    Name = "Golden French Fries", 
                    Description = "Crispy golden french fries with salt", 
                    Price = 0, // Admin will set through recipe
                    Category = "French Fry", 
                    ImageUrl = "/images/fries.jpg", 
                    IsAvailable = true,
                    IsDirectPurchase = false,
                    ProfitMargin = 0
                },
                new FoodItem 
                { 
                    Id = 4, 
                    Name = "Spicy Noodles", 
                    Description = "Stir-fried noodles with vegetables and spices", 
                    Price = 0, // Admin will set through recipe
                    Category = "Noodles", 
                    ImageUrl = "/images/noodles.jpg", 
                    IsAvailable = true,
                    IsDirectPurchase = false,
                    ProfitMargin = 0
                },
                new FoodItem 
                { 
                    Id = 5, 
                    Name = "Mojo Drink", 
                    Description = "Refreshing mojo soft drink", 
                    Price = 0, // Admin will set cost + margin
                    Category = "Mojo", 
                    ImageUrl = "/images/mojo.jpg", 
                    IsAvailable = true,
                    IsDirectPurchase = true, // Direct purchase item
                    DirectPurchaseCost = 0, // Admin will set
                    ProfitMargin = 0 // Admin will set
                }
            );

            // Note: Recipes will be created by admin through the UI
            // Admin will:
            // 1. Add raw material prices and quantities
            // 2. Create food items and add recipes
            // 3. System will automatically calculate selling price with 35% profit margin
        }
    }
}
