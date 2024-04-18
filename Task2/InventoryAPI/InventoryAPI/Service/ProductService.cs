using InventoryAPI.Data;
using InventoryAPI.DTOs;
using InventoryAPI.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;


namespace InventoryAPI.Services
{
    public class ProductService : IProductService
    {
        private readonly InventoryContext _context;

        public ProductService(InventoryContext context)
        {
            _context = context;
        }

        public async Task<ActionResult<Product>> AddProduct(ProductDTO productDTO)
        {
            try
            {
                var product = new Product
                {
                    ProductName = productDTO.ProductName,
                    Price = productDTO.Price,
                    CategoryId = productDTO.CategoryId,
                    SupplierId = productDTO.SupplierId
                };
                _context.Products.Add(product);
                await _context.SaveChangesAsync();

                var productsInStore = new StoreProduct
                {
                    ProductId = product.ProductId,
                    StoreId = productDTO.StoreId,
                    Quantity = productDTO.Quantity,
                    MinQuantity = productDTO.MinQuantity
                };
                _context.StoreProducts.Add(productsInStore);
                await _context.SaveChangesAsync();

                return product;
            }
            catch (Exception ex)
            {
                return new BadRequestObjectResult($"Error while adding product: {ex.Message}");
            }
        }

        public async Task<IEnumerable<Product>> GetProductsByStoreId(int storeId)
        {
            try
            {
                var products = await _context.Products
                    .Include(p => p.StoreProducts)
                    .Where(p => p.StoreProducts.Any(ps => ps.StoreId == storeId))
                    .ToListAsync();

                return products;
            }
            catch (Exception ex)
            {
                throw new Exception($"Error while retrieving products: {ex.Message}");
            }
        }
    }
}
