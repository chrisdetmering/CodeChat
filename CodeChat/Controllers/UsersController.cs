using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CodeChat.DataAccess.Data;
using CodeChat.DataAccess.Models;
using CodeChat.DTOs;
using CodeChat.Services;
using Microsoft.AspNetCore.Http;

namespace CodeChat.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : CustomApiController
    {
        
        private readonly ChatContext _context;
        private readonly IUserService _userService;

        public UsersController(ChatContext context, IUserService userService)
        {
            _context = context;
            _userService = userService;
        }

        // GET: api/Users
        //[HttpGet]
        //public async Task<ActionResult<Dictionary<Guid, User>>> GetUsers()
        //{
        //    return await _context.Users.ToDictionaryAsync(
        //        u => u.Id
        //        );
        //}

        // GET: api/Users/5
        //[HttpGet("{id}")]
        //public async Task<ActionResult<User>> GetUser(Guid id)
        //{
        //    var user = await _context.Users.FindAsync(id);

        //    if (user == null)
        //    {
        //        return NotFound();
        //    }

        //    return user;
        //}

        // PUT: api/Users/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        //[HttpPut("{id}")]
        //public async Task<IActionResult> PutUser(Guid id, User user)
        //{
        //    if (id != user.Id)
        //    {
        //        return BadRequest();
        //    }

        //    _context.Entry(user).State = EntityState.Modified;

        //    try
        //    {
        //        await _context.SaveChangesAsync();
        //    }
        //    catch (DbUpdateConcurrencyException)
        //    {
        //        if (!_userService.UserExists(id))
        //        {
        //            return NotFound();
        //        }
        //        else
        //        {
        //            throw;
        //        }
        //    }

        //    return NoContent();
        //}

        // POST: api/Users
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<UserLoggedInDTO>> PostUser(UserCredentialsDTO userCredentials)
        {
            User user;

            try
            {
                user = await _userService.CreateUserAsync(userCredentials);
            } catch(Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }


            AddSessionTokenToCookies(user.SessionToken, HttpContext);

            var userDTO = _userService.ToDTO(user);
            Console.WriteLine(userDTO);
            return CreatedAtAction("GetUser", new { id = user.Id }, userDTO);
        }

        // DELETE: api/Users/5
        //[HttpDelete("{id}")]
        //public async Task<IActionResult> DeleteUser(Guid id)
        //{
        //    var user = await _context.Users.FindAsync(id);
        //    if (user == null)
        //    {
        //        return NotFound();
        //    }

        //    _context.Users.Remove(user);
        //    await _context.SaveChangesAsync();

        //    return NoContent();
        //}
      
    }
}
