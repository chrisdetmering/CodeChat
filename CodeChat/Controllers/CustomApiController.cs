using System;
using System.Security.Cryptography;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace CodeChat.Controllers
{
    public class CustomApiController : ControllerBase
    {
        public CustomApiController() : base()
        {
        }

        public static void AddSessionTokenToCookies(string sessionToken, HttpContext httpContext)
        {


            httpContext.Response.Cookies.Append("sessionToken", sessionToken, new CookieOptions
            {
                Expires = DateTime.Now.AddDays(1)
            });
        }

        public static string CreateSessionToken()
        {
            var crypt = new RNGCryptoServiceProvider();
            var buf = new byte[10];
            crypt.GetBytes(buf);
            crypt.Dispose();
            return Convert.ToBase64String(buf);
        }

    }
}
