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

        // GET: api/Messages
        [HttpGet]
        public async Task<ActionResult<Dictionary<Guid, Message>>> GetMessages()
        {


            return await _context.Messages.ToDictionaryAsync(
                m => m.Id
                );
        }

        // GET: api/Messages/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Message>> GetMessage(Guid id)
        {
            var message = await _context.Messages.FindAsync(id);

            if (message == null)
            {
                return NotFound();
            }

            return message;
        }

        // PUT: api/Messages/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutMessage(Guid id, Message message)
        {
            if (id != message.Id)
            {
                return BadRequest();
            }

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

            return NoContent();
        }

        // POST: api/Messages
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult> PostMessage(MessageDTO messageDTO)
        {
            try
            {
                var sessionToken = HttpContext.Request.Cookies["sessionToken"];
                var user = _userService.FindUserBySessionToken(sessionToken);

                var message = new Message
                {
                    Text = messageDTO.Text,
                    ChannelId = Guid.Parse(messageDTO.ChannelId),
                    UserId = user.Id
                };

            
                _context.Messages.Add(message);
                await _context.SaveChangesAsync();
                await _hubContext.Clients.All.SendAsync("broadcastMessage", message);

                return CreatedAtAction("GetMessage", new { id = message.Id });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = $"{ex.Message}" });
            }
            
        }

        // DELETE: api/Messages/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteMessage(Guid id)
        {
            var message = await _context.Messages.FindAsync(id);
            if (message == null)
            {
                return NotFound();
            }

            _context.Messages.Remove(message);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool MessageExists(Guid id)
        {
            return _context.Messages.Any(e => e.Id == id);
        }
    }
}
