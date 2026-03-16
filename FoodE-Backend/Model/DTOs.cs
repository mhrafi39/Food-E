namespace FoodE_Backend.Model
{
    public class RecipeIngredientDto
    {
        public int RawMaterialId { get; set; }
        public decimal QuantityNeeded { get; set; }
    }

    public class RecipeCreateDto
    {
        public int FoodItemId { get; set; }
        public List<RecipeIngredientDto> Ingredients { get; set; }
    }

    public class CreateFoodItemRequest
    {
        public FoodItem FoodItem { get; set; }
        public List<RecipeIngredientDto> RecipeIngredients { get; set; } = new List<RecipeIngredientDto>();
    }

    public class UpdateFoodItemRequest
    {
        public FoodItem FoodItem { get; set; }
        public List<RecipeIngredientDto> RecipeIngredients { get; set; } = new List<RecipeIngredientDto>();
    }

    public class PrepareItemsRequest
    {
        public int Quantity { get; set; }
    }

    public class UpdateOrderStatusRequest
    {
        public string Status { get; set; }
    }

    public class UpdateUserRoleRequest
    {
        public string Role { get; set; }
    }

    public class CreateOrderRequest
    {
        public string CustomerName { get; set; } = "";
        public string Email { get; set; } = "";
        public string Phone { get; set; } = "";
        public string Address { get; set; } = "";
        public string? Notes { get; set; }
        public string PaymentMethod { get; set; } = "cod";
        public List<OrderItemDto> Items { get; set; } = new List<OrderItemDto>();
    }

    public class OrderItemDto
    {
        public int FoodItemId { get; set; }
        public int Quantity { get; set; }
    }
}
