using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using FoodE_Backend.Data;
using FoodE_Backend.Model;

namespace FoodE_Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RecipesController : ControllerBase
    {
        private readonly AppDbContext _context;

        public RecipesController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/Recipes/fooditem/{foodItemId}
        [HttpGet("fooditem/{foodItemId}")]
        public async Task<ActionResult<object>> GetRecipeByFoodItem(int foodItemId)
        {
            var recipe = await _context.Recipes
                .Include(r => r.Ingredients)
                    .ThenInclude(i => i.RawMaterial)
                .FirstOrDefaultAsync(r => r.FoodItemId == foodItemId);

            if (recipe == null)
                return NotFound(new { message = "Recipe not found for this food item" });

            return Ok(new
            {
                id = recipe.Id,
                foodItemId = recipe.FoodItemId,
                ingredients = recipe.Ingredients.Select(i => new
                {
                    id = i.Id,
                    rawMaterialId = i.RawMaterialId,
                    rawMaterialName = i.RawMaterial.Name,
                    quantityNeeded = i.QuantityNeeded,
                    unit = i.RawMaterial.Unit,
                    costPerUnit = i.RawMaterial.CostPerUnit,
                    totalCost = i.QuantityNeeded * i.RawMaterial.CostPerUnit
                }).ToList()
            });
        }
    }
}
