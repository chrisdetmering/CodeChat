using System;
using System.Collections.Generic;

namespace CodeChat.DataAccess.Models
{
    public class Channel: BaseModel
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public ICollection<Message> Messages { get; set; }
    }
}
