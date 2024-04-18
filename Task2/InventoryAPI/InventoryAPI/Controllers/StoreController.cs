// StoreController.cs
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using InventoryAPI.Models;
using InventoryAPI.Services;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace InventoryAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class StoreController : ControllerBase
    {
        private readonly IStoreService _storeService;

        public StoreController(IStoreService storeService)
        {
            _storeService = storeService;
        }

        [HttpPost]
        public async Task<ActionResult<Store>> AddStore(Store store)
        {
            if (store == null)
            {
                return BadRequest("Store data is missing.");
            }

            try
            {
                var addedStore = await _storeService.AddStore(store);
                return Ok(addedStore);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"Error adding store: {ex.Message}");
            }
        }

        [HttpGet("GetStoresByUserId/{userId}")]
        public async Task<ActionResult<IEnumerable<Store>>> GetStoresByUserId(int userId)
        {
            try
            {
                var stores = await _storeService.GetStoresByUserId(userId);
                if (stores == null || !stores.Any())
                {
                    return NotFound("No stores found for the user.");
                }
                return Ok(stores);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"Error retrieving stores: {ex.Message}");
            }
        }

    }
}
