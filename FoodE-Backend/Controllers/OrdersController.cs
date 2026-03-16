using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using FoodE_Backend.Data;
using FoodE_Backend.Model;

namespace FoodE_Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrdersController : ControllerBase
    {
        private readonly AppDbContext _context;

        public OrdersController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/Orders
        [HttpGet]
        public async Task<ActionResult<IEnumerable<object>>> GetOrders()
        {
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

        // GET: api/Orders/5
        [HttpGet("{id}")]
        public async Task<ActionResult<object>> GetOrder(int id)
        {
            var order = await _context.Orders
                .Include(o => o.OrderItems)
                .FirstOrDefaultAsync(o => o.Id == id);

            if (order == null)
            {
                return NotFound();
            }

            return Ok(new
            {
                order.Id,
                order.CustomerName,
                CustomerEmail = order.Email,
                CustomerPhone = order.Phone,
                DeliveryAddress = order.Address,
                order.Notes,
                order.PaymentMethod,
                order.TotalAmount,
                order.Status,
                order.OrderDate,
                Items = order.OrderItems.Select(oi => new
                {
                    oi.FoodItemName,
                    Name = oi.FoodItemName,
                    oi.Quantity,
                    oi.Price,
                    TotalPrice = oi.Price * oi.Quantity
                }).ToList()
            });
        }

        // POST: api/Orders
        [HttpPost]
        public async Task<ActionResult<object>> PostOrder([FromBody] CreateOrderRequest request)
        {
            // Validate request
            if (request == null || request.Items == null || !request.Items.Any())
                return BadRequest(new { message = "Order must contain at least one item" });

            if (string.IsNullOrWhiteSpace(request.CustomerName) || string.IsNullOrWhiteSpace(request.Phone) || string.IsNullOrWhiteSpace(request.Address))
                return BadRequest(new { message = "Customer name, phone, and address are required" });

            // Log incoming request for debugging
            Console.WriteLine($"=== ORDER REQUEST ===");
            Console.WriteLine($"Customer: {request.CustomerName}");
            Console.WriteLine($"Phone: {request.Phone}");
            Console.WriteLine($"Payment: {request.PaymentMethod}");
            Console.WriteLine($"Items Count: {request.Items.Count}");

            // Create order
            var order = new Order
            {
                CustomerName = request.CustomerName,
                Email = request.Email ?? "",
                Phone = request.Phone,
                Address = request.Address,
                Notes = request.Notes,
                PaymentMethod = request.PaymentMethod ?? "cod", // Default to COD if not specified
                OrderDate = DateTime.Now,
                Status = "Pending",
                OrderItems = new List<OrderItem>() // Initialize the collection
            };

            decimal totalAmount = 0;

            // Process each order item
            foreach (var itemDto in request.Items)
            {
                var foodItem = await _context.FoodItems
                    .Include(f => f.Recipe)
                        .ThenInclude(r => r.Ingredients)
                        .ThenInclude(i => i.RawMaterial)
                    .FirstOrDefaultAsync(f => f.Id == itemDto.FoodItemId);

                if (foodItem == null)
                {
                    Console.WriteLine($"ERROR: Food item {itemDto.FoodItemId} not found");
                    return BadRequest(new { message = $"Food item with ID {itemDto.FoodItemId} not found" });
                }

                if (!foodItem.IsAvailable)
                {
                    Console.WriteLine($"ERROR: {foodItem.Name} is unavailable");
                    return BadRequest(new { message = $"{foodItem.Name} is currently unavailable" });
                }

                Console.WriteLine($"Processing: {foodItem.Name} x{itemDto.Quantity}, Stock: {foodItem.PreparedStock}");

                // Check if we have enough prepared stock
                if (foodItem.PreparedStock < itemDto.Quantity)
                {
                    // Not enough prepared - try to make more if we have raw materials
                    if (foodItem.Recipe != null && foodItem.Recipe.Ingredients.Any())
                    {
                        int needToPrepare = itemDto.Quantity - foodItem.PreparedStock;
                        Console.WriteLine($"Auto-preparing {needToPrepare} units of {foodItem.Name}");

                        // Check if we have enough raw materials
                        foreach (var ingredient in foodItem.Recipe.Ingredients)
                        {
                            var requiredQty = ingredient.QuantityNeeded * needToPrepare;
                            if (ingredient.RawMaterial.CurrentStock < requiredQty)
                            {
                                Console.WriteLine($"ERROR: Insufficient raw material {ingredient.RawMaterial.Name}");
                                return BadRequest(new
                                {
                                    message = $"Insufficient stock for {foodItem.Name}",
                                    details = $"Only {foodItem.PreparedStock} prepared. Need {needToPrepare} more but insufficient raw materials: {ingredient.RawMaterial.Name} (need {requiredQty} {ingredient.RawMaterial.Unit}, have {ingredient.RawMaterial.CurrentStock} {ingredient.RawMaterial.Unit})"
                                });
                            }
                        }

                        // Auto-prepare: Deduct raw materials and increment prepared stock
                        foreach (var ingredient in foodItem.Recipe.Ingredients)
                        {
                            ingredient.RawMaterial.CurrentStock -= ingredient.QuantityNeeded * needToPrepare;
                        }
                        foodItem.PreparedStock += needToPrepare;
                        Console.WriteLine($"Auto-prepared {needToPrepare} units. New stock: {foodItem.PreparedStock}");
                    }
                    else if (foodItem.IsDirectPurchase)
                    {
                        Console.WriteLine($"ERROR: Insufficient stock for direct purchase item {foodItem.Name}");
                        return BadRequest(new
                        {
                            message = $"Insufficient stock for {foodItem.Name}",
                            details = $"Only {foodItem.PreparedStock} available, order requires {itemDto.Quantity}"
                        });
                    }
                }

                // Deduct from prepared stock
                foodItem.PreparedStock -= itemDto.Quantity;
                Console.WriteLine($"Deducted stock for {foodItem.Name}. New stock: {foodItem.PreparedStock}");

                // Add order item
                var orderItem = new OrderItem
                {
                    FoodItemId = foodItem.Id,
                    FoodItemName = foodItem.Name,
                    Quantity = itemDto.Quantity,
                    Price = foodItem.Price
                };

                order.OrderItems.Add(orderItem);
                totalAmount += foodItem.Price * itemDto.Quantity;

                Console.WriteLine($"Added order item: {foodItem.Name} x{itemDto.Quantity} @ ৳{foodItem.Price} = ৳{foodItem.Price * itemDto.Quantity}");
            }

            order.TotalAmount = totalAmount;

            Console.WriteLine($"Order Total: ৳{totalAmount}");
            Console.WriteLine($"Order Items Count: {order.OrderItems.Count}");
            Console.WriteLine($"Payment Method: {order.PaymentMethod}");

            // Add order to context
            _context.Orders.Add(order);

            // Save changes
            await _context.SaveChangesAsync();

            Console.WriteLine($"Order saved with ID: {order.Id}");
            Console.WriteLine($"=== END ORDER REQUEST ===");

            return CreatedAtAction(nameof(GetOrder), new { id = order.Id }, new
            {
                orderId = order.Id,
                status = order.Status,
                totalAmount = order.TotalAmount,
                orderDate = order.OrderDate,
                paymentMethod = order.PaymentMethod,
                itemsCount = order.OrderItems.Count,
                message = "Order placed successfully"
            });
        }

        // PUT: api/Orders/5/status
        [HttpPut("{id}/status")]
        public async Task<IActionResult> UpdateOrderStatus(int id, [FromBody] OrderStatusUpdate statusUpdate)
        {
            var order = await _context.Orders.FindAsync(id);
            if (order == null)
            {
                return NotFound();
            }

            order.Status = statusUpdate.Status;
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // DELETE: api/Orders/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteOrder(int id)
        {
            var order = await _context.Orders
                .Include(o => o.OrderItems)
                .FirstOrDefaultAsync(o => o.Id == id);

            if (order == null)
            {
                return NotFound();
            }

            _context.Orders.Remove(order);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }

    public class OrderStatusUpdate
    {
        public string Status { get; set; }
    }
}
