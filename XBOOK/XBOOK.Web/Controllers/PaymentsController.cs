using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using XBOOK.Service.Interfaces;
using XBOOK.Service.ViewModels;

namespace XBOOK.Web.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PaymentsController : ControllerBase
    {
        IPaymentsService _paymentsService;
        public PaymentsController(IPaymentsService paymentsService)
        {
            _paymentsService = paymentsService;
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> CreatePayments(PaymentViewModel request)
        {
            await _paymentsService.SavePayMent(request);
            return Ok(request);
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> DeletePayment(long id)
        {
            await _paymentsService.RemovePayMent(id);
            return Ok();
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> GetAllPayment()
        {
            var listPayment = await _paymentsService.GetAllPayments();
            return Ok(listPayment);
        }

        [HttpPut("[action]")]
        public async Task<IActionResult> UpdatePayment([FromBody]PaymentViewModel request)
        {
            await _paymentsService.UpdatePayMent(request);
            return Ok();
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> GetPaymentById([FromBody] long id)
        {
            var paymentData = await _paymentsService.GetPaymentByIdAsync(id);
            return Ok(paymentData);
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> GetPaymentByInv([FromBody] long id)
        {
            var paymentData = await _paymentsService.GetAllPaymentsByInv(id);
            return Ok(paymentData);
        }
    }
}