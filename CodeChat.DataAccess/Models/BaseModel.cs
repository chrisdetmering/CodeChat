using System;
namespace CodeChat.DataAccess.Models
{
    //the base model/entity class that the models will inherit from.
    //we did this so that we could automatically save CreatedAt & UpdatedAt
    public class BaseModel
    {
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }

}
       
