using InventoryAPI.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.EntityFrameworkCore;
using InventoryAPI.Tools;
using InventoryAPI.Interfaces;
using InventoryAPI.Data;

namespace InventoryAPI.Services
{
    public class UserService : IUserService
    {
        private readonly InventoryContext _context;
        private readonly IConfiguration _configuration;

        public UserService(InventoryContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        public async Task<IActionResult> UserLogin(User user)
        {
            try
            {
                string hashedPassword = Password.hashPassword(user.Password);
                var dbUser = await _context.Users
                    .Where(u => u.Email == user.Email && u.Password == hashedPassword)
                    .Select(u => new
                    {
                        u.UserId,
                        u.Email,
                    })
                    .FirstOrDefaultAsync();

                if (dbUser == null)
                {
                    return new BadRequestObjectResult("Email or password is incorrect");
                }

                List<Claim> authClaims = new List<Claim>
                {
                    new Claim(ClaimTypes.Email, dbUser.Email),
                    new Claim("userId", dbUser.UserId.ToString()),
                };

                var token = GenerateToken(authClaims);

                return new OkObjectResult(new
                {
                    token = new JwtSecurityTokenHandler().WriteToken(token),
                    expiration = token.ValidTo
                });
            }
            catch (Exception ex)
            {
                return new BadRequestObjectResult(ex.Message);
            }
        }

        public async Task<IActionResult> UserRegistration(User user)
        {
            try
            {
                var dbUser = await _context.Users.FirstOrDefaultAsync(u => u.Email == user.Email);
                if (dbUser != null)
                {
                    return new BadRequestObjectResult("Email already exists");
                }

                user.Password = Password.hashPassword(user.Password);
                _context.Users.Add(user);
                await _context.SaveChangesAsync();

                return new OkObjectResult("User is successfully registered");
            }
            catch (Exception ex)
            {
                return new BadRequestObjectResult(ex.Message);
            }
        }
        public async Task<IEnumerable<User>> GetAllUsers()
        {
            var users = await _context.Users.ToListAsync();
            return users;
        }

        private JwtSecurityToken GenerateToken(List<Claim> authClaims)
        {
            var authSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["JWT:Secret"]));

            var token = new JwtSecurityToken(
                issuer: _configuration["JWT:ValidIssuer"],
                audience: _configuration["JWT:ValidAudience"],
                expires: DateTime.Now.AddHours(24),
                claims: authClaims,
                signingCredentials: new SigningCredentials(authSigningKey, SecurityAlgorithms.HmacSha256)
            );

            return token;
        }
    }
}
