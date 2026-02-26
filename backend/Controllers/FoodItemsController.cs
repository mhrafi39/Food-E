using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend.Data;
using backend.Models;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class FoodItemsController : ControllerBase
{
    private readonly AppDbContext _context;

    public FoodItemsController(AppDbContext context)
    {
        _context = context;
    }

    // GET: api/FoodItems
    [HttpGet]
    public async Task<ActionResult<IEnumerable<FoodItem>>> GetFoodItems()
    {
        return await _context.FoodItems
            .Where(f => f.IsAvailable)
            .OrderBy(f => f.Category)
            .ThenBy(f => f.Name)
            .ToListAsync();
    }

    // GET: api/FoodItems/5
    [HttpGet("{id}")]
    public async Task<ActionResult<FoodItem>> GetFoodItem(int id)
    {
        var foodItem = await _context.FoodItems.FindAsync(id);

        if (foodItem == null)
        {
            return NotFound();
        }

        return foodItem;
    }

    // GET: api/FoodItems/category/pizza
    [HttpGet("category/{category}")]
    public async Task<ActionResult<IEnumerable<FoodItem>>> GetFoodItemsByCategory(string category)
    {
        return await _context.FoodItems
            .Where(f => f.Category.ToLower() == category.ToLower() && f.IsAvailable)
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
    public async Task<ActionResult<FoodItem>> CreateFoodItem(FoodItem foodItem)
    {
        foodItem.CreatedAt = DateTime.UtcNow;
        _context.FoodItems.Add(foodItem);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetFoodItem), new { id = foodItem.Id }, foodItem);
    }

    // PUT: api/FoodItems/5
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateFoodItem(int id, FoodItem foodItem)
    {
        if (id != foodItem.Id)
        {
            return BadRequest();
        }

        foodItem.UpdatedAt = DateTime.UtcNow;
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
