using Microsoft.AspNetCore.Http; // Necesario para IFormFile
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Prueba_tecnica.DTO;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

[Route("api/[controller]")]
[ApiController]
public class SubscriptionsController : ControllerBase
{
    private readonly JournalDbContext _context;

    public SubscriptionsController(JournalDbContext context)
    {
        _context = context;
    }

    /// <summary>
    /// Crea una nueva suscripción.
    /// </summary>
    /// <param name="subscription">Los detalles de la suscripción a crear.</param>
    /// <returns>Una respuesta que indica el resultado de la operación.</returns>
    [HttpPost]
    public async Task<IActionResult> CreateSubscription([FromBody] Subscription subscription)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        _context.Subscriptions.Add(subscription);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetSubscriptions), new { id = subscription.Id }, subscription);
    }

    /// <summary>
    /// Obtiene todas las suscripciones.
    /// </summary>
    /// <returns>Una lista de suscripciones.</returns>
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Subscription>>> GetSubscriptions()
    {
        var subscriptions = await _context.Subscriptions.ToListAsync();
        return Ok(subscriptions);
    }

    /// <summary>
    /// Obtiene suscripciones por ResearcherId.
    /// </summary>
    /// <param name="researcherId">ID del investigador.</param>
    /// <returns>Una lista de suscripciones asociadas al investigador.</returns>
    [HttpGet("researcher/{researcherId}")]
    public async Task<ActionResult<IEnumerable<Subscription>>> GetSubscriptionsByResearcherId(int researcherId)
    {
        var subscriptions = await _context.Subscriptions
            .Where(s => s.ResearcherId == researcherId)
            .ToListAsync();

        if (subscriptions == null || !subscriptions.Any())
        {
            return NotFound(); // Retorna 404 si no se encuentran suscripciones
        }

        return Ok(subscriptions); // Retorna las suscripciones encontradas
    }

    /// <summary>
    /// Elimina una suscripción por SubscriberId.
    /// </summary>
    /// <param name="subscriberId">ID del suscriptor.</param>
    /// <returns>Una respuesta que indica el resultado de la operación.</returns>
    [HttpDelete("{subscriberId}")]
    public async Task<IActionResult> DeleteSubscription(int subscriberId)
    {
        var subscription = await _context.Subscriptions
            .FirstOrDefaultAsync(s => s.SubscriberId == subscriberId);

        if (subscription == null)
        {
            return NotFound(); // Retorna 404 si no se encuentra la suscripción
        }

        _context.Subscriptions.Remove(subscription);
        await _context.SaveChangesAsync();

        return NoContent(); // Retorna 204 No Content si la eliminación es exitosa
    }
}
