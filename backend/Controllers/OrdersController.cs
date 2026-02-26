using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using backend.Data;
using backend.Models;
using backend.DTOs;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class OrdersController : ControllerBase
{
    private readonly AppDbContext _context;

    public OrdersController(AppDbContext context)
    {
        _context = context;
    }

    // GET: api/Orders
    [HttpGet]
    public async Task<ActionResult<IEnumerable<OrderResponseDto>>> GetOrders()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (userIdClaim == null)
        {
            return Unauthorized();
        }

        var userId = int.Parse(userIdClaim);

        var orders = await _context.Orders
            .Where(o => o.UserId == userId)
            .Include(o => o.OrderItems)
                .ThenInclude(oi => oi.FoodItem)
            .OrderByDescending(o => o.OrderDate)
            .Select(o => new OrderResponseDto
            {
                OrderId = o.Id,
                Status = o.Status,
                TotalAmount = o.TotalAmount,
                DeliveryAddress = o.DeliveryAddress,
                PaymentMethod = o.PaymentMethod,
                OrderDate = o.OrderDate,
                Items = o.OrderItems.Select(oi => new OrderItemResponseDto
                {
                    Id = oi.Id,
                    FoodItemName = oi.FoodItem.Name,
                    Quantity = oi.Quantity,
                    UnitPrice = oi.UnitPrice,
                    TotalPrice = oi.TotalPrice
                }).ToList()
            })
            .ToListAsync();

        return Ok(orders);
    }

    // GET: api/Orders/5
    [HttpGet("{id}")]
    public async Task<ActionResult<OrderResponseDto>> GetOrder(int id)
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (userIdClaim == null)
        {
            return Unauthorized();
        }

        var userId = int.Parse(userIdClaim);

        var order = await _context.Orders
            .Where(o => o.Id == id && o.UserId == userId)
            .Include(o => o.OrderItems)
                .ThenInclude(oi => oi.FoodItem)
            .Select(o => new OrderResponseDto
            {
                OrderId = o.Id,
                Status = o.Status,
                TotalAmount = o.TotalAmount,
                DeliveryAddress = o.DeliveryAddress,
                PaymentMethod = o.PaymentMethod,
                OrderDate = o.OrderDate,
                Items = o.OrderItems.Select(oi => new OrderItemResponseDto
                {
                    Id = oi.Id,
                    FoodItemName = oi.FoodItem.Name,
                    Quantity = oi.Quantity,
                    UnitPrice = oi.UnitPrice,
                    TotalPrice = oi.TotalPrice
                }).ToList()
            })
            .FirstOrDefaultAsync();

        if (order == null)
        {
            return NotFound();
        }

        return Ok(order);
    }

    // POST: api/Orders
    [HttpPost]
    public async Task<ActionResult<OrderResponseDto>> CreateOrder(CreateOrderDto orderDto)
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (userIdClaim == null)
        {
            return Unauthorized();
        }

        var userId = int.Parse(userIdClaim);

        // Validate food items and calculate total
        decimal totalAmount = 0;
        var orderItems = new List<OrderItem>();

        foreach (var item in orderDto.Items)
        {
            var foodItem = await _context.FoodItems.FindAsync(item.FoodItemId);
            if (foodItem == null || !foodItem.IsAvailable)
            {
                return BadRequest($"Food item {item.FoodItemId} is not available");
            }

            var itemTotal = foodItem.Price * item.Quantity;
            totalAmount += itemTotal;

            orderItems.Add(new OrderItem
            {
                FoodItemId = item.FoodItemId,
                Quantity = item.Quantity,
                UnitPrice = foodItem.Price,
                TotalPrice = itemTotal
            });
        }

        // Create order
        var order = new Order
        {
            UserId = userId,
            TotalAmount = totalAmount,
            Status = "Pending",
            DeliveryAddress = orderDto.DeliveryAddress,
            PhoneNumber = orderDto.PhoneNumber,
            Notes = orderDto.Notes,
            PaymentMethod = orderDto.PaymentMethod,
            OrderDate = DateTime.UtcNow,
            OrderItems = orderItems
        };

        _context.Orders.Add(order);
        await _context.SaveChangesAsync();

        // Return created order
        var createdOrder = await _context.Orders
            .Where(o => o.Id == order.Id)
            .Include(o => o.OrderItems)
                .ThenInclude(oi => oi.FoodItem)
            .Select(o => new OrderResponseDto
            {
                OrderId = o.Id,
                Status = o.Status,
                TotalAmount = o.TotalAmount,
                DeliveryAddress = o.DeliveryAddress,
                PaymentMethod = o.PaymentMethod,
                OrderDate = o.OrderDate,
                Items = o.OrderItems.Select(oi => new OrderItemResponseDto
                {
                    Id = oi.Id,
                    FoodItemName = oi.FoodItem.Name,
                    Quantity = oi.Quantity,
                    UnitPrice = oi.UnitPrice,
                    TotalPrice = oi.TotalPrice
                }).ToList()
            })
            .FirstOrDefaultAsync();

        return CreatedAtAction(nameof(GetOrder), new { id = order.Id }, createdOrder);
    }

    // PUT: api/Orders/5/status
    [HttpPut("{id}/status")]
    public async Task<IActionResult> UpdateOrderStatus(int id, [FromBody] string status)
    {
        var order = await _context.Orders.FindAsync(id);
        if (order == null)
        {
            return NotFound();
        }

        order.Status = status;
        if (status == "Delivered")
        {
            order.DeliveredAt = DateTime.UtcNow;
        }

        await _context.SaveChangesAsync();

        return NoContent();
    }
}
