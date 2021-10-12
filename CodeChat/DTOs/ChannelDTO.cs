using System;
using System.Collections.Generic;

namespace CodeChat.DTOs
{
    public class ChannelResponseDTO
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public IEnumerable<Guid> MessagesIds { get; set; }
    }

    public class ChannelRequestDTO
    {
        public string Name { get; set; }
    }
}
