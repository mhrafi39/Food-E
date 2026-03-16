using System.Text.Json.Serialization;

namespace FoodE_Backend.Model
{
    public class FoodItem
    {
        public int Id { get; set; }
        public string Name { get; set; } = "";
        public string? Description { get; set; }
        public decimal Price { get; set; }
        public string Category { get; set; } = "";
        public string? ImageUrl { get; set; }
        public bool IsAvailable { get; set; } = true;
        public bool IsDeal { get; set; } = false;
        public decimal? OriginalPrice { get; set; }

        // Profit Tracking
        public bool IsDirectPurchase { get; set; } = false; // true for items like Mojo
        public decimal? DirectPurchaseCost { get; set; } // cost per unit if bought directly
        public decimal ProfitMargin { get; set; } = 0; // fixed profit per item (e.g., 10 taka for Mojo)

        // Prepared Items Inventory
        public int PreparedStock { get; set; } = 0; // How many finished items are ready to sell

        // Navigation
        [JsonIgnore]
        public Recipe? Recipe { get; set; }
    }
}
