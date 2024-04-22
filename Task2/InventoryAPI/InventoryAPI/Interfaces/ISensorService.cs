using InventoryAPI.Models;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace InventoryAPI.Service
{
    public interface ISensorService
    {
        Task<Sensor> AddSensor(Sensor sensor);
        Task<bool> DeleteSensor(int sensorId);
    }
}
