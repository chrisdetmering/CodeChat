using System;
namespace CodeChat.DTOs
{
    public class MessageDTO
    {
        public string Text { get; set; }
        public string ChannelId { get; set; }
    }


    public class MessageDTOResponse
    {
        public Guid Id { get; set; }
        public string Text { get; set; }
        public string Username { get; set; }
        public Guid ChannelId { get; set; }
    }
}
