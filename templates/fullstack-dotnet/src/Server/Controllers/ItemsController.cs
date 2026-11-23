using Microsoft.AspNetCore.Mvc;
using Server.DTOs;
using Server.Models;

namespace Server.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ItemsController : ControllerBase
{
    // In-memory demo store; replace with EF Core DbContext with .AsNoTracking() for production
    private static readonly List<Item> Items = new()
    {
        new Item { Name = "First Production Item", Description = "Scaffolded with create-forge" },
        new Item { Name = "Zero AutoMapper Directive", Description = "Strict explicit manual DTO mappings" }
    };

    [HttpGet]
    public async Task<ActionResult<IEnumerable<ItemDto>>> GetItems(CancellationToken cancellationToken)
    {
        // Simulate async operation with cancellationToken propagation
        await Task.Delay(10, cancellationToken);

        var dtos = Items.Select(item => item.ToDto()).ToList();
        return Ok(dtos);
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<ItemDto>> GetItemById(Guid id, CancellationToken cancellationToken)
    {
        await Task.Delay(10, cancellationToken);

        var item = Items.FirstOrDefault(i => i.Id == id);
        if (item is null)
        {
            return NotFound();
        }

        return Ok(item.ToDto());
    }

    [HttpPost]
    public async Task<ActionResult<ItemDto>> CreateItem([FromBody] CreateItemRequest request, CancellationToken cancellationToken)
    {
        await Task.Delay(10, cancellationToken);

        var entity = request.ToEntity();
        Items.Add(entity);

        return CreatedAtAction(nameof(GetItemById), new { id = entity.Id }, entity.ToDto());
    }
}
