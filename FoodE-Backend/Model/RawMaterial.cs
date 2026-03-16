namespace FoodE_Backend.Model
{
    public class RawMaterial
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Unit { get; set; } // piece, kg, liter, etc.
        public decimal CostPerUnit { get; set; }
        public decimal CurrentStock { get; set; }
        public decimal MinimumStock { get; set; } = 0;
        public DateTime LastPurchaseDate { get; set; }
        public bool IsActive { get; set; } = true;
    }
}
