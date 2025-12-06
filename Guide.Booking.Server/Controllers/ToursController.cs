using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Backend.Services;
using Backend.DTOs;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [AllowAnonymous]
    public class ToursController : ControllerBase
    {
        private readonly ITourService _tourService;
        private readonly ILogger<ToursController> _logger;

        public ToursController(ITourService tourService, ILogger<ToursController> logger)
        {
            _tourService = tourService;
            _logger = logger;
        }

        [HttpGet]
        [ProducesResponseType(typeof(IEnumerable<TourPackageDto>), StatusCodes.Status200OK)]
        public async Task<ActionResult<IEnumerable<TourPackageDto>>> GetAllTours()
        {
            var tours = await _tourService.GetAllToursAsync();
            return Ok(tours);
        }

        [HttpGet("{id}")]
        [ProducesResponseType(typeof(TourPackageDto), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<TourPackageDto>> GetTourById(int id)
        {
            var tour = await _tourService.GetTourByIdAsync(id);
            if (tour == null)
                return NotFound(new { message = "Tour package not found" });

            return Ok(tour);
        }

        [HttpGet("extras")]
        [ProducesResponseType(typeof(IEnumerable<ExtraDto>), StatusCodes.Status200OK)]
        public async Task<ActionResult<IEnumerable<ExtraDto>>> GetAllExtras()
        {
            var extras = await _tourService.GetAllExtrasAsync();
            return Ok(extras);
        }

        [HttpPost("calculate-price")]
        [ProducesResponseType(typeof(PriceBreakdownDto), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status422UnprocessableEntity)]
        public async Task<ActionResult<PriceBreakdownDto>> CalculatePrice([FromBody] PriceCalculationDto calculation)
        {
            if (!ModelState.IsValid)
            {
                return UnprocessableEntity(ModelState);
            }

            try
            {
                var priceBreakdown = await _tourService.CalculatePriceAsync(calculation);
                return Ok(priceBreakdown);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
    }
}
