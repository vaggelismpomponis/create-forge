using Server.Models;

namespace Server.DTOs;

public record ItemDto(Guid Id, string Name, string Description, DateTime CreatedAtUtc);

public record CreateItemRequest(string Name, string Description);

/// <summary>
/// Explicit manual projection methods. AutoMapper is strictly forbidden.
/// </summary>
public static class ItemMappingExtensions
{
    public static ItemDto ToDto(this Item item)
    {
        ArgumentNullException.ThrowIfNull(item);
        return new ItemDto(
            item.Id,
            item.Name,
            item.Description,
            item.CreatedAtUtc
        );
    }

    public static Item ToEntity(this CreateItemRequest request)
    {
        ArgumentNullException.ThrowIfNull(request);
        return new Item
        {
            Id = Guid.NewGuid(),
            Name = request.Name,
            Description = request.Description,
            CreatedAtUtc = DateTime.UtcNow
        };
    }
}
