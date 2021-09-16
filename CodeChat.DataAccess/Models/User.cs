using System;
using System.Collections.Generic;

namespace CodeChat.DataAccess.Models
{
    public class User: BaseModel
    {
       public Guid Id { get; set; }
       public string Username { get; set; }
       public string PasswordDigest { get; set; }
       public string SessionToken { get; set; }
       public ICollection<Message> Messages { get; set; }
    }
}
