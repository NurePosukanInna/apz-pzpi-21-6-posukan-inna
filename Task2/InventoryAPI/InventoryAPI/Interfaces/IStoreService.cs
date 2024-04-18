using InventoryAPI.Models;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace InventoryAPI.Services
{
    public interface IStoreService
    {
        Task<Store> AddStore(Store store);
        Task<IEnumerable<Store>> GetStoresByUserId(int userId);
    }
}
