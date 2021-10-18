# Code Chat

[See it live!](https://code-chat.azurewebsites.net/)


## Tech Stack

* C#/.NET
* React 
* Redux
* TypeScript 
* Postgres


  
## Features

#### Create New Messages

Implemented live chat with SignalR chatHub 

![hippo](https://media.giphy.com/media/WzkEeAJTQcCeQ1p44z/giphy.gif)

#### Edit Messages
Edit messages in real time 

![hippo](https://media.giphy.com/media/Qy2xgc1DYKRSjXI8wy/giphy.gif)


#### Delete Messages
You can delete messages, but only your own 

![hippo](https://media.giphy.com/media/qnSbLI79r9dvt5EYZe/giphy.gif)
  
  
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

Interfaces used for custom services following the design by contract 
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
