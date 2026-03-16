using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using FoodE_Backend.Data;
using FoodE_Backend.Model;

namespace FoodE_Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RawMaterialsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public RawMaterialsController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/RawMaterials
        [HttpGet]
        public async Task<ActionResult<IEnumerable<RawMaterial>>> GetRawMaterials()
        {
            return await _context.RawMaterials.ToListAsync();
        }

        // GET: api/RawMaterials/5
        [HttpGet("{id}")]
        public async Task<ActionResult<RawMaterial>> GetRawMaterial(int id)
        {
            var material = await _context.RawMaterials.FindAsync(id);

            if (material == null)
            {
                return NotFound();
            }

            return material;
        }

        // POST: api/RawMaterials
        [HttpPost]
        public async Task<ActionResult<RawMaterial>> CreateRawMaterial(RawMaterial material)
        {
            material.LastPurchaseDate = DateTime.Now;
            _context.RawMaterials.Add(material);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetRawMaterial), new { id = material.Id }, material);
        }

        // PUT: api/RawMaterials/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateRawMaterial(int id, RawMaterial material)
        {
            if (id != material.Id)
            {
                return BadRequest();
            }

            _context.Entry(material).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!RawMaterialExists(id))
                {
                    return NotFound();
                }
                throw;
            }

            return NoContent();
        }

        // POST: api/RawMaterials/purchase
        [HttpPost("purchase")]
        public async Task<ActionResult<MaterialPurchase>> RecordPurchase(MaterialPurchase purchase)
        {
            purchase.PurchaseDate = DateTime.Now;
            purchase.TotalCost = purchase.Quantity * purchase.CostPerUnit;

            // Update stock and cost of raw material
            var material = await _context.RawMaterials.FindAsync(purchase.RawMaterialId);
            if (material == null)
            {
                return NotFound("Raw material not found");
            }

            material.CurrentStock += purchase.Quantity;
            material.CostPerUnit = purchase.CostPerUnit;
            material.LastPurchaseDate = DateTime.Now;

            _context.MaterialPurchases.Add(purchase);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetPurchaseHistory), new { materialId = purchase.RawMaterialId }, purchase);
        }

        // GET: api/RawMaterials/5/purchase-history
        [HttpGet("{materialId}/purchase-history")]
        public async Task<ActionResult<IEnumerable<MaterialPurchase>>> GetPurchaseHistory(int materialId)
        {
            return await _context.MaterialPurchases
                .Where(p => p.RawMaterialId == materialId)
                .Include(p => p.RawMaterial)
                .OrderByDescending(p => p.PurchaseDate)
                .ToListAsync();
        }

        // DELETE: api/RawMaterials/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteRawMaterial(int id)
        {
            var material = await _context.RawMaterials.FindAsync(id);
            if (material == null)
            {
                return NotFound();
            }

            material.IsActive = false;
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool RawMaterialExists(int id)
        {
            return _context.RawMaterials.Any(e => e.Id == id);
        }
    }
}
