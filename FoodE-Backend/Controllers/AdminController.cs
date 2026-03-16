using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using FoodE_Backend.Data;
using FoodE_Backend.Model;

namespace FoodE_Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AdminController : ControllerBase
    {
        private readonly AppDbContext _context;

        public AdminController(AppDbContext context)
        {
            _context = context;
        }

        
        private async Task<User?> GetAdminUser(string token)
        {
           
            if (string.IsNullOrEmpty(token) || !token.StartsWith("fake-jwt-token-"))
                return null;

            var userIdStr = token.Replace("fake-jwt-token-", "");
            if (!int.TryParse(userIdStr, out int userId))
                return null;

            var user = await _context.Users.FindAsync(userId);
            return user?.Role == "admin" ? user : null;
        }

        #region Food Items Management

        // GET: api/Admin/fooditems
        [HttpGet("fooditems")]
        public async Task<ActionResult<IEnumerable<object>>> GetAllFoodItems([FromHeader(Name = "Authorization")] string? authorization)
        {
            var token = authorization?.Replace("Bearer ", "");
            var admin = await GetAdminUser(token);
            if (admin == null)
                return Unauthorized(new { message = "Admin access required" });

            var items = await _context.FoodItems
                .Include(f => f.Recipe)
                    .ThenInclude(r => r.Ingredients)
                    .ThenInclude(i => i.RawMaterial)
                .ToListAsync();

            var result = items.Select(item => 
            {
                var recipeIngredients = item.Recipe != null 
                    ? item.Recipe.Ingredients.Select(i => (object)new
                    {
                        RawMaterialId = i.RawMaterialId,
                        RawMaterialName = i.RawMaterial.Name,
                        QuantityNeeded = i.QuantityNeeded,
                        Unit = i.RawMaterial.Unit,
                        CostPerUnit = i.RawMaterial.CostPerUnit,
                        TotalCost = i.QuantityNeeded * i.RawMaterial.CostPerUnit
                    }).ToList()
                    : new List<object>();

                return new
                {
                    item.Id,
                    item.Name,
                    item.Description,
                    item.Price,
                    item.Category,
                    item.ImageUrl,
                    item.IsAvailable,
                    item.IsDeal,
                    item.OriginalPrice,
                    item.IsDirectPurchase,
                    item.DirectPurchaseCost,
                    item.ProfitMargin,
                    item.PreparedStock,
                    HasRecipe = item.Recipe != null,
                    RecipeIngredients = recipeIngredients
                };
            });

            return Ok(result);
        }

        // POST: api/Admin/fooditems
        [HttpPost("fooditems")]
        public async Task<ActionResult<FoodItem>> AddFoodItem([FromHeader(Name = "Authorization")] string? authorization, [FromBody] CreateFoodItemRequest request)
        {
            var token = authorization?.Replace("Bearer ", "");
            var admin = await GetAdminUser(token);
            if (admin == null)
                return Unauthorized(new { message = "Admin access required" });

            // Validate the request
            if (request?.FoodItem == null)
                return BadRequest(new { message = "FoodItem data is required" });

            // Calculate price based on item type
            if (request.FoodItem.IsDirectPurchase)
            {
                // For direct purchase items (like Mojo)
                if (!request.FoodItem.DirectPurchaseCost.HasValue)
                {
                    return BadRequest(new { message = "DirectPurchaseCost is required for direct purchase items" });
                }

                if (request.FoodItem.DirectPurchaseCost.Value < 0)
                {
                    return BadRequest(new { message = "DirectPurchaseCost cannot be negative" });
                }

                // Apply 35% profit margin: Price = Cost * 1.35
                request.FoodItem.Price = request.FoodItem.DirectPurchaseCost.Value * 1.35m;
                request.FoodItem.ProfitMargin = request.FoodItem.DirectPurchaseCost.Value * 0.35m; // Store the 35% profit
            }
            else if (request.RecipeIngredients != null && request.RecipeIngredients.Count > 0)
            {
                // Calculate total cost from recipe ingredients
                decimal totalCost = 0;
                foreach (var ingredient in request.RecipeIngredients)
                {
                    var material = await _context.RawMaterials.FindAsync(ingredient.RawMaterialId);
                    if (material == null)
                    {
                        return BadRequest(new { message = $"Raw material with ID {ingredient.RawMaterialId} not found" });
                    }
                    totalCost += material.CostPerUnit * ingredient.QuantityNeeded;
                }

                // Add 35% profit margin
                request.FoodItem.Price = totalCost * 1.35m;
                request.FoodItem.ProfitMargin = totalCost * 0.35m;
            }
            else
            {
                // Manual price - must be set by frontend
                if (request.FoodItem.Price <= 0)
                {
                    return BadRequest(new
                    {
                        message = "Either recipe ingredients or direct purchase cost must be provided, or specify a manual price",
                        isDirectPurchase = request.FoodItem.IsDirectPurchase,
                        hasRecipeIngredients = request.RecipeIngredients?.Count > 0,
                        price = request.FoodItem.Price
                    });
                }
            }

            // Create the food item
            _context.FoodItems.Add(request.FoodItem);
            await _context.SaveChangesAsync();

            // Create recipe if ingredients provided (and not a direct purchase item)
            if (!request.FoodItem.IsDirectPurchase && request.RecipeIngredients != null && request.RecipeIngredients.Count > 0)
            {
                var recipe = new Recipe
                {
                    FoodItemId = request.FoodItem.Id,
                    CreatedDate = DateTime.Now
                };
                _context.Recipes.Add(recipe);
                await _context.SaveChangesAsync();

                // Add recipe ingredients
                foreach (var ingredient in request.RecipeIngredients)
                {
                    var recipeIngredient = new RecipeIngredient
                    {
                        RecipeId = recipe.Id,
                        RawMaterialId = ingredient.RawMaterialId,
                        QuantityNeeded = ingredient.QuantityNeeded
                    };
                    _context.RecipeIngredients.Add(recipeIngredient);
                }
                await _context.SaveChangesAsync();
            }

            return CreatedAtAction(nameof(GetFoodItemById), new { id = request.FoodItem.Id }, request.FoodItem);
        }

        // GET: api/Admin/fooditems/{id}
        [HttpGet("fooditems/{id}")]
        public async Task<ActionResult<object>> GetFoodItemById([FromHeader(Name = "Authorization")] string? authorization, int id)
        {
            var token = authorization?.Replace("Bearer ", "");
            var admin = await GetAdminUser(token);
            if (admin == null)
                return Unauthorized(new { message = "Admin access required" });

            var foodItem = await _context.FoodItems
                .Include(f => f.Recipe)
                    .ThenInclude(r => r.Ingredients)
                    .ThenInclude(i => i.RawMaterial)
                .FirstOrDefaultAsync(f => f.Id == id);

            if (foodItem == null)
                return NotFound(new { message = "Food item not found" });

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
                foodItem.IsDirectPurchase,
                foodItem.DirectPurchaseCost,
                foodItem.ProfitMargin,
                HasRecipe = foodItem.Recipe != null,
                Recipe = foodItem.Recipe != null ? new
                {
                    Id = foodItem.Recipe.Id,
                    FoodItemId = foodItem.Recipe.FoodItemId,
                    CreatedDate = foodItem.Recipe.CreatedDate,
                    UpdatedDate = foodItem.Recipe.UpdatedDate,
                    Ingredients = foodItem.Recipe.Ingredients.Select(i => new
                    {
                        i.Id,
                        i.RawMaterialId,
                        RawMaterialName = i.RawMaterial.Name,
                        i.QuantityNeeded,
                        Unit = i.RawMaterial.Unit,
                        CostPerUnit = i.RawMaterial.CostPerUnit,
                        TotalCost = i.QuantityNeeded * i.RawMaterial.CostPerUnit,
                        CurrentStock = i.RawMaterial.CurrentStock
                    }).ToList(),
                    TotalRecipeCost = foodItem.Recipe.Ingredients.Sum(i => i.QuantityNeeded * i.RawMaterial.CostPerUnit)
                } : null
            });
        }

        // GET: api/Admin/fooditems/{id}/recipe-details
        [HttpGet("fooditems/{id}/recipe-details")]
        public async Task<ActionResult<object>> GetFoodItemRecipeDetails([FromHeader(Name = "Authorization")] string? authorization, int id)
        {
            var token = authorization?.Replace("Bearer ", "");
            var admin = await GetAdminUser(token);
            if (admin == null)
                return Unauthorized(new { message = "Admin access required" });

            var foodItem = await _context.FoodItems
                .Include(f => f.Recipe)
                    .ThenInclude(r => r.Ingredients)
                    .ThenInclude(i => i.RawMaterial)
                .FirstOrDefaultAsync(f => f.Id == id);

            if (foodItem == null)
                return NotFound(new { message = "Food item not found" });

            if (foodItem.Recipe == null)
                return NotFound(new { message = "This item does not have a recipe" });

            // Calculate max quantity that can be made based on current stock
            int maxQuantity = int.MaxValue;
            foreach (var ingredient in foodItem.Recipe.Ingredients)
            {
                if (ingredient.QuantityNeeded > 0)
                {
                    int possibleQty = (int)(ingredient.RawMaterial.CurrentStock / ingredient.QuantityNeeded);
                    maxQuantity = Math.Min(maxQuantity, possibleQty);
                }
            }

            if (maxQuantity == int.MaxValue)
                maxQuantity = 0;

            return Ok(new
            {
                foodItemId = foodItem.Id,
                foodItemName = foodItem.Name,
                foodItemPrice = foodItem.Price,
                preparedStock = foodItem.PreparedStock,
                totalRecipeCost = foodItem.Recipe.Ingredients.Sum(i => i.QuantityNeeded * i.RawMaterial.CostPerUnit),
                profitPerItem = foodItem.ProfitMargin,
                maxQuantityCanMake = maxQuantity,
                ingredients = foodItem.Recipe.Ingredients.Select(i => new
                {
                    materialId = i.RawMaterialId,
                    materialName = i.RawMaterial.Name,
                    quantityNeeded = i.QuantityNeeded,
                    unit = i.RawMaterial.Unit,
                    costPerUnit = i.RawMaterial.CostPerUnit,
                    totalCost = i.QuantityNeeded * i.RawMaterial.CostPerUnit,
                    currentStock = i.RawMaterial.CurrentStock,
                    isLowStock = i.RawMaterial.CurrentStock < i.RawMaterial.MinimumStock
                }).ToList()
            });
        }

        // PUT: api/Admin/fooditems/{id}
        [HttpPut("fooditems/{id}")]
        public async Task<ActionResult> UpdateFoodItem([FromHeader(Name = "Authorization")] string? authorization, int id, [FromBody] UpdateFoodItemRequest request)
        {
            var token = authorization?.Replace("Bearer ", "");
            var admin = await GetAdminUser(token);
            if (admin == null)
                return Unauthorized(new { message = "Admin access required" });

            if (id != request.FoodItem.Id)
                return BadRequest(new { message = "ID mismatch" });

            var existingItem = await _context.FoodItems.FindAsync(id);
            if (existingItem == null)
                return NotFound(new { message = "Food item not found" });

            // Update basic properties
            existingItem.Name = request.FoodItem.Name;
            existingItem.Description = request.FoodItem.Description;
            existingItem.Category = request.FoodItem.Category;
            existingItem.ImageUrl = request.FoodItem.ImageUrl;
            existingItem.IsAvailable = request.FoodItem.IsAvailable;
            existingItem.IsDeal = request.FoodItem.IsDeal;
            existingItem.IsDirectPurchase = request.FoodItem.IsDirectPurchase;
            existingItem.DirectPurchaseCost = request.FoodItem.DirectPurchaseCost;

            // Calculate price based on item type
            if (request.FoodItem.IsDirectPurchase)
            {
                // For direct purchase items
                if (!request.FoodItem.DirectPurchaseCost.HasValue || request.FoodItem.DirectPurchaseCost <= 0)
                {
                    return BadRequest(new { message = "DirectPurchaseCost is required for direct purchase items" });
                }

                // Apply 35% profit margin: Price = Cost * 1.35
                existingItem.Price = request.FoodItem.DirectPurchaseCost.Value * 1.35m;
                existingItem.ProfitMargin = request.FoodItem.DirectPurchaseCost.Value * 0.35m;

                // Remove recipe if it was previously recipe-based
                var oldRecipe = await _context.Recipes
                    .Include(r => r.Ingredients)
                    .FirstOrDefaultAsync(r => r.FoodItemId == id);
                if (oldRecipe != null)
                {
                    _context.RecipeIngredients.RemoveRange(oldRecipe.Ingredients);
                    _context.Recipes.Remove(oldRecipe);
                }
            }
            else if (request.RecipeIngredients != null && request.RecipeIngredients.Count > 0)
            {
                // Recalculate price from recipe ingredients
                decimal totalCost = 0;
                foreach (var ingredient in request.RecipeIngredients)
                {
                    var material = await _context.RawMaterials.FindAsync(ingredient.RawMaterialId);
                    if (material == null)
                    {
                        return BadRequest(new { message = $"Raw material with ID {ingredient.RawMaterialId} not found" });
                    }
                    totalCost += material.CostPerUnit * ingredient.QuantityNeeded;
                }

                // Add 35% profit margin
                existingItem.Price = totalCost * 1.35m;
                existingItem.ProfitMargin = totalCost * 0.35m;

                // Update or create recipe
                var existingRecipe = await _context.Recipes
                    .Include(r => r.Ingredients)
                    .FirstOrDefaultAsync(r => r.FoodItemId == id);

                if (existingRecipe != null)
                {
                    // Remove old ingredients
                    _context.RecipeIngredients.RemoveRange(existingRecipe.Ingredients);
                    existingRecipe.UpdatedDate = DateTime.Now;
                }
                else
                {
                    // Create new recipe
                    existingRecipe = new Recipe
                    {
                        FoodItemId = id,
                        CreatedDate = DateTime.Now
                    };
                    _context.Recipes.Add(existingRecipe);
                }

                await _context.SaveChangesAsync();

                // Add new ingredients
                foreach (var ingredient in request.RecipeIngredients)
                {
                    var recipeIngredient = new RecipeIngredient
                    {
                        RecipeId = existingRecipe.Id,
                        RawMaterialId = ingredient.RawMaterialId,
                        QuantityNeeded = ingredient.QuantityNeeded
                    };
                    _context.RecipeIngredients.Add(recipeIngredient);
                }
            }
            else if (request.FoodItem.Price > 0)
            {
                // Manual price update - keep provided price
                existingItem.Price = request.FoodItem.Price;
            }

            if (request.FoodItem.OriginalPrice.HasValue)
            {
                existingItem.OriginalPrice = request.FoodItem.OriginalPrice;
            }

            await _context.SaveChangesAsync();

            return Ok(new { message = "Food item updated successfully", item = existingItem });
        }

        // DELETE: api/Admin/fooditems/{id}
        [HttpDelete("fooditems/{id}")]
        public async Task<ActionResult> DeleteFoodItem([FromHeader(Name = "Authorization")] string? authorization, int id)
        {
            var token = authorization?.Replace("Bearer ", "");
            var admin = await GetAdminUser(token);
            if (admin == null)
                return Unauthorized(new { message = "Admin access required" });

            var foodItem = await _context.FoodItems.FindAsync(id);
            if (foodItem == null)
                return NotFound(new { message = "Food item not found" });

            _context.FoodItems.Remove(foodItem);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Food item deleted successfully" });
        }

        // POST: api/Admin/fooditems/{id}/prepare
        [HttpPost("fooditems/{id}/prepare")]
        public async Task<ActionResult> PrepareItems([FromHeader(Name = "Authorization")] string? authorization, int id, [FromBody] PrepareItemsRequest request)
        {
            var token = authorization?.Replace("Bearer ", "");
            var admin = await GetAdminUser(token);
            if (admin == null)
                return Unauthorized(new { message = "Admin access required" });

            if (request.Quantity <= 0)
                return BadRequest(new { message = "Quantity must be greater than 0" });

            // Get the food item with its recipe
            var foodItem = await _context.FoodItems
                .Include(f => f.Recipe)
                    .ThenInclude(r => r.Ingredients)
                    .ThenInclude(i => i.RawMaterial)
                .FirstOrDefaultAsync(f => f.Id == id);

            if (foodItem == null)
                return NotFound(new { message = "Food item not found" });

            if (foodItem.Recipe == null || !foodItem.Recipe.Ingredients.Any())
                return BadRequest(new { message = "This item does not have a recipe" });

            // Check if we have enough stock for all ingredients
            var insufficientStock = new List<string>();
            foreach (var ingredient in foodItem.Recipe.Ingredients)
            {
                var requiredQty = ingredient.QuantityNeeded * request.Quantity;
                if (ingredient.RawMaterial.CurrentStock < requiredQty)
                {
                    insufficientStock.Add($"{ingredient.RawMaterial.Name}: Need {requiredQty} {ingredient.RawMaterial.Unit}, only have {ingredient.RawMaterial.CurrentStock} {ingredient.RawMaterial.Unit}");
                }
            }

            if (insufficientStock.Any())
            {
                return BadRequest(new
                {
                    message = "Insufficient stock to prepare items",
                    details = insufficientStock
                });
            }

            // Deduct stock from all ingredients
            foreach (var ingredient in foodItem.Recipe.Ingredients)
            {
                var material = ingredient.RawMaterial;
                material.CurrentStock -= ingredient.QuantityNeeded * request.Quantity;
            }

            // Increment prepared stock
            foodItem.PreparedStock += request.Quantity;

            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = $"Successfully prepared {request.Quantity} x {foodItem.Name}",
                itemsPrepared = request.Quantity,
                totalPreparedStock = foodItem.PreparedStock,
                updatedMaterials = foodItem.Recipe.Ingredients.Select(i => new
                {
                    materialName = i.RawMaterial.Name,
                    newStock = i.RawMaterial.CurrentStock,
                    unit = i.RawMaterial.Unit
                }).ToList()
            });
        }

        #endregion

        #region Orders Management

        // GET: api/Admin/orders
        [HttpGet("orders")]
        public async Task<ActionResult<IEnumerable<object>>> GetAllOrders([FromHeader(Name = "Authorization")] string? authorization)
        {
            var token = authorization?.Replace("Bearer ", "");
            var admin = await GetAdminUser(token);
            if (admin == null)
                return Unauthorized(new { message = "Admin access required" });

            var orders = await _context.Orders
                .Include(o => o.OrderItems)
                .OrderByDescending(o => o.OrderDate)
                .ToListAsync();

            return Ok(orders.Select(o => new
            {
                o.Id,       
                o.CustomerName,
                CustomerEmail = o.Email,
                CustomerPhone = o.Phone,
                DeliveryAddress = o.Address,
                o.Notes,
                o.PaymentMethod,
                o.TotalAmount,
                o.Status,
                o.OrderDate,
                Items = o.OrderItems.Select(oi => new
                {
                    oi.FoodItemName,
                    Name = oi.FoodItemName,
                    oi.Quantity,
                    oi.Price,
                    TotalPrice = oi.Price * oi.Quantity 
                }).ToList()
            }));
        }

        // PUT: api/Admin/orders/{id}/status
        [HttpPut("orders/{id}/status")]
        public async Task<ActionResult> UpdateOrderStatus([FromHeader(Name = "Authorization")] string? authorization, int id, [FromBody] UpdateOrderStatusRequest request)
        {
            var token = authorization?.Replace("Bearer ", "");
            var admin = await GetAdminUser(token);
            if (admin == null)
                return Unauthorized(new { message = "Admin access required" });

            var order = await _context.Orders.FindAsync(id);
            if (order == null)
                return NotFound(new { message = "Order not found" });

            order.Status = request.Status;
            await _context.SaveChangesAsync();

            return Ok(new { message = "Order status updated successfully", order });
        }

        // GET: api/Admin/orders/{id}
        [HttpGet("orders/{id}")]
        public async Task<ActionResult<Order>> GetOrderById([FromHeader(Name = "Authorization")] string? authorization, int id)
        {
            var token = authorization?.Replace("Bearer ", "");
            var admin = await GetAdminUser(token);
            if (admin == null)
                return Unauthorized(new { message = "Admin access required" });

            var order = await _context.Orders
                .Include(o => o.OrderItems)
                .FirstOrDefaultAsync(o => o.Id == id);

            if (order == null)
                return NotFound(new { message = "Order not found" });

            return Ok(order);
        }

        #endregion

        #region Users Management

        // GET: api/Admin/users
        [HttpGet("users")]
        public async Task<ActionResult<IEnumerable<object>>> GetAllUsers([FromHeader(Name = "Authorization")] string? authorization)
        {
            var token = authorization?.Replace("Bearer ", "");
            var admin = await GetAdminUser(token);
            if (admin == null)
                return Unauthorized(new { message = "Admin access required" });

            var users = await _context.Users
                .Select(u => new
                {
                    u.Id,
                    u.Name,
                    u.Email,
                    u.Role
                })
                .ToListAsync();

            return Ok(users);
        }

        // PUT: api/Admin/users/{id}/role
        [HttpPut("users/{id}/role")]
        public async Task<ActionResult> UpdateUserRole([FromHeader(Name = "Authorization")] string? authorization, int id, [FromBody] UpdateUserRoleRequest request)
        {
            var token = authorization?.Replace("Bearer ", "");
            var admin = await GetAdminUser(token);
            if (admin == null)
                return Unauthorized(new { message = "Admin access required" });

            var user = await _context.Users.FindAsync(id);
            if (user == null)
                return NotFound(new { message = "User not found" });

            user.Role = request.Role;
            await _context.SaveChangesAsync();

            return Ok(new { message = "User role updated successfully", user = new { user.Id, user.Name, user.Email, user.Role } });
        }

        #endregion

        #region Dashboard Statistics

        // GET: api/Admin/dashboard/stats
        [HttpGet("dashboard/stats")]
        public async Task<ActionResult<object>> GetDashboardStats([FromHeader(Name = "Authorization")] string? authorization)
        {
            var token = authorization?.Replace("Bearer ", "");
            var admin = await GetAdminUser(token);
            if (admin == null)
                return Unauthorized(new { message = "Admin access required" });

            var totalOrders = await _context.Orders.CountAsync();
            var totalCustomers = await _context.Users.Where(u => u.Role == "user").CountAsync();
            var totalRevenue = await _context.Orders.SumAsync(o => (decimal?)o.TotalAmount) ?? 0;
            var totalItems = await _context.FoodItems.CountAsync();

            // Calculate today's profit
            var today = DateTime.Today;
            var tomorrow = today.AddDays(1);
            var todayOrders = await _context.Orders
                .Include(o => o.OrderItems)
                .Where(o => o.OrderDate >= today && o.OrderDate < tomorrow)
                .ToListAsync();

            decimal todayRevenue = todayOrders.Sum(o => o.TotalAmount);
            decimal todayCost = 0;

            foreach (var order in todayOrders)
            {
                foreach (var orderItem in order.OrderItems)
                {
                    var foodItem = await _context.FoodItems
                        .Include(f => f.Recipe)
                            .ThenInclude(r => r.Ingredients)
                            .ThenInclude(i => i.RawMaterial)
                        .FirstOrDefaultAsync(f => f.Id == orderItem.FoodItemId);

                    if (foodItem != null)
                    {
                        if (foodItem.IsDirectPurchase)
                        {
                            todayCost += (foodItem.DirectPurchaseCost ?? 0) * orderItem.Quantity;
                        }
                        else if (foodItem.Recipe != null)
                        {
                            todayCost += foodItem.Recipe.Ingredients
                                .Sum(i => i.QuantityNeeded * i.RawMaterial.CostPerUnit) * orderItem.Quantity;
                        }
                    }
                }
            }

            decimal todayProfit = todayRevenue - todayCost;

            // Get daily sales for last 7 days
            var sevenDaysAgo = DateTime.Now.AddDays(-7);
            var dailySales = await _context.Orders
                .Where(o => o.OrderDate >= sevenDaysAgo)
                .GroupBy(o => o.OrderDate.Date)
                .Select(g => new
                {
                    date = g.Key,
                    revenue = g.Sum(o => o.TotalAmount)
                })
                .OrderBy(x => x.date)
                .ToListAsync();

            // Get orders by status
            var ordersByStatus = await _context.Orders
                .GroupBy(o => o.Status)
                .Select(g => new
                {
                    status = g.Key,
                    count = g.Count()
                })
                .ToListAsync();

            // Get top selling items
            var topSellingItems = await _context.OrderItems
                .GroupBy(oi => oi.FoodItemId)
                .Select(g => new
                {
                    foodItemId = g.Key,
                    name = g.First().FoodItemName,
                    totalQuantity = g.Sum(oi => oi.Quantity),
                    totalRevenue = g.Sum(oi => oi.Price * oi.Quantity)
                })
                .OrderByDescending(x => x.totalQuantity)
                .Take(5)
                .ToListAsync();

            // Get recent orders
            var recentOrders = await _context.Orders
                .Include(o => o.OrderItems)
                .OrderByDescending(o => o.OrderDate)
                .Take(5)
                .Select(o => new
                {
                    id = o.Id,
                    customerName = o.CustomerName,
                    totalAmount = o.TotalAmount,
                    status = o.Status,
                    itemCount = o.OrderItems.Count
                })
                .ToListAsync();

            // Get low stock materials
            var lowStockMaterials = await _context.RawMaterials
                .Where(m => m.IsActive && m.CurrentStock <= m.MinimumStock)
                .Select(m => new
                {
                    m.Id,
                    m.Name,
                    m.CurrentStock,
                    m.MinimumStock,
                    m.Unit
                })
                .ToListAsync();

            return Ok(new
            {
                totalOrders,
                totalCustomers,
                totalRevenue,
                totalItems,
                todayProfit,
                todayRevenue,
                todayCost,
                dailySales,
                ordersByStatus,
                topSellingItems,
                recentOrders,
                lowStockMaterials
            });
        }

        #endregion

        #region Profit Analytics

        // GET: api/Admin/profit/daily
        [HttpGet("profit/daily")]
        public async Task<ActionResult<object>> GetDailyProfit([FromHeader(Name = "Authorization")] string? authorization, [FromQuery] DateTime? date)
        {
            var token = authorization?.Replace("Bearer ", "");
            var admin = await GetAdminUser(token);
            if (admin == null)
                return Unauthorized(new { message = "Admin access required" });

            var targetDate = date ?? DateTime.Today;
            var startDate = targetDate.Date;
            var endDate = targetDate.Date.AddDays(1);

            // Get all orders for the day
            var orders = await _context.Orders
                .Include(o => o.OrderItems)
                .Where(o => o.OrderDate >= startDate && o.OrderDate < endDate)
                .ToListAsync();

            decimal totalRevenue = orders.Sum(o => o.TotalAmount);
            decimal totalCost = 0;
            var itemBreakdown = new List<object>();

            // Calculate cost for each order item
            foreach (var order in orders)
            {
                foreach (var orderItem in order.OrderItems)
                {
                    var foodItem = await _context.FoodItems
                        .Include(f => f.Recipe)
                            .ThenInclude(r => r.Ingredients)
                            .ThenInclude(i => i.RawMaterial)
                        .FirstOrDefaultAsync(f => f.Id == orderItem.FoodItemId);

                    if (foodItem == null) continue;

                    decimal itemCost = 0;
                    decimal itemProfit = 0;

                    if (foodItem.IsDirectPurchase)
                    {
                        // For direct purchase items like Mojo
                        itemCost = (foodItem.DirectPurchaseCost ?? 0) * orderItem.Quantity;
                        itemProfit = foodItem.ProfitMargin * orderItem.Quantity;
                    }
                    else if (foodItem.Recipe != null)
                    {
                        // Calculate from recipe
                        itemCost = foodItem.Recipe.Ingredients
                            .Sum(i => i.QuantityNeeded * i.RawMaterial.CostPerUnit) * orderItem.Quantity;
                        itemProfit = (foodItem.Price - foodItem.Recipe.Ingredients
                            .Sum(i => i.QuantityNeeded * i.RawMaterial.CostPerUnit)) * orderItem.Quantity;
                    }

                    totalCost += itemCost;

                    // Add to breakdown
                    var existingItem = itemBreakdown.FirstOrDefault(i =>
                        ((dynamic)i).foodItemName == orderItem.FoodItemName);

                    if (existingItem != null)
                    {
                        var item = (dynamic)existingItem;
                        item.quantitySold += orderItem.Quantity;
                        item.revenue += orderItem.Price * orderItem.Quantity;
                        item.cost += itemCost;
                        item.profit += itemProfit;
                    }
                    else
                    {
                        itemBreakdown.Add(new
                        {
                            foodItemId = orderItem.FoodItemId,
                            foodItemName = orderItem.FoodItemName,
                            quantitySold = orderItem.Quantity,
                            revenue = orderItem.Price * orderItem.Quantity,
                            cost = itemCost,
                            profit = itemProfit
                        });
                    }
                }
            }

            decimal totalProfit = totalRevenue - totalCost;

            return Ok(new
            {
                date = targetDate.ToString("yyyy-MM-dd"),
                totalRevenue,
                totalCost,
                totalProfit,
                profitMargin = totalRevenue > 0 ? (totalProfit / totalRevenue * 100) : 0,
                totalOrders = orders.Count,
                itemBreakdown
            });
        }

        // GET: api/Admin/profit/weekly
        [HttpGet("profit/weekly")]
        public async Task<ActionResult<object>> GetWeeklyProfit([FromHeader(Name = "Authorization")] string? authorization)
        {
            var token = authorization?.Replace("Bearer ", "");
            var admin = await GetAdminUser(token);
            if (admin == null)
                return Unauthorized(new { message = "Admin access required" });

            var last7Days = new List<object>();

            for (int i = 6; i >= 0; i--)
            {
                var date = DateTime.Today.AddDays(-i);
                var result = await GetDailyProfit(authorization, date);

                if (result.Result is OkObjectResult okResult)
                {
                    last7Days.Add(okResult.Value);
                }
            }

            return Ok(new
            {
                weekStart = DateTime.Today.AddDays(-6).ToString("yyyy-MM-dd"),
                weekEnd = DateTime.Today.ToString("yyyy-MM-dd"),
                dailyData = last7Days,
                totalProfit = last7Days.Sum(d => (decimal)((dynamic)d).totalProfit),
                totalRevenue = last7Days.Sum(d => (decimal)((dynamic)d).totalRevenue),
                totalCost = last7Days.Sum(d => (decimal)((dynamic)d).totalCost)
            });
        }

        // GET: api/Admin/profit/materials-usage
        [HttpGet("profit/materials-usage")]
        public async Task<ActionResult<object>> GetMaterialsUsage([FromHeader(Name = "Authorization")] string? authorization, [FromQuery] DateTime? startDate, [FromQuery] DateTime? endDate)
        {
            var token = authorization?.Replace("Bearer ", "");
            var admin = await GetAdminUser(token);
            if (admin == null)
                return Unauthorized(new { message = "Admin access required" });

            var start = startDate ?? DateTime.Today;
            var end = endDate ?? DateTime.Today.AddDays(1);

            // Get all orders in date range
            var orders = await _context.Orders
                .Include(o => o.OrderItems)
                .Where(o => o.OrderDate >= start && o.OrderDate < end)
                .ToListAsync();

            var materialUsage = new Dictionary<int, dynamic>();

            foreach (var order in orders)
            {
                foreach (var orderItem in order.OrderItems)
                {
                    var foodItem = await _context.FoodItems
                        .Include(f => f.Recipe)
                            .ThenInclude(r => r.Ingredients)
                            .ThenInclude(i => i.RawMaterial)
                        .FirstOrDefaultAsync(f => f.Id == orderItem.FoodItemId);

                    if (foodItem?.Recipe != null)
                    {
                        foreach (var ingredient in foodItem.Recipe.Ingredients)
                        {
                            var usedQuantity = ingredient.QuantityNeeded * orderItem.Quantity;
                            var usedCost = usedQuantity * ingredient.RawMaterial.CostPerUnit;

                            if (materialUsage.ContainsKey(ingredient.RawMaterialId))
                            {
                                materialUsage[ingredient.RawMaterialId].quantityUsed += usedQuantity;
                                materialUsage[ingredient.RawMaterialId].totalCost += usedCost;
                            }
                            else
                            {
                                materialUsage[ingredient.RawMaterialId] = new
                                {
                                    materialId = ingredient.RawMaterialId,
                                    materialName = ingredient.RawMaterial.Name,
                                    unit = ingredient.RawMaterial.Unit,
                                    costPerUnit = ingredient.RawMaterial.CostPerUnit,
                                    quantityUsed = usedQuantity,
                                    currentStock = ingredient.RawMaterial.CurrentStock,
                                    totalCost = usedCost
                                };
                            }
                        }
                    }
                }
            }

            return Ok(new
            {
                startDate = start.ToString("yyyy-MM-dd"),
                endDate = end.ToString("yyyy-MM-dd"),
                materialsUsed = materialUsage.Values.ToList(),
                totalMaterialCost = materialUsage.Values.Sum(m => m.totalCost)
            });
        }

        #endregion
    }

    public class UpdateOrderStatusRequest
    {
        public string Status { get; set; } = string.Empty;
    }

    public class UpdateUserRoleRequest
    {
        public string Role { get; set; } = string.Empty;
    }
}