using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CodeChat.DataAccess.Data;
using CodeChat.DataAccess.Models;
using CodeChat.Services;
using CodeChat.DTOs;

namespace CodeChat.Controllers
{

    [Route("api/[controller]")]
    [ApiController]
    public class ChannelsController : ControllerBase
    {
        private readonly ChatContext _context;
        private readonly IUserService _userService;

        public ChannelsController(ChatContext context, IUserService userService)
        {
            _context = context;
            _userService = userService;
        }

        [HttpGet]
        public async Task<ActionResult<Dictionary<Guid, ChannelDTO>>> GetChannels()
        {
            var sessionToken = HttpContext.Request.Cookies["sessionToken"];
            if (!_userService.IsAuthorized(sessionToken))
            {
                return Unauthorized(new { message = "You are unauthorized" });
            }
            var channels = _context.Channels.Include(c => c.Messages);
           

            return await channels.ToDictionaryAsync(
                    c => c.Id,
                    c => new ChannelDTO
                    {
                        Id = c.Id,
                        Name = c.Name,
                        Messages = c.Messages.Select(m => m.Id)
                    }
              );
        }

        
        [HttpPost]
        public async Task<ActionResult<Channel>> PostChannel(Channel channel)
        {
            var sessionToken = HttpContext.Request.Cookies["sessionToken"];
            if (!_userService.IsAuthorized(sessionToken))
            {
                return Unauthorized(new { message = "You are unauthorized" });
            }

            _context.Channels.Add(channel);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetChannel", new { id = channel.Id }, channel);
        }

        
    }
}
