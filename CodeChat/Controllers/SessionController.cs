using System;
using System.Threading.Tasks;
using CodeChat.DataAccess.Data;
using CodeChat.DTOs;
using CodeChat.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace CodeChat.Controllers
{

    [Route("api/[controller]")]
    [ApiController]
    public class SessionController : CustomApiController
    {
        private readonly ChatContext _context;
        private readonly IUserService _userService;

        public SessionController(ChatContext context, IUserService userService)
        {
            _context = context;
            _userService = userService;
        }
    

        // Post: api/session
        [HttpPost]
        public async Task<ActionResult<UserLoggedInDTO>> PostSession(UserCredentialsDTO userCredentials)
        {
            var sessionToken = HttpContext.Request.Cookies["sessionToken"];
            if (sessionToken != null) {

                return BadRequest(new { message = "User already logged in" });
            }
          
            try
            {
                var user = await _userService.LoginUser(userCredentials);
                AddSessionTokenToCookies(user.SessionToken, HttpContext);
                var userDTO = _userService.ToDTO(user);

                return userDTO;
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }

          
        }

        ////Delete: api/session
        public async Task<IActionResult> DeleteSession()
        {
            var sessionToken = HttpContext.Request.Cookies["sessionToken"];

            var user =  _userService.FindUserBySessionToken(sessionToken);

            if (user == null) {
                return NotFound(new { message = "No user is logged in with that session token" });
            }

            user.SessionToken = CreateSessionToken();

            try
            {

                await _context.SaveChangesAsync();

                return Ok(new { message = "User logged out" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = $"There was the following error {ex} " });
            }
 
            
        }




    }
}
