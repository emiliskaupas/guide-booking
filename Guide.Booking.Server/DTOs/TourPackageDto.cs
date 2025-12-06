namespace Backend.DTOs
{
    public class TourPackageDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public decimal BasePrice { get; set; }
        public int DurationHours { get; set; }
    }
}
