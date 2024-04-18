using InventoryAPI.Data;
using InventoryAPI.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Threading.Tasks;

namespace InventoryAPI.Services
{
    public class CategoryService : ICategoryService
    {
        private readonly InventoryContext _context;

        public CategoryService(InventoryContext context)
        {
            _context = context;
        }

        public async Task<Category> AddCategory(Category category)
        {
            try
            {
                _context.Categories.Add(category);
                await _context.SaveChangesAsync();

                return category;
            }
            catch (Exception ex)
            {
                throw new Exception($"Error adding category: {ex.Message}");
            }
        }
    }
}
