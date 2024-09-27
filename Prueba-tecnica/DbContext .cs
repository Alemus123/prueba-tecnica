using Microsoft.EntityFrameworkCore;

public class JournalDbContext : DbContext
{
    internal object Journal;

    public JournalDbContext(DbContextOptions<JournalDbContext> options) : base(options) { }

    public DbSet<User> Users { get; set; }
    public DbSet<Journals> Journals { get; set; }
    public DbSet<Subscription> Subscriptions { get; set; }


    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<User>()
            .Property(u => u.Id)
            .ValueGeneratedOnAdd(); 
    }

}
