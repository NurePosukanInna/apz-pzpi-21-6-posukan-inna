using InventoryAPI.Models;
using System.Threading.Tasks;

namespace InventoryAPI.Services
{
    public interface ICategoryService
    {
        Task<Category> AddCategory(Category category);
    }
}
