using Microsoft.EntityFrameworkCore;
using Service.Models;

namespace Service.Data;

public class DataContext(DbContextOptions options) : DbContext(options)
{
    public DbSet<AppUser> Users { get; set; }
}