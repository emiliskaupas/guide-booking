using Microsoft.EntityFrameworkCore;
using Backend.Models;

namespace Backend.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public DbSet<Booking> Bookings { get; set; }
        public DbSet<TourPackage> TourPackages { get; set; }
        public DbSet<Extra> Extras { get; set; }
        public DbSet<BookingExtra> BookingExtras { get; set; }
        public DbSet<TicketCategory> TicketCategories { get; set; }
        public DbSet<User> Users { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configure relationships
            modelBuilder.Entity<Booking>()
                .HasOne(b => b.TourPackage)
                .WithMany()
                .HasForeignKey(b => b.TourPackageId);

            modelBuilder.Entity<BookingExtra>()
                .HasOne(be => be.Booking)
                .WithMany(b => b.BookingExtras)
                .HasForeignKey(be => be.BookingId);

            modelBuilder.Entity<BookingExtra>()
                .HasOne(be => be.Extra)
                .WithMany()
                .HasForeignKey(be => be.ExtraId);

            modelBuilder.Entity<TicketCategory>()
                .HasOne(tc => tc.Booking)
                .WithMany(b => b.TicketCategories)
                .HasForeignKey(tc => tc.BookingId);

            // Seed Tour Packages
            modelBuilder.Entity<TourPackage>().HasData(
                new TourPackage { Id = 1, Name = "Historical Tour", Description = "Explore the rich history of our beautiful city", BasePrice = 40, DurationHours = 3 },
                new TourPackage { Id = 2, Name = "Food Tour", Description = "Taste the best local cuisine and delicacies", BasePrice = 50, DurationHours = 4 },
                new TourPackage { Id = 3, Name = "Art & Culture", Description = "Discover the artistic soul of the city", BasePrice = 45, DurationHours = 3 },
                new TourPackage { Id = 4, Name = "Nightlife Tour", Description = "Experience the vibrant nightlife scene", BasePrice = 60, DurationHours = 4 }
            );

            // Seed Extras
            modelBuilder.Entity<Extra>().HasData(
                new Extra { Id = 1, Name = "Private guide", Description = "Get a dedicated guide just for your group", Price = 20 },
                new Extra { Id = 2, Name = "Hotel pickup", Description = "Convenient pickup from your hotel", Price = 10 },
                new Extra { Id = 3, Name = "Extra hour", Description = "Extend your tour by one hour", Price = 15 }
            );

        }
    }
}
