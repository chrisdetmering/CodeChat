using System;
namespace CodeChat.DTOs
{
    public class NewMessageDTO
    {
        public string Text { get; set; }
        public string ChannelId { get; set; }
    }

    public class PutMessageDTO
    {
        public Guid Id { get; set; }
        public string Text { get; set; }
        public string ChannelId { get; set; }
    }


    public class MessageDTOResponse
    {
        public Guid Id { get; set; }
        public string Text { get; set; }
        public string Username { get; set; }
        public Guid ChannelId { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
