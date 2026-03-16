namespace FoodE_Backend.Model
{
    public class MaterialPurchase
    {
        public int Id { get; set; }
        public int RawMaterialId { get; set; }
        public RawMaterial? RawMaterial { get; set; }
        public decimal Quantity { get; set; }
        public decimal CostPerUnit { get; set; }
        public decimal TotalCost { get; set; }
        public DateTime PurchaseDate { get; set; } = DateTime.Now;
        public string? Supplier { get; set; }  // Optional
        public string? Notes { get; set; }      // Optional
    }
}
