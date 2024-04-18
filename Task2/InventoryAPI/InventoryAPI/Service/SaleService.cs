using InventoryAPI.Data;
using InventoryAPI.Models;
using Microsoft.EntityFrameworkCore;
using System.Linq;

namespace InventoryAPI.Services
{
    public class SaleService : ISaleService
    {
        private readonly InventoryContext _context;

        public SaleService(InventoryContext context)
        {
            _context = context;
        }

        public async Task<Sale> AddSale(Sale sale)
        {
            sale.SaleDate = DateTime.UtcNow;

            _context.Sales.Add(sale);
            await _context.SaveChangesAsync();

            foreach (var salesItem in sale.SaleItems)
            {
                var storeProducts = await _context.StoreProducts
                    .Where(p => p.StoreId == sale.StoreId && p.ProductId == salesItem.ProductId)
                    .FirstOrDefaultAsync();

                if (storeProducts != null)
                {
                    storeProducts.Quantity -= salesItem.Quantity;

                    if (storeProducts.Quantity < storeProducts.MinQuantity)
                    {
                        var request = new SupplierRequest
                        {
                            StoreProductId = storeProducts.StoreProductId,
                            Quantity = storeProducts.MinQuantity - storeProducts.Quantity,
                            TotalAmount = null, 
                            RequestDate = DateTime.UtcNow,
                            RequestStatus = "Pending" 
                        };

                        _context.SupplierRequests.Add(request);

                    }
                }
            }

            await _context.SaveChangesAsync();

            return sale;
        }

        public async Task<IEnumerable<Sale>> GetSalesByStoreId(int storeId)
        {
            var sales = await _context.Sales
                .Include(s => s.SaleItems)
                .Where(s => s.StoreId == storeId)
                .ToListAsync();

            return sales;
        }
    }
}
