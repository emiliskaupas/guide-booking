using System.ComponentModel.DataAnnotations;

namespace Backend.DTOs
{
    public class BookingFormDto
    {
        public string CustomerName { get; set; } = string.Empty;
        public string CustomerEmail { get; set; } = string.Empty;

        [Required(ErrorMessage = "Tour package is required")]
        public int TourPackageId { get; set; }

        [Required(ErrorMessage = "Tour date is required")]
        public DateTime TourDate { get; set; }

        [Required(ErrorMessage = "Number of people is required")]
        [Range(1, 100, ErrorMessage = "Number of people must be between 1 and 100")]
        public int NumberOfPeople { get; set; }

        public List<int> ExtraIds { get; set; } = new();

        public List<TicketCategoryDto> TicketCategories { get; set; } = new();
    }

    public class TicketCategoryDto
    {
        [Required(ErrorMessage = "Ticket type is required")]
        [RegularExpression(@"^(Adult|Youth|Child)$", ErrorMessage = "Ticket type must be Adult, Youth, or Child")]
        public string Type { get; set; } = string.Empty; // Adult, Youth, Child

        [Required(ErrorMessage = "Quantity is required")]
        [Range(1, 100, ErrorMessage = "Quantity must be between 1 and 100")]
        public int Quantity { get; set; }
    }
}
