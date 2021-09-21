using System;
using System.Linq;
using System.Security.Cryptography;
using System.Threading.Tasks;
using CodeChat.Controllers;
using CodeChat.DataAccess.Data;
using CodeChat.DataAccess.Models;
using CodeChat.DTOs;
using Microsoft.EntityFrameworkCore;

namespace CodeChat.Services
{

    public interface IUserService
    {
        Task<User> CreateUserAsync(UserCredentialsDTO userCredentials);
        Task<User> LoginUser(UserCredentialsDTO userCredentials);
        User FindUserBySessionToken(string sessionToken);
        UserLoggedInDTO ToDTO(User user);
    }


    public class UserService : IUserService
    {

        private readonly ChatContext _context;

        public UserService(ChatContext context)
        {
            _context = context;
        }

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

            var passwordDigest = BCrypt.Net.BCrypt.HashPassword(userCredentials.Password);
            var sessionToken = CustomApiController.CreateSessionToken();

            var user = new User
            {
                Username = userCredentials.Username,
                PasswordDigest = passwordDigest,
                SessionToken = sessionToken
            };


            try
            {
                _context.Users.Add(user);
                await _context.SaveChangesAsync();
            }
            catch (Exception)
            {
                if (!UserExistsByUserName(user.Username))
                {
                    throw new Exception("There was a problem creating the user");
                }

                throw;

            }

            return user;
        }


        public async Task<User> LoginUser(UserCredentialsDTO userCredentials) {

            if (!UserExistsByUserName(userCredentials.Username))
            {
                throw new Exception("User does not exist");
            }

            var user = FindUserByUserName(userCredentials.Username);
            bool isPassword = BCrypt.Net.BCrypt.Verify(userCredentials.Password, user.PasswordDigest);

            if (!isPassword)
            {
                throw new Exception("Password does not match");
            }


            var sessionToken =  CustomApiController.CreateSessionToken();
    
            user.SessionToken = sessionToken;
            _context.Entry(user).State = EntityState.Modified;

            await _context.SaveChangesAsync();

            return user;
        }

        public User FindUserBySessionToken(string sessionToken)
        {
            var user = _context.Users
                 .Where(u => u.SessionToken == sessionToken)
                 .FirstOrDefault();

            return user;

        }

        public UserLoggedInDTO ToDTO(User user) {
            var userDTO = new UserLoggedInDTO()
            {
                Username = user.Username
            };

            return userDTO;
        }


        private bool UserExistsByUserName(string username)
        {
            return _context.Users.Any(e => e.Username == username);
        }


        private static bool IsValidPassword(string password)
        {

            return password.Length >= 8;
        }


        private User FindUserByUserName(string username)
        {
            var user = _context.Users
                 .Where(u => u.Username == username)
                 .FirstOrDefault();

            return user;

        }

    }
}
