namespace backend.DTOs;

public class CreateOrderDto
{
    public string DeliveryAddress { get; set; } = string.Empty;
    public string PhoneNumber { get; set; } = string.Empty;
    public string? Notes { get; set; }
    public string PaymentMethod { get; set; } = "cod";
    public List<OrderItemDto> Items { get; set; } = new();
}

public class OrderItemDto
{
    public int FoodItemId { get; set; }
    public int Quantity { get; set; }
}

public class OrderResponseDto
{
    public int OrderId { get; set; }
    public string Status { get; set; } = string.Empty;
    public decimal TotalAmount { get; set; }
    public string DeliveryAddress { get; set; } = string.Empty;
    public string PaymentMethod { get; set; } = "cod";
    public DateTime OrderDate { get; set; }
    public List<OrderItemResponseDto> Items { get; set; } = new();
}

public class OrderItemResponseDto
{
    public int Id { get; set; }
    public string FoodItemName { get; set; } = string.Empty;
    public int Quantity { get; set; }
    public decimal UnitPrice { get; set; }
    public decimal TotalPrice { get; set; }
}
