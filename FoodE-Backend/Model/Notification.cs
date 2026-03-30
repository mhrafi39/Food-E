namespace FoodE_Backend.Model
{
    public class Notification
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public string Message { get; set; } = "";
        public string Type { get; set; } = "order"; // order, system, etc.
        public int? RelatedOrderId { get; set; }
        public bool IsRead { get; set; } = false;
        public DateTime CreatedAt { get; set; } = DateTime.Now;
        public User? User { get; set; }
    }
}
