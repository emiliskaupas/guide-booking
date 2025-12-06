using System.ComponentModel.DataAnnotations;

namespace Backend.Models
{
    public class Booking
    {
        public int Id { get; set; }

        [Required]
        public string CustomerName { get; set; } = string.Empty;

        [Required]
        [EmailAddress]
        public string CustomerEmail { get; set; } = string.Empty;

        [Required]
        public int TourPackageId { get; set; }
        public TourPackage? TourPackage { get; set; }

        [Required]
        public DateTime TourDate { get; set; }

        [Required]
        [Range(1, 100)]
        public int NumberOfPeople { get; set; }

        public List<BookingExtra> BookingExtras { get; set; } = new();

        public List<TicketCategory> TicketCategories { get; set; } = new();

        public decimal TotalPrice { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
