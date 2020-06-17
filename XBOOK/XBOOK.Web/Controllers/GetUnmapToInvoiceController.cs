using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using XBOOK.Dapper.Interfaces;
using XBOOK.Dapper.ViewModels;

namespace XBOOK.Web.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class GetUnmapToInvoiceController : ControllerBase
    {
        private readonly IGetUn_mapToInvoiceDapper _getUnmapToInvoiceDapper;
        public GetUnmapToInvoiceController(IGetUn_mapToInvoiceDapper getUn_mapToInvoiceDapper)
        {
            _getUnmapToInvoiceDapper = getUn_mapToInvoiceDapper;
        }
        [HttpPost("[action]")]
        public async Task<IActionResult> GetUn_mapToInvoice([FromBody]GetUn_mapToInvoiceReceiptRequest request)
        {
            var data = await _getUnmapToInvoiceDapper.GetUn_mapToInvoiceReceipt(request);

            if (!string.IsNullOrEmpty(request.Key))
            {
                var y = data.Where(x=>x.ReceiptNumber.Contains(request.Key)).ToList();
                return Ok(y);
            }

            return Ok(data);
        }
        [HttpPost("[action]")]
        public async Task<IActionResult> CheckExist([FromBody]GetUn_mapToInvoiceReceiptRequest request)
        {
            var data = await _getUnmapToInvoiceDapper.GetUn_mapToInvoiceReceipt(request);

            if (!string.IsNullOrEmpty(request.Key))
            {
                var query = data.Where(x => x.ReceiptNumber == request.Key).ToList();
                if (query.Count() > 0)
                {
                    return Ok(true);

                } else
                {
                    return Ok(false);

                }
            }

            return Ok(false);
        }
    }
}