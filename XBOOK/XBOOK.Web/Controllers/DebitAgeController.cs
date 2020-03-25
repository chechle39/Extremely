using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System.Collections.Generic;
using System.IO;
using System.Threading.Tasks;
using XBOOK.Dapper.Interfaces;
using XBOOK.Dapper.ViewModels;
using XBOOK.Data.Model;

namespace XBOOK.Web.Controllers
{
    public class DebitAgeController : BaseAPIController
    {
       
        IDebitageServiceDapper _iDebitageServiceDapper;
        public DebitAgeController(IDebitageServiceDapper iDebitageServiceDapper)
        {

            _iDebitageServiceDapper = iDebitageServiceDapper;
        }

       
        [HttpPost("[action]")]
        public async Task<IActionResult> GetALLDebitageServiceDapper([FromBody]DebitageModelSearchRequest request)
        {
            var DebitAgeList = await _iDebitageServiceDapper.GetDebitageServiceDapperAsync(request);
            return Ok(DebitAgeList);
        }

        [HttpPost("[action]")]
        public IActionResult SaveFileJson(List<DebitAgeViewodelPrint> request)
        {
            string json = JsonConvert.SerializeObject(request);
            var folderName = Path.Combine(request[0].companyCode, "Reports", "Data");
            var pathToSave = Path.Combine(Directory.GetCurrentDirectory(), folderName);
            var fileName = "DebitAge.json";

            var fullPath = Path.Combine(pathToSave, fileName);
            if (!Directory.Exists(pathToSave))
            {
                Directory.CreateDirectory(pathToSave);
            }
            System.IO.File.WriteAllText(fullPath, json);

            return Ok();
        }

    }
}