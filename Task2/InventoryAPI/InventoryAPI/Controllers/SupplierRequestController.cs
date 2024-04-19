using Microsoft.AspNetCore.Mvc;
using InventoryAPI.DTO;
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
        public async Task<IActionResult> GetAllRequests()
        {
            var requests = await _supplierRequestService.GetAllRequests();
            return Ok(requests);
        }

        [HttpPut("UpdateStatus/{id}")]
        public async Task<IActionResult> UpdateStatus(int id, [FromBody] UpdateStatusDto updateDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            return await _supplierRequestService.UpdateStatus(id, updateDto);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteRequest(int id)
        {
            var result = await _supplierRequestService.DeleteRequest(id);
            return result;
        }
    }
}
