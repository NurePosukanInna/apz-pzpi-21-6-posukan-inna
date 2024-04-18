using InventoryAPI.Data;
using InventoryAPI.Interfaces;
using InventoryAPI.Models;
using System;
using System.Threading.Tasks;

namespace InventoryAPI.Services
{
    public class SupplierService : ISupplierService
    {
        private readonly InventoryContext _context;

        public SupplierService(InventoryContext context)
        {
            _context = context;
        }

        public async Task<Supplier> AddSupplier(Supplier supplier)
        {
            try
            {
                _context.Suppliers.Add(supplier);
                await _context.SaveChangesAsync();
                return supplier;
            }
            catch (Exception ex)
            {
                throw new Exception($"Error adding supplier: {ex.Message}");
            }
        }
    }
}
