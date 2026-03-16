using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using FoodE_Backend.Data;
using FoodE_Backend.Model;

namespace FoodE_Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FoodItemsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public FoodItemsController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/FoodItems
        [HttpGet]
        public async Task<ActionResult<IEnumerable<object>>> GetFoodItems()
        {
            var items = await _context.FoodItems
                .Where(f => f.IsAvailable)
                .Select(f => new
                {
                    f.Id,
                    f.Name,
                    f.Description,
                    f.Price,
                    f.Category,
                    f.ImageUrl,
                    f.IsAvailable,
                    f.IsDeal,
                    f.OriginalPrice,
                    f.PreparedStock,
                    InStock = f.PreparedStock > 0 || f.IsDirectPurchase
                })
                .ToListAsync();

            return Ok(items);
        }

        // GET: api/FoodItems/5
        [HttpGet("{id}")]
        public async Task<ActionResult<object>> GetFoodItem(int id)
        {
            var foodItem = await _context.FoodItems.FindAsync(id);

            if (foodItem == null)
            {
                return NotFound();
            }

            return Ok(new
            {
                foodItem.Id,
                foodItem.Name,
                foodItem.Description,
                foodItem.Price,
                foodItem.Category,
                foodItem.ImageUrl,
                foodItem.IsAvailable,
                foodItem.IsDeal,
                foodItem.OriginalPrice,
                foodItem.PreparedStock,
                InStock = foodItem.PreparedStock > 0 || foodItem.IsDirectPurchase
            });
        }

        // GET: api/FoodItems/category/Pizza
        [HttpGet("category/{category}")]
        public async Task<ActionResult<IEnumerable<FoodItem>>> GetFoodByCategory(string category)
        {
            return await _context.FoodItems
                .Where(f => f.Category == category && f.IsAvailable)
                .ToListAsync();
        }

        // GET: api/FoodItems/deals
        [HttpGet("deals")]
        public async Task<ActionResult<IEnumerable<FoodItem>>> GetDeals()
        {
            return await _context.FoodItems
                .Where(f => f.IsDeal && f.IsAvailable)
                .ToListAsync();
        }

        // POST: api/FoodItems
        [HttpPost]
        public async Task<ActionResult<FoodItem>> PostFoodItem(FoodItem foodItem)
        {
            _context.FoodItems.Add(foodItem);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetFoodItem), new { id = foodItem.Id }, foodItem);
        }

        // PUT: api/FoodItems/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutFoodItem(int id, FoodItem foodItem)
        {
            if (id != foodItem.Id)
            {
                return BadRequest();
            }

            _context.Entry(foodItem).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!FoodItemExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // DELETE: api/FoodItems/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteFoodItem(int id)
        {
            var foodItem = await _context.FoodItems.FindAsync(id);
            if (foodItem == null)
            {
                return NotFound();
            }

            _context.FoodItems.Remove(foodItem);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool FoodItemExists(int id)
        {
            return _context.FoodItems.Any(e => e.Id == id);
        }
    }
}
