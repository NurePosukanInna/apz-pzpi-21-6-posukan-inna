using Microsoft.AspNetCore.Mvc;
using InventoryAPI.DTO;
using InventoryAPI.Models;
using InventoryAPI.Services;


namespace InventoryAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SupplierRequestController : ControllerBase
    {
        private readonly ISupplierRequestService _supplierRequestService;

        public SupplierRequestController(ISupplierRequestService supplierRequestService)
        {
            _supplierRequestService = supplierRequestService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<SupplierRequest>>> GetAllRequests()
        {
            try
            {
                var requests = await _supplierRequestService.GetAllRequests();
                return Ok(requests);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error while retrieving supplier requests: {ex.Message}");
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateRequest(int id, UpdateRequestDto updateDto)
        {
            try
            {
                var result = await _supplierRequestService.UpdateRequest(id, updateDto);
                return result;
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error while updating supplier request: {ex.Message}");
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteRequest(int id)
        {
            try
            {
                var result = await _supplierRequestService.DeleteRequest(id);
                return result;
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error while deleting supplier request: {ex.Message}");
            }
        }
    }
}
