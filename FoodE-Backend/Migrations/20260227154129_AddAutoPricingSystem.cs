using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace FoodE_Backend.Migrations
{
    /// <inheritdoc />
    public partial class AddAutoPricingSystem : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<decimal>(
                name: "DirectPurchaseCost",
                table: "FoodItems",
                type: "decimal(18,2)",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsDirectPurchase",
                table: "FoodItems",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<decimal>(
                name: "ProfitMargin",
                table: "FoodItems",
                type: "decimal(18,2)",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.CreateTable(
                name: "RawMaterials",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Unit = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CostPerUnit = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    CurrentStock = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    MinimumStock = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    LastPurchaseDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    IsActive = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RawMaterials", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Recipes",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    FoodItemId = table.Column<int>(type: "int", nullable: false),
                    CreatedDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedDate = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Recipes", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Recipes_FoodItems_FoodItemId",
                        column: x => x.FoodItemId,
                        principalTable: "FoodItems",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "MaterialPurchases",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    RawMaterialId = table.Column<int>(type: "int", nullable: false),
                    Quantity = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    CostPerUnit = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    TotalCost = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    PurchaseDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Supplier = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Notes = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MaterialPurchases", x => x.Id);
                    table.ForeignKey(
                        name: "FK_MaterialPurchases_RawMaterials_RawMaterialId",
                        column: x => x.RawMaterialId,
                        principalTable: "RawMaterials",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "RecipeIngredients",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    RecipeId = table.Column<int>(type: "int", nullable: false),
                    RawMaterialId = table.Column<int>(type: "int", nullable: false),
                    QuantityNeeded = table.Column<decimal>(type: "decimal(18,2)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RecipeIngredients", x => x.Id);
                    table.ForeignKey(
                        name: "FK_RecipeIngredients_RawMaterials_RawMaterialId",
                        column: x => x.RawMaterialId,
                        principalTable: "RawMaterials",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_RecipeIngredients_Recipes_RecipeId",
                        column: x => x.RecipeId,
                        principalTable: "Recipes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.InsertData(
                table: "FoodItems",
                columns: new[] { "Id", "Category", "Description", "DirectPurchaseCost", "ImageUrl", "IsAvailable", "IsDeal", "IsDirectPurchase", "Name", "OriginalPrice", "Price", "ProfitMargin" },
                values: new object[,]
                {
                    { 1, "Burgers", "Delicious beef burger with fresh vegetables", null, "/images/burger.jpg", true, false, false, "Beef Burger", null, 150m, 0m },
                    { 2, "Chicken", "Crispy fried chicken", null, "/images/chicken.jpg", true, false, false, "Fried Chicken", null, 120m, 0m },
                    { 3, "Sides", "Golden crispy french fries", null, "/images/fries.jpg", true, false, false, "French Fries", null, 80m, 0m },
                    { 4, "Main Course", "Premium beef steak", null, "/images/steak.jpg", true, false, false, "Beef Steak", null, 250m, 0m },
                    { 5, "Beverages", "Refreshing mojo drink", 20m, "/images/mojo.jpg", true, false, true, "Mojo Drink", null, 30m, 10m }
                });

            migrationBuilder.InsertData(
                table: "RawMaterials",
                columns: new[] { "Id", "CostPerUnit", "CurrentStock", "IsActive", "LastPurchaseDate", "MinimumStock", "Name", "Unit" },
                values: new object[,]
                {
                    { 1, 5m, 100m, true, new DateTime(2026, 2, 27, 21, 41, 27, 502, DateTimeKind.Local).AddTicks(6804), 0m, "Burger Bun", "piece" },
                    { 2, 25m, 80m, true, new DateTime(2026, 2, 27, 21, 41, 27, 504, DateTimeKind.Local).AddTicks(2177), 0m, "Beef Patty", "piece" },
                    { 3, 8m, 60m, true, new DateTime(2026, 2, 27, 21, 41, 27, 504, DateTimeKind.Local).AddTicks(2200), 0m, "Cheese Slice", "piece" },
                    { 4, 2m, 50m, true, new DateTime(2026, 2, 27, 21, 41, 27, 504, DateTimeKind.Local).AddTicks(2202), 0m, "Lettuce", "piece" },
                    { 5, 3m, 50m, true, new DateTime(2026, 2, 27, 21, 41, 27, 504, DateTimeKind.Local).AddTicks(2248), 0m, "Tomato", "piece" },
                    { 6, 0.5m, 1000m, true, new DateTime(2026, 2, 27, 21, 41, 27, 504, DateTimeKind.Local).AddTicks(2287), 0m, "Sauce", "ml" },
                    { 7, 40m, 50m, true, new DateTime(2026, 2, 27, 21, 41, 27, 504, DateTimeKind.Local).AddTicks(2289), 0m, "Chicken Breast", "piece" },
                    { 8, 0.1m, 5000m, true, new DateTime(2026, 2, 27, 21, 41, 27, 504, DateTimeKind.Local).AddTicks(2292), 0m, "Flour", "gm" },
                    { 9, 0.5m, 500m, true, new DateTime(2026, 2, 27, 21, 41, 27, 504, DateTimeKind.Local).AddTicks(2294), 0m, "Spices Mix", "gm" },
                    { 10, 0.3m, 2000m, true, new DateTime(2026, 2, 27, 21, 41, 27, 504, DateTimeKind.Local).AddTicks(2296), 0m, "Oil", "ml" },
                    { 11, 5m, 200m, true, new DateTime(2026, 2, 27, 21, 41, 27, 504, DateTimeKind.Local).AddTicks(2298), 0m, "Potato", "piece" },
                    { 12, 0.02m, 1000m, true, new DateTime(2026, 2, 27, 21, 41, 27, 504, DateTimeKind.Local).AddTicks(2300), 0m, "Salt", "gm" },
                    { 13, 80m, 30m, true, new DateTime(2026, 2, 27, 21, 41, 27, 504, DateTimeKind.Local).AddTicks(2302), 0m, "Beef Steak Cut", "piece" },
                    { 14, 0.8m, 200m, true, new DateTime(2026, 2, 27, 21, 41, 27, 504, DateTimeKind.Local).AddTicks(2304), 0m, "Black Pepper", "gm" },
                    { 15, 0.5m, 500m, true, new DateTime(2026, 2, 27, 21, 41, 27, 504, DateTimeKind.Local).AddTicks(2306), 0m, "Butter", "gm" }
                });

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

            migrationBuilder.CreateIndex(
                name: "IX_MaterialPurchases_RawMaterialId",
                table: "MaterialPurchases",
                column: "RawMaterialId");

            migrationBuilder.CreateIndex(
                name: "IX_RecipeIngredients_RawMaterialId",
                table: "RecipeIngredients",
                column: "RawMaterialId");

            migrationBuilder.CreateIndex(
                name: "IX_RecipeIngredients_RecipeId",
                table: "RecipeIngredients",
                column: "RecipeId");

            migrationBuilder.CreateIndex(
                name: "IX_Recipes_FoodItemId",
                table: "Recipes",
                column: "FoodItemId",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "MaterialPurchases");

            migrationBuilder.DropTable(
                name: "RecipeIngredients");

            migrationBuilder.DropTable(
                name: "RawMaterials");

            migrationBuilder.DropTable(
                name: "Recipes");

            migrationBuilder.DeleteData(
                table: "FoodItems",
                keyColumn: "Id",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "FoodItems",
                keyColumn: "Id",
                keyValue: 2);

            migrationBuilder.DeleteData(
                table: "FoodItems",
                keyColumn: "Id",
                keyValue: 3);

            migrationBuilder.DeleteData(
                table: "FoodItems",
                keyColumn: "Id",
                keyValue: 4);

            migrationBuilder.DeleteData(
                table: "FoodItems",
                keyColumn: "Id",
                keyValue: 5);

            migrationBuilder.DropColumn(
                name: "DirectPurchaseCost",
                table: "FoodItems");

            migrationBuilder.DropColumn(
                name: "IsDirectPurchase",
                table: "FoodItems");

            migrationBuilder.DropColumn(
                name: "ProfitMargin",
                table: "FoodItems");
        }
    }
}
