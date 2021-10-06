using System;
using System.Collections.Generic;

namespace CodeChat.DTOs
{
    public class ChannelDTO
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public IEnumerable<Guid> Messages { get; set; }
       
    }
}
