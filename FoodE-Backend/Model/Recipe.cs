namespace FoodE_Backend.Model
{
    public class Recipe
    {
        public int Id { get; set; }
        public int FoodItemId { get; set; }
        public FoodItem FoodItem { get; set; }
        public List<RecipeIngredient> Ingredients { get; set; } = new List<RecipeIngredient>();
        public DateTime CreatedDate { get; set; } = DateTime.Now;
        public DateTime? UpdatedDate { get; set; }
    }

    public class RecipeIngredient
    {
        public int Id { get; set; }
        public int RecipeId { get; set; }
        public Recipe Recipe { get; set; }
        public int RawMaterialId { get; set; }
        public RawMaterial RawMaterial { get; set; }
        public decimal QuantityNeeded { get; set; } // quantity per serving
    }
}
