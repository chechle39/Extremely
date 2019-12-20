using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using System;
using System.IO;
using System.Threading.Tasks;
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
            DateTime now = DateTime.Now;
            var files = Request.Form.Files;
            if (files.Count == 0)
            {
                return new BadRequestObjectResult(files);
            }
            else
            {
                var file = files[0];
                var prf = await _iCompanyProfileService.GetInFoProfile();
                var fileName = "logo" + ".png";

                var imageFolder = $@"C:\uploaded\{prf.code}\images";

                string folder =  imageFolder;

                if (!Directory.Exists(folder))
                {
                    Directory.CreateDirectory(folder);
                }
                string filePath = Path.Combine(folder, fileName);
                using (FileStream fs = System.IO.File.Create(filePath))
                {
                    file.CopyTo(fs);
                    fs.Flush();
                }
               _iCompanyProfileService.UpdateCompany(Path.Combine(imageFolder, fileName).Replace(@"\", @"/"));

                return Ok(new { fileName });
            }
        }
        [HttpPost("[action]")]
        public async Task<IActionResult> GetIMG([FromBody] requestGetIMG request)
        {
            var prf = await _iCompanyProfileService.GetInFoProfile();
            var imageFolder = $@"C:\uploaded\{prf.code}\images";
            string folder = imageFolder;
            if (!Directory.Exists(folder))
            {
                return Ok();
            }else
            {
                var file = Path.Combine(folder, request.ImgName);

                byte[] imageArray = System.IO.File.ReadAllBytes(file);
                string base64ImageRepresentation = Convert.ToBase64String(imageArray);
                return Ok(base64ImageRepresentation);
            }
          
        }
    }
}