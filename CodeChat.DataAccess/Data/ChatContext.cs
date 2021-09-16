using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using CodeChat.DataAccess.Models;
using Microsoft.EntityFrameworkCore;

namespace CodeChat.DataAccess.Data
{
    public class ChatContext : DbContext 
    {

        public DbSet<Message> Messages { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<Channel> Channels { get; set; }

        public ChatContext(DbContextOptions<ChatContext> options)
            : base(options)
        {
        }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            //setting up DB logging & table column names to be
            //snake_case instead of PascelCase

            optionsBuilder.LogTo(Console.WriteLine)
            .UseSnakeCaseNamingConvention();
        }

        //Implementing Code First approach
        //DB Schema comes from Entities (Models in Entity framework)
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            
            //User one-to-many Messages relationship
            modelBuilder.Entity<User>()
                .HasMany(u => u.Messages)
                .WithOne(m => m.User)
                .HasForeignKey(m => m.UserId)
                .OnDelete(DeleteBehavior.Cascade);


            //User DB constraints
            modelBuilder.Entity<User>()
                .Property(u => u.PasswordDigest)
                .IsRequired();

            modelBuilder.Entity<User>()
                .Property(u => u.Username)
                .IsRequired();

            modelBuilder.Entity<User>()
                .Property(u => u.SessionToken)
                .IsRequired();

            modelBuilder.Entity<User>()
                .Property(u => u.CreatedAt)
                .IsRequired();

            modelBuilder.Entity<User>()
               .HasIndex(u => u.SessionToken)
               .IsUnique();

            modelBuilder.Entity<User>()
               .HasIndex(u => u.PasswordDigest)
               .IsUnique();

            modelBuilder.Entity<User>()
               .HasIndex(u => u.Username)
               .IsUnique();
          
            //Channel one-to-many Messages relationship
            modelBuilder.Entity<Channel>()
               .HasMany(c => c.Messages)
               .WithOne(m => m.Channel)
               .HasForeignKey(m => m.ChannelId)
               .OnDelete(DeleteBehavior.Cascade);

            //Channel DB constraints
            modelBuilder.Entity<Channel>()
                .Property(c => c.Name)
                .IsRequired();


            //Messages DB constraints
            modelBuilder.Entity<Message>()
                .Property(m => m.UserId)
                .IsRequired();

            modelBuilder.Entity<Message>()
                .Property(m => m.ChannelId)
                .IsRequired();


        }

        //Overriding SaveChanges & SaveChangesAsync
        //so that CreatedAt & UpdatedAt will automatically be populated/updated
        public override int SaveChanges()
        {
            AddTimestamps();
            return base.SaveChanges();
        }

        public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = new CancellationToken())
        {
            AddTimestamps();
            return base.SaveChangesAsync(cancellationToken);
        }

        private void AddTimestamps()
        {
            var entities = ChangeTracker.Entries()
                .Where(x => x.Entity is BaseModel && (x.State == EntityState.Added || x.State == EntityState.Modified));

            foreach (var entity in entities)
            {
                var now = DateTime.UtcNow; // current datetime

                if (entity.State == EntityState.Added)
                {
                    ((BaseModel)entity.Entity).CreatedAt = now;
                }
                ((BaseModel)entity.Entity).UpdatedAt = now;
            }
        }
    }
}

    