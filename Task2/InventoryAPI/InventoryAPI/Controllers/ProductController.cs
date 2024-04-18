using InventoryAPI.DTOs;
using InventoryAPI.Models;
using InventoryAPI.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace InventoryAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductController : ControllerBase
    {
        private readonly IProductService _productService;

        public ProductController(IProductService productService)
        {
            _productService = productService;
        }

        [HttpPost("AddProduct")]
        public async Task<ActionResult<Product>> AddProduct(ProductDTO productDTO)
        {
            try
            {
                var product = await _productService.AddProduct(productDTO);
                return product;
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"Error while adding product: {ex.Message}");
            }
        }

        [HttpGet("GetProductsByStoreId/{storeId}")]
        public async Task<ActionResult<IEnumerable<Product>>> GetProductsByStoreId(int storeId)
        {
            try
            {
                var products = await _productService.GetProductsByStoreId(storeId);
                return Ok(products);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"Error while retrieving products: {ex.Message}");
            }
        }
    }
}
