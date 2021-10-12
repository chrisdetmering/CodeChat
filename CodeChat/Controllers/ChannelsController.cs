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
using Microsoft.AspNetCore.SignalR;
using CodeChat.Hubs;

namespace CodeChat.Controllers
{

    [Route("api/[controller]")]
    [ApiController]
    public class ChannelsController : ControllerBase
    {
        private readonly ChatContext _context;
        private readonly IUserService _userService;
        private readonly IHubContext<ChatHub> _hubContext;


        public ChannelsController(ChatContext context, IUserService userService, IHubContext<ChatHub> hubContext)
        {
            _context = context;
            _userService = userService;
            _hubContext = hubContext;
        }

        [HttpGet]
        public async Task<ActionResult<Dictionary<Guid, ChannelResponseDTO>>> GetChannels()
        {
            var sessionToken = HttpContext.Request.Cookies["sessionToken"];
            if (!_userService.IsAuthorized(sessionToken))
            {
                return Unauthorized(new { message = "You are unauthorized" });
            }
            var channels = _context.Channels.Include(c => c.Messages);
           

            return await channels.ToDictionaryAsync(
                    c => c.Id,
                    c => new ChannelResponseDTO
                    {
                        Id = c.Id,
                        Name = c.Name,
                        MessagesIds = c.Messages.OrderBy(m => m.CreatedAt).Select(m => m.Id)
                    }
              );
        }
    }
}
