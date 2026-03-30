namespace FoodE_Backend.Model
{
    public class Order
    {
        public int Id { get; set; }
        public int? UserId { get; set; }
        public string CustomerName { get; set; } = "";
        public string Email { get; set; } = "";
        public string Phone { get; set; } = "";
        public string Address { get; set; } = "";
        public string? Notes { get; set; }
        public string PaymentMethod { get; set; } = "cod";
        public decimal TotalAmount { get; set; }
        public string Status { get; set; } = "Pending";
        public DateTime OrderDate { get; set; } = DateTime.Now;
        public List<OrderItem> OrderItems { get; set; } = new List<OrderItem>();
        public User? User { get; set; }
    }

    public class OrderItem
    {
        public int Id { get; set; }
        public int OrderId { get; set; }
        public int FoodItemId { get; set; }
        public string FoodItemName { get; set; } = "";
        public int Quantity { get; set; }
        public decimal Price { get; set; }
        public Order? Order { get; set; }
    }
}
