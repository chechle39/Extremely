using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using XBOOK.Data.ViewModels;
using XBOOK.Service.Interfaces;

namespace XBOOK.Web.Controllers
{
    public class Payments2Controller : BaseAPIController
    {
        IPayments2Service _paymentsService;
        private readonly IAuthorizationService _authorizationService;
        public Payments2Controller(IPayments2Service paymentsService, IAuthorizationService authorizationService)
        {
            _paymentsService = paymentsService;
            _authorizationService = authorizationService;
        }

        [HttpPost("[action]")]
        public IActionResult CreatePayments(Payment2ViewModel request)
        {
            _paymentsService.SavePayMent(request);
            return Ok(request);
        }

        [HttpPost("[action]/{id}")]
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
        public async Task<IActionResult> UpdatePayment([FromBody]Payment2ViewModel request)
        {
            await _paymentsService.UpdatePayMent(request);
            return Ok();
        }

        [HttpPost("[action]/{id}")]
        public async Task<IActionResult> GetPaymentById(long id)
        {
            var paymentData = await _paymentsService.GetPaymentByIdAsync(id);
            return Ok(paymentData);
        }

        [HttpPost("[action]/{id}")]
        public async Task<IActionResult> GetPaymentByInv(long id)
        {
            var paymentData = await _paymentsService.GetAllPaymentsByInv(id);
            return Ok(paymentData);
        }
    }
}