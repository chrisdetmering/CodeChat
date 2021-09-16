using System;
namespace CodeChat.DataAccess.Models
{
    public class Message: BaseModel
    {
        public Guid Id { get; set; }
        public string Text { get; set; }
        public Guid ChannelId { get; set; }
        public Guid UserId { get; set; }
        public User User { get; set; }
        public Channel Channel { get; set; }
    }
}
