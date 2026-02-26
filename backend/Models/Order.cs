using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models;

public class Order
{
    [Key]
    public int Id { get; set; }
    
    [Required]
    public int UserId { get; set; }
    
    [ForeignKey("UserId")]
    public User User { get; set; } = null!;
    
    [Required]
    [Column(TypeName = "decimal(10,2)")]
    public decimal TotalAmount { get; set; }
    
    [Required]
    [MaxLength(50)]
    public string Status { get; set; } = "Pending"; // Pending, Confirmed, Preparing, Delivering, Delivered, Cancelled
    
    [Required]
    [MaxLength(500)]
    public string DeliveryAddress { get; set; } = string.Empty;
    
    [Required]
    [MaxLength(20)]
    public string PhoneNumber { get; set; } = string.Empty;
    
    [MaxLength(500)]
    public string? Notes { get; set; }
    
    [MaxLength(50)]
    public string PaymentMethod { get; set; } = "cod"; // cod, bkash, nagad, rocket, advance
    
    public DateTime OrderDate { get; set; } = DateTime.UtcNow;
    
    public DateTime? DeliveredAt { get; set; }
    
    // Navigation properties
    public ICollection<OrderItem> OrderItems { get; set; } = new List<OrderItem>();
}
