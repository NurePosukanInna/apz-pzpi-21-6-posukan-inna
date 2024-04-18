using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using InventoryAPI.Models;
using InventoryAPI.Services;
using System;
using System.Threading.Tasks;

namespace InventoryAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SupplierController : ControllerBase
    {
        private readonly ISupplierService _supplierService;

        public SupplierController(ISupplierService supplierService)
        {
            _supplierService = supplierService;
        }

        [HttpPost]
        public async Task<ActionResult<Supplier>> AddSupplier(Supplier supplier)
        {
            if (supplier == null)
            {
                return BadRequest("Supplier data is missing.");
            }

            try
            {
                var addedSupplier = await _supplierService.AddSupplier(supplier);
                return Ok(addedSupplier);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"Error adding supplier: {ex.Message}");
            }
        }
    }
}
