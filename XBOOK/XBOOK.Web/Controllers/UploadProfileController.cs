using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.StaticFiles;
using XBOOK.Data.Model;
using XBOOK.Service.Interfaces;

namespace XBOOK.Web.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UploadProfileController : ControllerBase
    {
        ICompanyProfileService _iCompanyProfileService;
        private readonly IHostingEnvironment _hostingEnvironment;
        public UploadProfileController(ICompanyProfileService iCompanyProfileService, IHostingEnvironment hostingEnvironment)
        {
            _iCompanyProfileService = iCompanyProfileService;
            _hostingEnvironment = hostingEnvironment;
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> GetAllProFile()
        {
            var prf = await _iCompanyProfileService.GetInFoProfile();
            return Ok(prf);
        }


        [HttpPost("[action]"), DisableRequestSizeLimit]
        public async Task<IActionResult> Upload()
        {
            try
            {
                var file = Request.Form.Files[0];
                var folderName = Path.Combine("wwwroot", "img");
                var pathToSave = Path.Combine(Directory.GetCurrentDirectory(), folderName);

                if (file.Length > 0)
                {
                    var prf = await _iCompanyProfileService.GetInFoProfile();
                    var fileName = prf.bizPhone + prf.taxCode + ".png";
                    var fullPath = Path.Combine(pathToSave, fileName);
                    var dbPath = Path.Combine(folderName, fileName);

                    using (var stream = new FileStream(fullPath, FileMode.Create))
                    {
                        file.CopyTo(stream);
                    }
                    _iCompanyProfileService.UpdateCompany(fileName.Replace(" ", "_"));
                    var a = Path.Combine(folderName, fileName).Replace(@"\", @"/");
                    return Ok(new { fileName });
                }
                else
                {
                    return BadRequest();
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Internal server error");
            }

            //DateTime now = DateTime.Now;
            //var files = Request.Form.Files;
            //if (files.Count == 0)
            //{
            //    return new BadRequestObjectResult(files);
            //}
            //else
            //{
            //    var file = files[0];
            //    var prf = await _iCompanyProfileService.GetInFoProfile();
            //            var filename = prf.companyName + ".png";
            //    //var filename = ContentDispositionHeaderValue
            //    //                    .Parse(file.ContentDisposition)
            //    //                    .FileName
            //    //                    .Trim('"');

            //    var imageFolder = $@"\XBOOK\XBOOK.Web\ClientApp\src\assets\img";


            //    string folder = _hostingEnvironment.WebRootPath + imageFolder;

            //    if (!Directory.Exists(folder))
            //    {
            //        Directory.CreateDirectory(folder);
            //    }
            //    string filePath = Path.Combine(folder, filename);
            //    using (FileStream fs = System.IO.File.Create(filePath))
            //    {
            //        file.CopyTo(fs);
            //        fs.Flush();
            //    }
            //    _iCompanyProfileService.UpdateCompany(Path.Combine(imageFolder, filename).Replace(@"\", @"/"));
            //    return new OkObjectResult(Path.Combine(imageFolder, filename).Replace(@"\", @"/"));
        }
        [HttpPost("[action]")]
        public IActionResult GetIMG([FromBody] requestGetIMG request)
        {
            var file = Path.Combine(Directory.GetCurrentDirectory(),
                                    "wwwroot", "img", request.ImgName);
            byte[] imageArray = System.IO.File.ReadAllBytes(file);
            string base64ImageRepresentation = Convert.ToBase64String(imageArray);
            return Ok(base64ImageRepresentation);
        }
    }
}