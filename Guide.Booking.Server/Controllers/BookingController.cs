using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Backend.DTOs;
using Backend.Services;
using Backend.Models;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class BookingsController : ControllerBase
    {
        private readonly IBookingService _bookingService;
        private readonly ILogger<BookingsController> _logger;

        public BookingsController(IBookingService bookingService, ILogger<BookingsController> logger)
        {
            _bookingService = bookingService;
            _logger = logger;
        }

        [HttpGet]
        [ProducesResponseType(typeof(IEnumerable<BookingDto>), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public async Task<ActionResult<IEnumerable<BookingDto>>> GetAllBookings(
            [FromQuery] DateTime? fromDate,
            [FromQuery] DateTime? toDate,
            [FromQuery] int? tourPackageId,
            [FromQuery] int? minGroupSize,
            [FromQuery] int? maxGroupSize)
        {
            var userEmail = User.FindFirst(System.Security.Claims.ClaimTypes.Email)?.Value;
            var userRole = User.FindFirst(System.Security.Claims.ClaimTypes.Role)?.Value;
            var isAdmin = userRole == nameof(UserRole.Admin);

            // If no filters provided, return all bookings
            if (!fromDate.HasValue && !toDate.HasValue && !tourPackageId.HasValue && !minGroupSize.HasValue && !maxGroupSize.HasValue)
            {
                var allBookings = await _bookingService.GetAllBookingsAsync();
                if (!isAdmin && !string.IsNullOrEmpty(userEmail))
                {
                    allBookings = allBookings.Where(b => b.CustomerEmail == userEmail);
                }
                return Ok(allBookings);
            }

            // Apply filters
            var filter = new BookingFilterDto
            {
                FromDate = fromDate,
                ToDate = toDate,
                TourPackageId = tourPackageId,
                MinGroupSize = minGroupSize,
                MaxGroupSize = maxGroupSize
            };

            var bookings = await _bookingService.GetFilteredBookingsAsync(filter, userEmail, isAdmin);
            return Ok(bookings);
        }

        [HttpGet("{id}")]
        [ProducesResponseType(typeof(BookingDto), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<BookingDto>> GetBookingById(int id)
        {
            var booking = await _bookingService.GetBookingByIdAsync(id);
            if (booking == null)
                return NotFound(new { message = "Booking not found" });

            var userEmail = User.FindFirst(System.Security.Claims.ClaimTypes.Email)?.Value;
            var userRole = User.FindFirst(System.Security.Claims.ClaimTypes.Role)?.Value;

            if (userRole != nameof(UserRole.Admin) && booking.CustomerEmail != userEmail)
            {
                return Forbid();
            }

            return Ok(booking);
        }

        [HttpPost]
        [ProducesResponseType(typeof(BookingDto), StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status422UnprocessableEntity)]
        public async Task<ActionResult<BookingDto>> CreateBooking([FromBody] BookingFormDto createBooking)
        {
            if (!ModelState.IsValid)
                return UnprocessableEntity(ModelState);

            try
            {
                var booking = await _bookingService.CreateBookingAsync(createBooking);
                return CreatedAtAction(nameof(GetBookingById), new { id = booking.Id }, booking);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpDelete("{id}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult> DeleteBooking(int id)
        {
            var booking = await _bookingService.GetBookingByIdAsync(id);
            if (booking == null)
                return NotFound(new { message = "Booking not found" });

            var userEmail = User.FindFirst(System.Security.Claims.ClaimTypes.Email)?.Value;
            var userRole = User.FindFirst(System.Security.Claims.ClaimTypes.Role)?.Value;

            if (userRole != nameof(UserRole.Admin) && booking.CustomerEmail != userEmail)
            {
                return Forbid();
            }

            var result = await _bookingService.DeleteBookingAsync(id);
            if (!result)
                return NotFound(new { message = "Booking not found" });

            return NoContent();
        }
    }
}
