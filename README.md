# Twitter Me Now

[See it live!](https://twitter-me-now.herokuapp.com/)

Note: You have to have a twitter account to sign in :)

## Tech Stack

* Node & Express
* React Hooks
* Twitter API v1.1


  
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


```javascript
 const ASCII_CHARACTERS = [
  '0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K',
'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 
'W', 'X', 'Y', 'Z', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 
'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 
's', 't', 'u', 'v', 'w', 'x', 'y','z', '-', '.', '_','~']; 


const percentEncode = (string) => { 

  let encodedString = ''; 
  string.split("").forEach(char => {
      if (ASCII_CHARACTERS.includes(char)) { 
        encodedString += char; 
      } else { 
        const encoded = '%' + char.charCodeAt(0).toString(16); 
        encodedString += encoded.toUpperCase(); 
      }
  });

  return encodedString; 
}
```

Made custom TwitterApi class to handle authorizing requests to Twitter endpoints
```javascript
 class TwitterApi { 
  constructor() { 
    this.baseUrl = undefined;
    this.parameters = [];
    this.oauth_token = undefined;
    this.oauth_token_secret = undefined;
    this.queryParams = []; 
    this.body = undefined; 
  }
  
  get(baseUrl, queryParams) { 
    this.setBaseUrl(baseUrl);
    this.setQueryParams(queryParams); 
    return this.request("GET"); 
  }

  
  post(baseUrl, queryParams, body) { 
    this.setBaseUrl(baseUrl);
    this.setQueryParams(queryParams); 
    return this.request("POST", body); 
  }

  setBaseUrl(baseUrl) { 
    this.baseUrl = baseUrl; 
  }
```


## Author

* **Chris Detmering** - *Full Stack Engineer* -  [LinkedIn](https://www.linkedin.com/in/chris-detmering-1b8b9851/)
