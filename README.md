# Code Chat

[See it live!](https://code-chat.azurewebsites.net/)


## Tech Stack

* C#/.NET
* React 
* Redux
* TypeScript 
* Postgres
* SignalR


  
## Features

#### Create New Messages

Implemented live chat with SignalR chatHub 

![hippo](https://media.giphy.com/media/XOW0VwnwkmmCfwh55J/giphy.gif)

#### Edit Messages
Edit messages in real time 

![hippo](https://media.giphy.com/media/6TR86DVZKvDMzx3Ipw/giphy.gif)


#### Delete Messages
You can delete messages, but only your own 

![hippo](https://media.giphy.com/media/UPrRPZUoShpSi8hE5w/giphy.gif)
  
  
## Code Examples

Clean and expressive code 


```c#
public async Task<User> CreateUserAsync(UserCredentialsDTO userCredentials)
        {

            if (UserExistsByUserName(userCredentials.Username))
            {
                throw new Exception("Username already exists");
            }


            if (!IsValidPassword(userCredentials.Password))
            {
                throw new Exception("Invalid password");
            }

```
Endpoints designed to be as simple as possible
```c#
      [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteMessage(Guid id)
        {

            var sessionToken = HttpContext.Request.Cookies["sessionToken"];
            if (!_userService.IsAuthorized(sessionToken))
            {
                return Unauthorized(new { message = "You are unauthorized" });
            }



            var message = await _context.Messages.FindAsync(id);
            if (message == null)
            {
                return NotFound();
            }

            _context.Messages.Remove(message);
            await _context.SaveChangesAsync();

            return Ok(id);
        }

```

Interfaces
```c#
      public interface IUserService
    {
        Task<User> CreateUserAsync(UserCredentialsDTO userCredentials);
        Task<User> LoginUser(UserCredentialsDTO userCredentials);
        User FindUserBySessionToken(string sessionToken);
        UserLoggedInDTO ToDTO(User user);
        bool IsAuthorized(string sessionToken);
    }

```


## Author

* **Chris Detmering** - *Full Stack Engineer* -  [LinkedIn](https://www.linkedin.com/in/chris-detmering-1b8b9851/)
