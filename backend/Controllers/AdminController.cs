using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend.Data;
using backend.Models;
using System.Security.Claims;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "Admin")]
public class AdminController : ControllerBase
{
    private readonly AppDbContext _context;

    public AdminController(AppDbContext context)
    {
        _context = context;
    }

    // GET: api/Admin/dashboard
    [HttpGet("dashboard")]
    public async Task<ActionResult<object>> GetDashboardStats()
    {
        var totalOrders = await _context.Orders.CountAsync();
        var totalRevenue = await _context.Orders.SumAsync(o => o.TotalAmount);
        var totalCustomers = await _context.Users.Where(u => u.Role == "Customer").CountAsync();
        var totalItems = await _context.FoodItems.CountAsync();
        
        var ordersByStatus = await _context.Orders
            .GroupBy(o => o.Status)
            .Select(g => new { Status = g.Key, Count = g.Count() })
            .ToListAsync();

        var recentOrders = await _context.Orders
            .Include(o => o.User)
            .Include(o => o.OrderItems)
                .ThenInclude(oi => oi.FoodItem)
            .OrderByDescending(o => o.OrderDate)
            .Take(10)
            .Select(o => new
            {
                o.Id,
                CustomerName = o.User.Name,
                o.Status,
                o.TotalAmount,
                o.OrderDate,
                ItemCount = o.OrderItems.Count
            })
            .ToListAsync();

        var topSellingItems = await _context.OrderItems
            .GroupBy(oi => new { oi.FoodItemId, oi.FoodItem.Name })
            .Select(g => new
            {
                g.Key.FoodItemId,
                g.Key.Name,
                TotalQuantity = g.Sum(oi => oi.Quantity),
                TotalRevenue = g.Sum(oi => oi.TotalPrice)
            })
            .OrderByDescending(x => x.TotalQuantity)
            .Take(5)
            .ToListAsync();

        var dailySales = await _context.Orders
            .Where(o => o.OrderDate >= DateTime.UtcNow.AddDays(-30))
            .GroupBy(o => o.OrderDate.Date)
            .Select(g => new
            {
                Date = g.Key,
                Orders = g.Count(),
                Revenue = g.Sum(o => o.TotalAmount)
            })
            .OrderBy(x => x.Date)
            .ToListAsync();

        return Ok(new
        {
            totalOrders,
            totalRevenue,
            totalCustomers,
            totalItems,
            ordersByStatus,
            recentOrders,
            topSellingItems,
            dailySales
        });
    }

    // GET: api/Admin/items
    [HttpGet("items")]
    public async Task<ActionResult<IEnumerable<FoodItem>>> GetAllItems()
    {
        return await _context.FoodItems
            .OrderBy(f => f.Category)
            .ThenBy(f => f.Name)
            .ToListAsync();
    }

    // POST: api/Admin/items
    [HttpPost("items")]
    public async Task<ActionResult<FoodItem>> CreateItem(FoodItem item)
    {
        item.CreatedAt = DateTime.UtcNow;
        _context.FoodItems.Add(item);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetAllItems), new { id = item.Id }, item);
    }

    // PUT: api/Admin/items/{id}
    [HttpPut("items/{id}")]
    public async Task<IActionResult> UpdateItem(int id, FoodItem item)
    {
        if (id != item.Id)
        {
            return BadRequest();
        }

        item.UpdatedAt = DateTime.UtcNow;
        _context.Entry(item).State = EntityState.Modified;

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!await _context.FoodItems.AnyAsync(e => e.Id == id))
            {
                return NotFound();
            }
            throw;
        }

        return NoContent();
    }

    // DELETE: api/Admin/items/{id}
    [HttpDelete("items/{id}")]
    public async Task<IActionResult> DeleteItem(int id)
    {
        var item = await _context.FoodItems.FindAsync(id);
        if (item == null)
        {
            return NotFound();
        }

        _context.FoodItems.Remove(item);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    // GET: api/Admin/orders
    [HttpGet("orders")]
    public async Task<ActionResult<IEnumerable<object>>> GetAllOrders()
    {
        var orders = await _context.Orders
            .Include(o => o.User)
            .Include(o => o.OrderItems)
                .ThenInclude(oi => oi.FoodItem)
            .OrderByDescending(o => o.OrderDate)
            .Select(o => new
            {
                o.Id,
                CustomerName = o.User.Name,
                CustomerEmail = o.User.Email,
                CustomerPhone = o.PhoneNumber,
                o.Status,
                o.TotalAmount,
                o.DeliveryAddress,
                o.PaymentMethod,
                o.OrderDate,
                Items = o.OrderItems.Select(oi => new
                {
                    oi.FoodItem.Name,
                    oi.Quantity,
                    oi.UnitPrice,
                    oi.TotalPrice
                }).ToList()
            })
            .ToListAsync();

        return Ok(orders);
    }

    // PUT: api/Admin/orders/{id}/status
    [HttpPut("orders/{id}/status")]
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

    // GET: api/Admin/customers
    [HttpGet("customers")]
    public async Task<ActionResult<IEnumerable<object>>> GetAllCustomers()
    {
        var customers = await _context.Users
            .Where(u => u.Role == "Customer")
            .Select(u => new
            {
                u.Id,
                u.Name,
                u.Email,
                u.PhoneNumber,
                u.Address,
                u.CreatedAt,
                OrderCount = u.Orders.Count,
                TotalSpent = u.Orders.Sum(o => o.TotalAmount)
            })
            .OrderByDescending(c => c.TotalSpent)
            .ToListAsync();

        return Ok(customers);
    }
}
