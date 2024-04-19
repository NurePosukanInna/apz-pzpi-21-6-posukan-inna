using System.Linq;
using Microsoft.AspNetCore.Mvc;
using InventoryAPI.DTO;
using InventoryAPI.Models;
using InventoryAPI.Data;
using Microsoft.EntityFrameworkCore;

namespace InventoryAPI.Services
{
    public class SupplierRequestService : ISupplierRequestService
    {
        private readonly InventoryContext _context;

        public SupplierRequestService(InventoryContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<SupplierRequest>> GetAllRequests()
        {
            return await _context.SupplierRequests.ToListAsync();
        }

        public async Task<IActionResult> UpdateStatus(int id, UpdateStatusDto updateDto)
        {
            var request = _context.SupplierRequests.FirstOrDefault(r => r.RequestId == id);
            if (request == null)
            {
                return new NotFoundResult();
            }

            var oldStatus = request.RequestStatus;

            if (oldStatus == "Completed")
            {
                return new BadRequestObjectResult("The status cannot be updated because the order has already been completed.");
            }

            request.RequestStatus = updateDto.RequestStatus;

            if (updateDto.RequestStatus == "Completed" && oldStatus != "Completed")
            {
                var storeProduct = _context.StoreProducts.FirstOrDefault(sp => sp.StoreProductId == request.StoreProductId);

                if (storeProduct != null)
                {
                    storeProduct.Quantity += request.Quantity;
                }
            }

            await _context.SaveChangesAsync();

            return new OkObjectResult(request);
        }

        public async Task<IActionResult> DeleteRequest(int id)
        {
            var request = await _context.SupplierRequests.FindAsync(id);
            if (request == null)
            {
                return new BadRequestObjectResult($"Requesr with ID {id} not found.");
            }

            _context.SupplierRequests.Remove(request);
            await _context.SaveChangesAsync();

            return new OkObjectResult($"Request with ID {id} deleted successfully.");
        }
    }
}
