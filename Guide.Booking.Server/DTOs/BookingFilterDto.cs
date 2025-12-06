namespace Backend.DTOs
{
    public class BookingFilterDto
    {
        public DateTime? FromDate { get; set; }
        public DateTime? ToDate { get; set; }
        public int? TourPackageId { get; set; }
        public int? MinGroupSize { get; set; }
        public int? MaxGroupSize { get; set; }
    }
}
