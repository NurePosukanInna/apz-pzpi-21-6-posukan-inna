using InventoryAPI.Models;
using InventoryAPI.Service;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;

namespace InventoryAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SensorController : ControllerBase
    {
        private readonly ISensorService _sensorService;

        public SensorController(ISensorService sensorService)
        {
            _sensorService = sensorService;
        }

        [HttpPost]
        public async Task<IActionResult> AddSensor([FromBody] Sensor sensor)
        {
            try
            {
                sensor.Timestamp = DateTime.UtcNow;
                var addedSensor = await _sensorService.AddSensor(sensor);
                return Ok(addedSensor);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpDelete("{sensorId}")]
        public async Task<IActionResult> DeleteSensor(int sensorId)
        {
            try
            {
                var isDeleted = await _sensorService.DeleteSensor(sensorId);
                if (isDeleted)
                {
                    return Ok(true);
                }
                else
                {
                    return NotFound();
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
    }
}
