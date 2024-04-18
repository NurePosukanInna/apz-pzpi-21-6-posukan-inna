using InventoryAPI.Models;
using System.Threading.Tasks;

namespace InventoryAPI.Services
{
    public interface ISupplierService
    {
        Task<Supplier> AddSupplier(Supplier supplier);
    }
}
