using Backend.DTOs;

namespace Backend.Services
{
    public interface IBookingService
    {
        Task<IEnumerable<BookingDto>> GetAllBookingsAsync();
        Task<IEnumerable<BookingDto>> GetFilteredBookingsAsync(BookingFilterDto filter, string? userEmail = null, bool isAdmin = false);
        Task<BookingDto?> GetBookingByIdAsync(int id);
        Task<IEnumerable<BookingDto>> GetBookingsByUserEmailAsync(string email);
        Task<BookingDto?> GetBookingByIdAndUserEmailAsync(int id, string email);
        Task<BookingDto> CreateBookingAsync(BookingFormDto createBooking);
        Task<bool> DeleteBookingAsync(int id);
    }
}
