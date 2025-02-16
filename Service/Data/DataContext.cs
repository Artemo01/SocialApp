using Microsoft.EntityFrameworkCore;
using Service.Models;

namespace Service.Data;

public class DataContext(DbContextOptions options) : DbContext(options)
{
    public DbSet<AppUser> Users { get; set; }
    public DbSet<UserLike> Likes { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

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
    }
}