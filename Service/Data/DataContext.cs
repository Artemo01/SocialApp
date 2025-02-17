using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Service.Models;

namespace Service.Data;

public class DataContext(DbContextOptions options)
    : IdentityDbContext<AppUser, AppRole, int, IdentityUserClaim<int>, AppUserRole, IdentityUserLogin<int>,
        IdentityRoleClaim<int>, IdentityUserToken<int>>(options)
{
    public DbSet<UserLike> Likes { get; set; }
    public DbSet<Message> Messages { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        
        modelBuilder.Entity<AppUser>()
            .HasMany(user => user.UserRoles)
            .WithOne(user => user.User)
            .HasForeignKey(user => user.UserId)
            .IsRequired();
        
        modelBuilder.Entity<AppRole>()
            .HasMany(role => role.UserRoles)
            .WithOne(role => role.Role)
            .HasForeignKey(role => role.RoleId)
            .IsRequired();

        modelBuilder.Entity<UserLike>().HasKey(userLike => new { userLike.SourceUserId, userLike.TargetUserId });
        
        modelBuilder.Entity<UserLike>()
            .HasOne(sourceUserLike => sourceUserLike.SourceUser)
            .WithMany(likedUser => likedUser.LikedUsers)
            .HasForeignKey(sourceUserLike => sourceUserLike.SourceUserId)
            .OnDelete(DeleteBehavior.Cascade);
        
        modelBuilder.Entity<UserLike>()
            .HasOne(sourceUserLike => sourceUserLike.TargetUser)
            .WithMany(likedUser => likedUser.LikedByUsers)
            .HasForeignKey(sourceUserLike => sourceUserLike.TargetUserId)
            .OnDelete(DeleteBehavior.NoAction);
        
        modelBuilder.Entity<Message>()
            .HasOne(message => message.Recipient)
            .WithMany(message => message.MessagesReceived)
            .OnDelete(DeleteBehavior.Restrict);
        
        modelBuilder.Entity<Message>()
            .HasOne(message => message.Sender)
            .WithMany(message => message.MessagesSent)
            .OnDelete(DeleteBehavior.Restrict);
    }
}