using Backend.Data;
using Backend.DTOs;
using Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace Backend.Services
{
    public class BookingService : IBookingService
    {
        private readonly ApplicationDbContext _context;
        private readonly ITourService _tourService;
        private readonly ILogger<BookingService> _logger;

        public BookingService(ApplicationDbContext context, ITourService tourService, ILogger<BookingService> logger)
        {
            _context = context;
            _tourService = tourService;
            _logger = logger;
        }

        public async Task<IEnumerable<BookingDto>> GetAllBookingsAsync()
        {
            var bookings = await _context.Bookings
                .Include(b => b.TourPackage)
                .Include(b => b.BookingExtras)
                    .ThenInclude(be => be.Extra)
                .Include(b => b.TicketCategories)
                .OrderByDescending(b => b.CreatedAt)
                .ToListAsync();

            return bookings.Select(MapToDto);
        }

        public async Task<IEnumerable<BookingDto>> GetFilteredBookingsAsync(BookingFilterDto filter, string? userEmail = null, bool isAdmin = false)
        {
            var query = _context.Bookings
                .Include(b => b.TourPackage)
                .Include(b => b.BookingExtras)
                    .ThenInclude(be => be.Extra)
                .Include(b => b.TicketCategories)
                .AsQueryable();

            // Apply user-based filtering
            if (!isAdmin && !string.IsNullOrEmpty(userEmail))
            {
                query = query.Where(b => b.CustomerEmail == userEmail);
            }

            // Apply date filters
            if (filter.FromDate.HasValue)
            {
                query = query.Where(b => b.TourDate.Date >= filter.FromDate.Value.Date);
            }
            if (filter.ToDate.HasValue)
            {
                query = query.Where(b => b.TourDate.Date <= filter.ToDate.Value.Date);
            }

            // Apply tour package filter
            if (filter.TourPackageId.HasValue)
            {
                query = query.Where(b => b.TourPackageId == filter.TourPackageId.Value);
            }

            // Apply group size filters
            if (filter.MinGroupSize.HasValue)
            {
                query = query.Where(b => b.NumberOfPeople >= filter.MinGroupSize.Value);
            }
            if (filter.MaxGroupSize.HasValue)
            {
                query = query.Where(b => b.NumberOfPeople <= filter.MaxGroupSize.Value);
            }

            var bookings = await query
                .OrderByDescending(b => b.CreatedAt)
                .ToListAsync();

            return bookings.Select(MapToDto);
        }

        public async Task<BookingDto?> GetBookingByIdAsync(int id)
        {
            var booking = await _context.Bookings
                .Include(b => b.TourPackage)
                .Include(b => b.BookingExtras)
                    .ThenInclude(be => be.Extra)
                .Include(b => b.TicketCategories)
                .FirstOrDefaultAsync(b => b.Id == id);

            return booking == null ? null : MapToDto(booking);
        }

        public async Task<IEnumerable<BookingDto>> GetBookingsByUserEmailAsync(string email)
        {
            var bookings = await _context.Bookings
                .Include(b => b.TourPackage)
                .Include(b => b.BookingExtras)
                    .ThenInclude(be => be.Extra)
                .Include(b => b.TicketCategories)
                .Where(b => b.CustomerEmail == email)
                .OrderByDescending(b => b.CreatedAt)
                .ToListAsync();

            return bookings.Select(MapToDto);
        }

        public async Task<BookingDto?> GetBookingByIdAndUserEmailAsync(int id, string email)
        {
            var booking = await _context.Bookings
                .Include(b => b.TourPackage)
                .Include(b => b.BookingExtras)
                    .ThenInclude(be => be.Extra)
                .Include(b => b.TicketCategories)
                .FirstOrDefaultAsync(b => b.Id == id && b.CustomerEmail == email);

            return booking == null ? null : MapToDto(booking);
        }

        public async Task<BookingDto> CreateBookingAsync(BookingFormDto createBooking)
        {
            // Calculate total price
            var priceCalculation = new PriceCalculationDto
            {
                TourPackageId = createBooking.TourPackageId,
                NumberOfPeople = createBooking.NumberOfPeople,
                ExtraIds = createBooking.ExtraIds,
                TicketCategories = createBooking.TicketCategories
            };

            var priceBreakdown = await _tourService.CalculatePriceAsync(priceCalculation);

            // Create booking
            var booking = new Booking
            {
                CustomerName = createBooking.CustomerName,
                CustomerEmail = createBooking.CustomerEmail,
                TourPackageId = createBooking.TourPackageId,
                TourDate = createBooking.TourDate,
                NumberOfPeople = createBooking.NumberOfPeople,
                TotalPrice = priceBreakdown.TotalPrice,
                CreatedAt = DateTime.UtcNow
            };

            _context.Bookings.Add(booking);
            await _context.SaveChangesAsync();

            // Add extras
            if (createBooking.ExtraIds.Any())
            {
                var bookingExtras = createBooking.ExtraIds.Select(extraId => new BookingExtra
                {
                    BookingId = booking.Id,
                    ExtraId = extraId
                }).ToList();

                _context.BookingExtras.AddRange(bookingExtras);
            }

            // Add ticket categories
            if (createBooking.TicketCategories.Any())
            {
                var ticketCategories = createBooking.TicketCategories.Select(tc => new TicketCategory
                {
                    BookingId = booking.Id,
                    Type = Enum.Parse<TicketType>(tc.Type),
                    Quantity = tc.Quantity
                }).ToList();

                _context.TicketCategories.AddRange(ticketCategories);
            }

            await _context.SaveChangesAsync();

            // Reload booking with includes
            return (await GetBookingByIdAsync(booking.Id))!;
        }

        public async Task<bool> DeleteBookingAsync(int id)
        {
            var booking = await _context.Bookings.FindAsync(id);
            if (booking == null) return false;

            _context.Bookings.Remove(booking);
            await _context.SaveChangesAsync();
            return true;
        }

        private static BookingDto MapToDto(Booking booking)
        {
            return new BookingDto
            {
                Id = booking.Id,
                CustomerName = booking.CustomerName,
                CustomerEmail = booking.CustomerEmail,
                TourPackage = new TourPackageDto
                {
                    Id = booking.TourPackage!.Id,
                    Name = booking.TourPackage.Name,
                    Description = booking.TourPackage.Description,
                    BasePrice = booking.TourPackage.BasePrice,
                    DurationHours = booking.TourPackage.DurationHours
                },
                TourDate = booking.TourDate,
                NumberOfPeople = booking.NumberOfPeople,
                Extras = booking.BookingExtras.Select(be => new ExtraDto
                {
                    Id = be.Extra!.Id,
                    Name = be.Extra.Name,
                    Description = be.Extra.Description,
                    Price = be.Extra.Price
                }).ToList(),
                TicketCategories = booking.TicketCategories.Select(tc => new TicketCategoryDto
                {
                    Type = tc.Type.ToString(),
                    Quantity = tc.Quantity
                }).ToList(),
                TotalPrice = booking.TotalPrice,
                CreatedAt = booking.CreatedAt
            };
        }
    }
}
