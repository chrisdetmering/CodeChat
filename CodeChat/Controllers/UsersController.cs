using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CodeChat.DataAccess.Data;
using CodeChat.DataAccess.Models;
using CodeChat.DTOs;
using System.Security.Cryptography;

namespace CodeChat.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        
        private readonly ChatContext _context;

        public UsersController(ChatContext context)
        {
            _context = context;
        }

        // GET: api/Users
        [HttpGet]
        public async Task<ActionResult<Dictionary<Guid, User>>> GetUsers()
        {
            return await _context.Users.ToDictionaryAsync(
                u => u.Id
                );
        }

        // GET: api/Users/5
        [HttpGet("{id}")]
        public async Task<ActionResult<User>> GetUser(Guid id)
        {
            var user = await _context.Users.FindAsync(id);

            if (user == null)
            {
                return NotFound();
            }

            return user;
        }

        // PUT: api/Users/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutUser(Guid id, User user)
        {
            if (id != user.Id)
            {
                return BadRequest();
            }

            _context.Entry(user).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!UserExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/Users
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<User>> PostUser(UserCredentialsDTO userCredentials)
        {
            

            if (UserExistsByUserName(userCredentials.Username))
            {
                return Conflict(new { message = "Username already exists" });
            }
            
      
            if (!IsValidPassword(userCredentials.Password))
            {
                return BadRequest(new { message = "Invalid password" });
            }

            var passwordDigest = BCrypt.Net.BCrypt.HashPassword(userCredentials.Username);

            //Generates sessionToken
            var sessionToken = CreateSessionToken();

            var user = new User
            {
                Username = userCredentials.Username,
                PasswordDigest = passwordDigest,
                SessionToken = sessionToken
            };

            try
            {
                _context.Users.Add(user);
                await _context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                if (!UserExistsByUserName(user.Username))
                {
                    return BadRequest(new { message = $"{ex}" });
                }

                throw;
      
            }

            var userDTO = new UserLoggedInDTO()
            {
                Username = user.Username,
                SessionToken = user.SessionToken,
            };

            return CreatedAtAction("GetUser", new { id = user.Id }, userDTO);
        }

        // DELETE: api/Users/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(Guid id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null)
            {
                return NotFound();
            }

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool UserExists(Guid id)
        {
            return _context.Users.Any(e => e.Id == id);
        }

        private bool UserExistsByUserName(string username)
        {
            return _context.Users.Any(e => e.Username == username);
        }

        private static bool IsValidPassword(string password) {

            return password.Length >= 8; 
        }

        private static string CreateSessionToken()
        {
            var crypt = new RNGCryptoServiceProvider();
            var buf = new byte[10];
            crypt.GetBytes(buf);
            crypt.Dispose();
            return Convert.ToBase64String(buf);
        }
    }
}
