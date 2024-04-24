using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using InventoryAPI.Models;
using InventoryAPI.Data;
using System;
using System.Linq;

namespace InventoryAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DefectiveProductsController : ControllerBase
    {
        private readonly InventoryContext _context;

        public DefectiveProductsController(InventoryContext context)
        {
            _context = context;
        }

        [HttpGet]
        public IActionResult GetAllDefectiveProducts()
        {
            try
            {
                var defectiveProducts = _context.DefectiveProducts.ToList();
                return Ok(defectiveProducts);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"Error while retrieving defective products: {ex.Message}");
            }
        }
    }
}

