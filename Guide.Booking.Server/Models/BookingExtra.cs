namespace Backend.Models
{
    public class BookingExtra
    {
        public int Id { get; set; }
        public int BookingId { get; set; }
        public Booking? Booking { get; set; }
        public int ExtraId { get; set; }
        public Extra? Extra { get; set; }
    }
}
