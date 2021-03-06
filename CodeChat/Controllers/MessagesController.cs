using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CodeChat.DataAccess.Models;
using Microsoft.AspNetCore.SignalR;
using CodeChat.Hubs;
using CodeChat.DataAccess.Data;
using CodeChat.Services;
using CodeChat.DTOs;

namespace CodeChat.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MessagesController : ControllerBase
    {
        private readonly ChatContext _context;
        private readonly IHubContext<ChatHub> _hubContext;
        private readonly IUserService _userService;

        public MessagesController(ChatContext context, IHubContext<ChatHub> hubContext, IUserService userService) 
        {
            _context = context;
            _hubContext = hubContext;
            _userService = userService;
        }


        [HttpGet]
        public async Task<ActionResult<Dictionary<Guid, MessageDTOResponse>>> GetMessages()
        {
            var sessionToken = HttpContext.Request.Cookies["sessionToken"];

            var user = _userService.FindUserBySessionToken(sessionToken);

            if (user == null)
            {
                return Unauthorized(new { message = "You are unauthorized" });
            }

            var messages = await _context.Messages
                .Include(m => m.User)
                .ToDictionaryAsync(
                    m => m.Id,
                    m =>
                    {
                        return new MessageDTOResponse
                        {
                            Id = m.Id,
                            ChannelId = m.ChannelId,
                            Username = m.User.Username,
                            Text = m.Text,
                            
                        };
                    }
                );

            return messages;
        }


        [HttpGet("{id}")]
        public async Task<ActionResult<Message>> GetMessage(Guid id)
        {

            var sessionToken = HttpContext.Request.Cookies["sessionToken"];
            if (!_userService.IsAuthorized(sessionToken))
            {
                return Unauthorized(new { message = "You are unauthorized" });
            }

            var message = await _context.Messages.FindAsync(id);

            if (message == null)
            {
                return NotFound();
            }

            return message;
        }

     
        [HttpPut("{id}")]
        public async Task<IActionResult> PutMessage(Guid id, PutMessageDTO msg)
        {

            var sessionToken = HttpContext.Request.Cookies["sessionToken"];
            if (!_userService.IsAuthorized(sessionToken))
            {
                return Unauthorized(new { message = "You are unauthorized" });
            }

            if (id != msg.Id)
            {
                return BadRequest();
            }

            var message = await _context.Messages.FindAsync(id);
            message.Text = msg.Text;

            _context.Entry(message).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!MessageExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }


            var messageDTOResponse = new MessageDTOResponse
            {
                Id = message.Id,
                ChannelId = message.ChannelId,
                Username = message.User.Username,
                Text = message.Text,
                CreatedAt = message.CreatedAt
            };
            return Ok(messageDTOResponse);
        }



        [HttpPost]
        public async Task<ActionResult> PostMessage(NewMessageDTO messageDTO)
        {
            var sessionToken = HttpContext.Request.Cookies["sessionToken"];

            if (!_userService.IsAuthorized(sessionToken))
            {
                return Unauthorized(new { message = "You are unauthorized" });
            }

            try
            {
                
                var user = _userService.FindUserBySessionToken(sessionToken);

                var message = new Message
                {
                    Text = messageDTO.Text,
                    ChannelId = Guid.Parse(messageDTO.ChannelId),
                    UserId = user.Id
                };

               
            
                _context.Messages.Add(message);
                await _context.SaveChangesAsync();


                var msgResponse = new MessageDTOResponse
                {
                    Id = message.Id,
                    Text = message.Text,
                    Username = message.User.Username,
                    ChannelId = message.ChannelId,
                    CreatedAt = message.CreatedAt
                };

                await _hubContext.Clients.All.SendAsync("broadcastMessage", msgResponse);

                return CreatedAtAction("GetMessage", new { id = msgResponse.Id });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = $"{ex.Message}" });
            }
            
        }

       
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteMessage(Guid id)
        {

            var sessionToken = HttpContext.Request.Cookies["sessionToken"];
            if (!_userService.IsAuthorized(sessionToken))
            {
                return Unauthorized(new { message = "You are unauthorized" });
            }



            var message = await _context.Messages.FindAsync(id);
            if (message == null)
            {
                return NotFound();
            }

            _context.Messages.Remove(message);
            await _context.SaveChangesAsync();

            return Ok(id);
        }

        private bool MessageExists(Guid id)
        {
            return _context.Messages.Any(e => e.Id == id);
        }
    }
}
