namespace Backend.DTOs
{
    public class BookingDto
    {
        public int Id { get; set; }
        public string CustomerName { get; set; } = string.Empty;
        public string CustomerEmail { get; set; } = string.Empty;
        public TourPackageDto TourPackage { get; set; } = new();
        public DateTime TourDate { get; set; }
        public int NumberOfPeople { get; set; }
        public List<ExtraDto> Extras { get; set; } = new();
        public List<TicketCategoryDto> TicketCategories { get; set; } = new();
        public decimal TotalPrice { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
