using Microsoft.AspNetCore.Mvc;
using InventoryAPI.Models;
using InventoryAPI.Services;
using System.Collections.Generic;
using InventoryAPI.Interfaces;

namespace InventoryAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserController : ControllerBase
    {
        private readonly IUserService _userService;

        public UserController(IUserService userService)
        {
            _userService = userService;
        }

        [HttpPost("login")]
        public async Task<IActionResult> UserLogin([FromBody] User user)
        {
            return await _userService.UserLogin(user);
        }

        [HttpPost("register")]
        public async Task<IActionResult> UserRegistration([FromBody] User user)
        {
            return await _userService.UserRegistration(user);
        }

        [HttpGet]
        public async Task<IActionResult> GetAllUsers()
        {
            IEnumerable<User> users = await _userService.GetAllUsers();
            return Ok(users);
        }
    }
}
