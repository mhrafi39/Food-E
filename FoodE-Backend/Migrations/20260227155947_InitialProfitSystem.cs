using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace FoodE_Backend.Migrations
{
    /// <inheritdoc />
    public partial class InitialProfitSystem : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "RecipeIngredients",
                keyColumn: "Id",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "RecipeIngredients",
                keyColumn: "Id",
                keyValue: 2);

            migrationBuilder.DeleteData(
                table: "RecipeIngredients",
                keyColumn: "Id",
                keyValue: 3);

            migrationBuilder.DeleteData(
                table: "RecipeIngredients",
                keyColumn: "Id",
                keyValue: 4);

            migrationBuilder.DeleteData(
                table: "RecipeIngredients",
                keyColumn: "Id",
                keyValue: 5);

            migrationBuilder.DeleteData(
                table: "RecipeIngredients",
                keyColumn: "Id",
                keyValue: 6);

            migrationBuilder.DeleteData(
                table: "RecipeIngredients",
                keyColumn: "Id",
                keyValue: 7);

            migrationBuilder.DeleteData(
                table: "RecipeIngredients",
                keyColumn: "Id",
                keyValue: 8);

            migrationBuilder.DeleteData(
                table: "RecipeIngredients",
                keyColumn: "Id",
                keyValue: 9);

            migrationBuilder.DeleteData(
                table: "RecipeIngredients",
                keyColumn: "Id",
                keyValue: 10);

            migrationBuilder.DeleteData(
                table: "RecipeIngredients",
                keyColumn: "Id",
                keyValue: 11);

            migrationBuilder.DeleteData(
                table: "RecipeIngredients",
                keyColumn: "Id",
                keyValue: 12);

            migrationBuilder.DeleteData(
                table: "RecipeIngredients",
                keyColumn: "Id",
                keyValue: 13);

            migrationBuilder.DeleteData(
                table: "RecipeIngredients",
                keyColumn: "Id",
                keyValue: 14);

            migrationBuilder.DeleteData(
                table: "RecipeIngredients",
                keyColumn: "Id",
                keyValue: 15);

            migrationBuilder.DeleteData(
                table: "RecipeIngredients",
                keyColumn: "Id",
                keyValue: 16);

            migrationBuilder.DeleteData(
                table: "RecipeIngredients",
                keyColumn: "Id",
                keyValue: 17);

            migrationBuilder.DeleteData(
                table: "Recipes",
                keyColumn: "Id",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "Recipes",
                keyColumn: "Id",
                keyValue: 2);

            migrationBuilder.DeleteData(
                table: "Recipes",
                keyColumn: "Id",
                keyValue: 3);

            migrationBuilder.DeleteData(
                table: "Recipes",
                keyColumn: "Id",
                keyValue: 4);

            migrationBuilder.UpdateData(
                table: "FoodItems",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "Category", "Description", "Name", "Price" },
                values: new object[] { "Burger", "Juicy beef patty with fresh vegetables and special sauce", "Classic Beef Burger", 0m });

            migrationBuilder.UpdateData(
                table: "FoodItems",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "Category", "Description", "Name", "Price" },
                values: new object[] { "Chicken Fry", "Golden fried chicken pieces with herbs and spices", "Crispy Chicken Fry", 0m });

            migrationBuilder.UpdateData(
                table: "FoodItems",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "Category", "Description", "Name", "Price" },
                values: new object[] { "French Fry", "Crispy golden french fries with salt", "Golden French Fries", 0m });

            migrationBuilder.UpdateData(
                table: "FoodItems",
                keyColumn: "Id",
                keyValue: 4,
                columns: new[] { "Category", "Description", "ImageUrl", "Name", "Price" },
                values: new object[] { "Noodles", "Stir-fried noodles with vegetables and spices", "/images/noodles.jpg", "Spicy Noodles", 0m });

            migrationBuilder.UpdateData(
                table: "FoodItems",
                keyColumn: "Id",
                keyValue: 5,
                columns: new[] { "Category", "Description", "DirectPurchaseCost", "Price", "ProfitMargin" },
                values: new object[] { "Mojo", "Refreshing mojo soft drink", 0m, 0m, 0m });

            migrationBuilder.UpdateData(
                table: "RawMaterials",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CostPerUnit", "CurrentStock", "LastPurchaseDate", "MinimumStock" },
                values: new object[] { 0m, 0m, new DateTime(2024, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), 20m });

            migrationBuilder.UpdateData(
                table: "RawMaterials",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "CostPerUnit", "CurrentStock", "LastPurchaseDate", "MinimumStock" },
                values: new object[] { 0m, 0m, new DateTime(2024, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), 20m });

            migrationBuilder.UpdateData(
                table: "RawMaterials",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "CostPerUnit", "CurrentStock", "LastPurchaseDate", "MinimumStock" },
                values: new object[] { 0m, 0m, new DateTime(2024, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), 30m });

            migrationBuilder.UpdateData(
                table: "RawMaterials",
                keyColumn: "Id",
                keyValue: 4,
                columns: new[] { "CostPerUnit", "CurrentStock", "LastPurchaseDate", "MinimumStock" },
                values: new object[] { 0m, 0m, new DateTime(2024, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), 10m });

            migrationBuilder.UpdateData(
                table: "RawMaterials",
                keyColumn: "Id",
                keyValue: 5,
                columns: new[] { "CostPerUnit", "CurrentStock", "LastPurchaseDate", "MinimumStock" },
                values: new object[] { 0m, 0m, new DateTime(2024, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), 15m });

            migrationBuilder.UpdateData(
                table: "RawMaterials",
                keyColumn: "Id",
                keyValue: 6,
                columns: new[] { "CostPerUnit", "CurrentStock", "LastPurchaseDate", "MinimumStock", "Name", "Unit" },
                values: new object[] { 0m, 0m, new DateTime(2024, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), 10m, "Onion", "piece" });

            migrationBuilder.UpdateData(
                table: "RawMaterials",
                keyColumn: "Id",
                keyValue: 7,
                columns: new[] { "CostPerUnit", "CurrentStock", "LastPurchaseDate", "MinimumStock", "Name" },
                values: new object[] { 0m, 0m, new DateTime(2024, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), 20m, "Pickles" });

            migrationBuilder.UpdateData(
                table: "RawMaterials",
                keyColumn: "Id",
                keyValue: 8,
                columns: new[] { "CostPerUnit", "CurrentStock", "LastPurchaseDate", "MinimumStock", "Name", "Unit" },
                values: new object[] { 0m, 0m, new DateTime(2024, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), 500m, "Ketchup", "ml" });

            migrationBuilder.UpdateData(
                table: "RawMaterials",
                keyColumn: "Id",
                keyValue: 9,
                columns: new[] { "CostPerUnit", "CurrentStock", "LastPurchaseDate", "MinimumStock", "Name", "Unit" },
                values: new object[] { 0m, 0m, new DateTime(2024, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), 500m, "Mayonnaise", "ml" });

            migrationBuilder.UpdateData(
                table: "RawMaterials",
                keyColumn: "Id",
                keyValue: 10,
                columns: new[] { "CostPerUnit", "CurrentStock", "LastPurchaseDate", "MinimumStock", "Name", "Unit" },
                values: new object[] { 0m, 0m, new DateTime(2024, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), 20m, "Chicken Pieces", "piece" });

            migrationBuilder.UpdateData(
                table: "RawMaterials",
                keyColumn: "Id",
                keyValue: 11,
                columns: new[] { "CostPerUnit", "CurrentStock", "LastPurchaseDate", "MinimumStock", "Name", "Unit" },
                values: new object[] { 0m, 0m, new DateTime(2024, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), 1000m, "Flour", "gm" });

            migrationBuilder.UpdateData(
                table: "RawMaterials",
                keyColumn: "Id",
                keyValue: 12,
                columns: new[] { "CostPerUnit", "CurrentStock", "LastPurchaseDate", "MinimumStock", "Name" },
                values: new object[] { 0m, 0m, new DateTime(2024, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), 500m, "Breadcrumbs" });

            migrationBuilder.UpdateData(
                table: "RawMaterials",
                keyColumn: "Id",
                keyValue: 13,
                columns: new[] { "CostPerUnit", "CurrentStock", "LastPurchaseDate", "MinimumStock", "Name" },
                values: new object[] { 0m, 0m, new DateTime(2024, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), 12m, "Eggs" });

            migrationBuilder.UpdateData(
                table: "RawMaterials",
                keyColumn: "Id",
                keyValue: 14,
                columns: new[] { "CostPerUnit", "CurrentStock", "LastPurchaseDate", "MinimumStock", "Name" },
                values: new object[] { 0m, 0m, new DateTime(2024, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), 200m, "Spices Mix" });

            migrationBuilder.UpdateData(
                table: "RawMaterials",
                keyColumn: "Id",
                keyValue: 15,
                columns: new[] { "CostPerUnit", "CurrentStock", "LastPurchaseDate", "MinimumStock", "Name", "Unit" },
                values: new object[] { 0m, 0m, new DateTime(2024, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), 1000m, "Cooking Oil", "ml" });

            migrationBuilder.InsertData(
                table: "RawMaterials",
                columns: new[] { "Id", "CostPerUnit", "CurrentStock", "IsActive", "LastPurchaseDate", "MinimumStock", "Name", "Unit" },
                values: new object[,]
                {
                    { 16, 0m, 0m, true, new DateTime(2024, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), 5m, "Potato", "kg" },
                    { 17, 0m, 0m, true, new DateTime(2024, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), 500m, "Salt", "gm" },
                    { 18, 0m, 0m, true, new DateTime(2024, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), 10m, "Noodles (Dry)", "packet" },
                    { 19, 0m, 0m, true, new DateTime(2024, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), 500m, "Mixed Vegetables", "gm" },
                    { 20, 0m, 0m, true, new DateTime(2024, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), 300m, "Soy Sauce", "ml" },
                    { 21, 0m, 0m, true, new DateTime(2024, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), 100m, "Garlic", "gm" },
                    { 22, 0m, 0m, true, new DateTime(2024, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), 100m, "Ginger", "gm" },
                    { 23, 0m, 0m, true, new DateTime(2024, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), 10m, "Chili", "piece" },
                    { 24, 0m, 0m, true, new DateTime(2024, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), 5m, "Spring Onion", "bunch" },
                    { 25, 0m, 0m, true, new DateTime(2024, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), 20m, "Mojo Bottle", "bottle" }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "RawMaterials",
                keyColumn: "Id",
                keyValue: 16);

            migrationBuilder.DeleteData(
                table: "RawMaterials",
                keyColumn: "Id",
                keyValue: 17);

            migrationBuilder.DeleteData(
                table: "RawMaterials",
                keyColumn: "Id",
                keyValue: 18);

            migrationBuilder.DeleteData(
                table: "RawMaterials",
                keyColumn: "Id",
                keyValue: 19);

            migrationBuilder.DeleteData(
                table: "RawMaterials",
                keyColumn: "Id",
                keyValue: 20);

            migrationBuilder.DeleteData(
                table: "RawMaterials",
                keyColumn: "Id",
                keyValue: 21);

            migrationBuilder.DeleteData(
                table: "RawMaterials",
                keyColumn: "Id",
                keyValue: 22);

            migrationBuilder.DeleteData(
                table: "RawMaterials",
                keyColumn: "Id",
                keyValue: 23);

            migrationBuilder.DeleteData(
                table: "RawMaterials",
                keyColumn: "Id",
                keyValue: 24);

            migrationBuilder.DeleteData(
                table: "RawMaterials",
                keyColumn: "Id",
                keyValue: 25);

            migrationBuilder.UpdateData(
                table: "FoodItems",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "Category", "Description", "Name", "Price" },
                values: new object[] { "Burgers", "Delicious beef burger with fresh vegetables", "Beef Burger", 150m });

            migrationBuilder.UpdateData(
                table: "FoodItems",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "Category", "Description", "Name", "Price" },
                values: new object[] { "Chicken", "Crispy fried chicken", "Fried Chicken", 120m });

            migrationBuilder.UpdateData(
                table: "FoodItems",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "Category", "Description", "Name", "Price" },
                values: new object[] { "Sides", "Golden crispy french fries", "French Fries", 80m });

            migrationBuilder.UpdateData(
                table: "FoodItems",
                keyColumn: "Id",
                keyValue: 4,
                columns: new[] { "Category", "Description", "ImageUrl", "Name", "Price" },
                values: new object[] { "Main Course", "Premium beef steak", "/images/steak.jpg", "Beef Steak", 250m });

            migrationBuilder.UpdateData(
                table: "FoodItems",
                keyColumn: "Id",
                keyValue: 5,
                columns: new[] { "Category", "Description", "DirectPurchaseCost", "Price", "ProfitMargin" },
                values: new object[] { "Beverages", "Refreshing mojo drink", 20m, 30m, 10m });

            migrationBuilder.UpdateData(
                table: "RawMaterials",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CostPerUnit", "CurrentStock", "LastPurchaseDate", "MinimumStock" },
                values: new object[] { 5m, 100m, new DateTime(2026, 2, 27, 21, 41, 27, 502, DateTimeKind.Local).AddTicks(6804), 0m });

            migrationBuilder.UpdateData(
                table: "RawMaterials",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "CostPerUnit", "CurrentStock", "LastPurchaseDate", "MinimumStock" },
                values: new object[] { 25m, 80m, new DateTime(2026, 2, 27, 21, 41, 27, 504, DateTimeKind.Local).AddTicks(2177), 0m });

            migrationBuilder.UpdateData(
                table: "RawMaterials",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "CostPerUnit", "CurrentStock", "LastPurchaseDate", "MinimumStock" },
                values: new object[] { 8m, 60m, new DateTime(2026, 2, 27, 21, 41, 27, 504, DateTimeKind.Local).AddTicks(2200), 0m });

            migrationBuilder.UpdateData(
                table: "RawMaterials",
                keyColumn: "Id",
                keyValue: 4,
                columns: new[] { "CostPerUnit", "CurrentStock", "LastPurchaseDate", "MinimumStock" },
                values: new object[] { 2m, 50m, new DateTime(2026, 2, 27, 21, 41, 27, 504, DateTimeKind.Local).AddTicks(2202), 0m });

            migrationBuilder.UpdateData(
                table: "RawMaterials",
                keyColumn: "Id",
                keyValue: 5,
                columns: new[] { "CostPerUnit", "CurrentStock", "LastPurchaseDate", "MinimumStock" },
                values: new object[] { 3m, 50m, new DateTime(2026, 2, 27, 21, 41, 27, 504, DateTimeKind.Local).AddTicks(2248), 0m });

            migrationBuilder.UpdateData(
                table: "RawMaterials",
                keyColumn: "Id",
                keyValue: 6,
                columns: new[] { "CostPerUnit", "CurrentStock", "LastPurchaseDate", "MinimumStock", "Name", "Unit" },
                values: new object[] { 0.5m, 1000m, new DateTime(2026, 2, 27, 21, 41, 27, 504, DateTimeKind.Local).AddTicks(2287), 0m, "Sauce", "ml" });

            migrationBuilder.UpdateData(
                table: "RawMaterials",
                keyColumn: "Id",
                keyValue: 7,
                columns: new[] { "CostPerUnit", "CurrentStock", "LastPurchaseDate", "MinimumStock", "Name" },
                values: new object[] { 40m, 50m, new DateTime(2026, 2, 27, 21, 41, 27, 504, DateTimeKind.Local).AddTicks(2289), 0m, "Chicken Breast" });

            migrationBuilder.UpdateData(
                table: "RawMaterials",
                keyColumn: "Id",
                keyValue: 8,
                columns: new[] { "CostPerUnit", "CurrentStock", "LastPurchaseDate", "MinimumStock", "Name", "Unit" },
                values: new object[] { 0.1m, 5000m, new DateTime(2026, 2, 27, 21, 41, 27, 504, DateTimeKind.Local).AddTicks(2292), 0m, "Flour", "gm" });

            migrationBuilder.UpdateData(
                table: "RawMaterials",
                keyColumn: "Id",
                keyValue: 9,
                columns: new[] { "CostPerUnit", "CurrentStock", "LastPurchaseDate", "MinimumStock", "Name", "Unit" },
                values: new object[] { 0.5m, 500m, new DateTime(2026, 2, 27, 21, 41, 27, 504, DateTimeKind.Local).AddTicks(2294), 0m, "Spices Mix", "gm" });

            migrationBuilder.UpdateData(
                table: "RawMaterials",
                keyColumn: "Id",
                keyValue: 10,
                columns: new[] { "CostPerUnit", "CurrentStock", "LastPurchaseDate", "MinimumStock", "Name", "Unit" },
                values: new object[] { 0.3m, 2000m, new DateTime(2026, 2, 27, 21, 41, 27, 504, DateTimeKind.Local).AddTicks(2296), 0m, "Oil", "ml" });

            migrationBuilder.UpdateData(
                table: "RawMaterials",
                keyColumn: "Id",
                keyValue: 11,
                columns: new[] { "CostPerUnit", "CurrentStock", "LastPurchaseDate", "MinimumStock", "Name", "Unit" },
                values: new object[] { 5m, 200m, new DateTime(2026, 2, 27, 21, 41, 27, 504, DateTimeKind.Local).AddTicks(2298), 0m, "Potato", "piece" });

            migrationBuilder.UpdateData(
                table: "RawMaterials",
                keyColumn: "Id",
                keyValue: 12,
                columns: new[] { "CostPerUnit", "CurrentStock", "LastPurchaseDate", "MinimumStock", "Name" },
                values: new object[] { 0.02m, 1000m, new DateTime(2026, 2, 27, 21, 41, 27, 504, DateTimeKind.Local).AddTicks(2300), 0m, "Salt" });

            migrationBuilder.UpdateData(
                table: "RawMaterials",
                keyColumn: "Id",
                keyValue: 13,
                columns: new[] { "CostPerUnit", "CurrentStock", "LastPurchaseDate", "MinimumStock", "Name" },
                values: new object[] { 80m, 30m, new DateTime(2026, 2, 27, 21, 41, 27, 504, DateTimeKind.Local).AddTicks(2302), 0m, "Beef Steak Cut" });

            migrationBuilder.UpdateData(
                table: "RawMaterials",
                keyColumn: "Id",
                keyValue: 14,
                columns: new[] { "CostPerUnit", "CurrentStock", "LastPurchaseDate", "MinimumStock", "Name" },
                values: new object[] { 0.8m, 200m, new DateTime(2026, 2, 27, 21, 41, 27, 504, DateTimeKind.Local).AddTicks(2304), 0m, "Black Pepper" });

            migrationBuilder.UpdateData(
                table: "RawMaterials",
                keyColumn: "Id",
                keyValue: 15,
                columns: new[] { "CostPerUnit", "CurrentStock", "LastPurchaseDate", "MinimumStock", "Name", "Unit" },
                values: new object[] { 0.5m, 500m, new DateTime(2026, 2, 27, 21, 41, 27, 504, DateTimeKind.Local).AddTicks(2306), 0m, "Butter", "gm" });

            migrationBuilder.InsertData(
                table: "Recipes",
                columns: new[] { "Id", "CreatedDate", "FoodItemId", "UpdatedDate" },
                values: new object[,]
                {
                    { 1, new DateTime(2026, 2, 27, 21, 41, 27, 505, DateTimeKind.Local).AddTicks(3578), 1, null },
                    { 2, new DateTime(2026, 2, 27, 21, 41, 27, 505, DateTimeKind.Local).AddTicks(4253), 2, null },
                    { 3, new DateTime(2026, 2, 27, 21, 41, 27, 505, DateTimeKind.Local).AddTicks(4255), 3, null },
                    { 4, new DateTime(2026, 2, 27, 21, 41, 27, 505, DateTimeKind.Local).AddTicks(4257), 4, null }
                });

            migrationBuilder.InsertData(
                table: "RecipeIngredients",
                columns: new[] { "Id", "QuantityNeeded", "RawMaterialId", "RecipeId" },
                values: new object[,]
                {
                    { 1, 1m, 1, 1 },
                    { 2, 1m, 2, 1 },
                    { 3, 2m, 3, 1 },
                    { 4, 1m, 4, 1 },
                    { 5, 1m, 5, 1 },
                    { 6, 20m, 6, 1 },
                    { 7, 1m, 7, 2 },
                    { 8, 100m, 8, 2 },
                    { 9, 20m, 9, 2 },
                    { 10, 50m, 10, 2 },
                    { 11, 2m, 11, 3 },
                    { 12, 5m, 12, 3 },
                    { 13, 100m, 10, 3 },
                    { 14, 1m, 13, 4 },
                    { 15, 10m, 14, 4 },
                    { 16, 20m, 15, 4 },
                    { 17, 10m, 6, 4 }
                });
        }
    }
}
