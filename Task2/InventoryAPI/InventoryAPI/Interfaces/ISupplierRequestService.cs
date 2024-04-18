using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using InventoryAPI.DTO;
using InventoryAPI.Models;

namespace InventoryAPI.Services
{
    public interface ISupplierRequestService
    {
        Task<IEnumerable<SupplierRequest>> GetAllRequests();
        Task<IActionResult> UpdateStatus(int id, UpdateStatusDto updateDto);
    }
}
