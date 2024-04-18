using Microsoft.AspNetCore.Mvc;
using InventoryAPI.Models;
using System.Collections.Generic;
using System.Linq;

namespace InventoryAPI.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class UserController : ControllerBase
    {
        private readonly InventoryContext _context;

        public UserController(InventoryContext context)
        {
            _context = context;
        }

        [HttpGet]
        public IEnumerable<User> Get()
        {
            return _context.Users.ToList();
        }
    }
}
