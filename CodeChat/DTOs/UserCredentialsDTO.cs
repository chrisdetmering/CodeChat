namespace CodeChat.DTOs
{

    //DTO stands for Data Transfer Object.
    //DTOs are simple objects that should not contain any business logic
    //but may contain serialization and deserialization mechanisms
    //for transferring data over the wire.

    public class UserCredentialsDTO
    {
        public string Username { get; set; }
        public string Password { get; set; }
    }
}
