using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using XBOOK.Dapper.Interfaces;
using XBOOK.Data.Model;
using XBOOK.Service.Interfaces;

namespace XBOOK.Web.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SupplierController : ControllerBase
    {
        private readonly ISupplierService _supplierService;
        ISupplierServiceDapper _supplierServiceDapper;

        public SupplierController(ISupplierService supplierService, ISupplierServiceDapper supplierServiceDapper)
        {
            _supplierService = supplierService;
            _supplierServiceDapper = supplierServiceDapper;
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> GetAllSupplierAsync([FromBody]ClientSerchRequest request)
        {
            var supplier = await _supplierService.GetAllSupplier(request);
            return Ok(supplier);
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> GetAllSupplierDapper([FromBody]ClientSerchRequest request)
        {
            var clientList = await _supplierServiceDapper.GetSupplierAsync(request);
            return Ok(clientList);
        }

        [HttpPost("[action]/{id}")]
        public async Task<IActionResult> GetSupplierById(int id)
        {
            var getCkientById = await _supplierService.GetSupplierById(id);
            return Ok(getCkientById);
        }
        [HttpPost("[action]")]
        public IActionResult SaveSupplier(SupplierCreateRequest rs)
        {
            _supplierService.CreateSupplier(rs);
            return Ok();
        }

        [HttpPut("[action]")]
        public async Task<IActionResult> UpdateSupplier([FromBody]SupplierCreateRequest request)
        {
            var update = await _supplierService.UpdateSupplier(request);
            return Ok();
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> DeleteClient(List<requestDeleted> request)
        {
            await _supplierService.DeletedSupplier(request);
            return Ok();
        }
    }
}