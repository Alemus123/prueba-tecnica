using Microsoft.AspNetCore.Http; // Necesario para IFormFile
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Prueba_tecnica.DTO;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace Prueba_tecnica.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class JournalsController : ControllerBase
    {
        private readonly JournalDbContext _context;
        private readonly string _uploadPath = Path.Combine(Directory.GetCurrentDirectory(), "Uploads"); // Ruta de subida

        public JournalsController(JournalDbContext context)
        {
            _context = context;
            // Asegúrate de que el directorio existe
            if (!Directory.Exists(_uploadPath))
            {
                Directory.CreateDirectory(_uploadPath);
            }
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<object>>> GetJournals()
        {
            var journals = await _context.Journals
                .Take(1000)
                .Select(j => new
                {
                    j.Id,
                    j.Title,
                    j.Author,
                    // Obtiene el ID del autor comparando con el campo Username en la tabla Users
                    AuthorId = _context.Users.Where(u => u.Username == j.Author).Select(u => u.Id).FirstOrDefault(),
                    j.FilePath
                })
                .ToListAsync();

            return Ok(journals);
        }



        [HttpGet("file/{fileName}")]
        public IActionResult GetFile(string fileName)
        {
            var filePath = Path.Combine(_uploadPath, fileName);
            if (!System.IO.File.Exists(filePath))
            {
                return NotFound();
            }

            var fileBytes = System.IO.File.ReadAllBytes(filePath);
            return File(fileBytes, "application/pdf", fileName);
        }


        [HttpPost]
        public async Task<IActionResult> Insert([FromForm] Journals newJournal, IFormFile publicationFile)
        {
            // Verifica si el archivo fue subido
            if (publicationFile == null || publicationFile.Length == 0)
            {
                return BadRequest(new { Message = "Por favor, sube un archivo PDF." });
            }

            // Verifica que sea un archivo PDF
            if (Path.GetExtension(publicationFile.FileName).ToLower() != ".pdf")
            {
                return BadRequest(new { Message = "El archivo debe ser un PDF." });
            }

            // Verifica si el autor existe en la base de datos
            var authorExists = await _context.Users.AnyAsync(u => u.Username == newJournal.Author);
            if (!authorExists)
            {
                return BadRequest(new { Message = "El autor no existe en la base de datos." });
            }

            // Genera un nombre de archivo único para evitar conflictos
            var uniqueFileName = $"{Guid.NewGuid()}{Path.GetExtension(publicationFile.FileName)}";
            var filePath = Path.Combine(_uploadPath, uniqueFileName);

            // Guarda el archivo en el sistema de archivos
            try
            {
                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await publicationFile.CopyToAsync(stream);
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = "Error al guardar el archivo. Inténtalo de nuevo.", Details = ex.Message });
            }

            // Genera la URL completa del archivo
            var fileUrl = $"{Request.Scheme}://{Request.Host}{Url.Action(nameof(GetFile), new { fileName = uniqueFileName })}";

            // Establece la ruta del archivo en el nuevo diario
            newJournal.FilePath = fileUrl;

            // Agrega el nuevo journal al contexto
            _context.Journals.Add(newJournal);
            await _context.SaveChangesAsync();

            // Enviar respuesta sin el ID
            var response = new
            {
                newJournal.Title,
                newJournal.Author,
                newJournal.FilePath // Esto ahora es una URL
            };

            return CreatedAtAction(nameof(GetJournals), response);
        }

        }

    }
