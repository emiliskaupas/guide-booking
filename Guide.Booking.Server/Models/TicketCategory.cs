namespace Backend.Models
{
    public class TicketCategory
    {
        public int Id { get; set; }
        public int BookingId { get; set; }
        public Booking? Booking { get; set; }
        public TicketType Type { get; set; }
        public int Quantity { get; set; }
    }

    public enum TicketType
    {
        Adult,
        Youth,
        Child
    }
}
