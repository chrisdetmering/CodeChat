# Code Chat

[See it live!](https://code-chat.azurewebsites.net/)


## Tech Stack

* C#/.NET
* React 
* Redux
* TypeScript 
* Postgres


  
## Features

#### Sign in with Twitter

Implemented the [Sign in with Twitter](https://developer.twitter.com/en/docs/authentication/guides/log-in-with-twitter) flow.

![hippo](https://media.giphy.com/media/WzkEeAJTQcCeQ1p44z/giphy.gif)

#### Post on behalf of users
Can post on YOUR actual twitter account.
Requests authorized using the OAuth 1.0a method. Be careful!

![hippo](https://media.giphy.com/media/Qy2xgc1DYKRSjXI8wy/giphy.gif)


#### Search Twitter
Search Twitter and get back relevant tweets.

![hippo](https://media.giphy.com/media/qnSbLI79r9dvt5EYZe/giphy.gif)
  
  
## Code Examples

Custom percent encode function following the [RFC 3986, Section 2.1](https://datatracker.ietf.org/doc/html/rfc3986#section-2.1) specs


```c#
[HttpGet]
        public async Task<ActionResult<Dictionary<Guid, ChannelResponseDTO>>> GetChannels()
        {
            var sessionToken = HttpContext.Request.Cookies["sessionToken"];
            if (!_userService.IsAuthorized(sessionToken))
            {
                return Unauthorized(new { message = "You are unauthorized" });
            }
            var channels = _context.Channels.Include(c => c.Messages);
           

            return await channels.ToDictionaryAsync(
                    c => c.Id,
                    c => new ChannelResponseDTO
                    {
                        Id = c.Id,
                        Name = c.Name,
                        MessagesIds = c.Messages.OrderBy(m => m.CreatedAt).Select(m => m.Id)
                    }
              );
        }
```

Made custom TwitterApi class to handle authorizing requests to Twitter endpoints
```c#

```


## Author

* **Chris Detmering** - *Full Stack Engineer* -  [LinkedIn](https://www.linkedin.com/in/chris-detmering-1b8b9851/)
