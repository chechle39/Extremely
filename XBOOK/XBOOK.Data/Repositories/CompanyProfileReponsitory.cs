using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;
using System.Text;
using System.Threading.Tasks;
using XBOOK.Data.Base;
using XBOOK.Data.Entities;
using XBOOK.Data.Interfaces;
using XBOOK.Data.Model;

namespace XBOOK.Data.Repositories
{
    
    public class CompanyProfileReponsitory : Repository<CompanyProfile>, ICompanyProfileReponsitory
    {
        public CompanyProfileReponsitory(XBookContext context) : base(context)
        {
        }

        public async Task<CompanyProfile> GetCompanyProFile()
        {
            var data = await Entities.ToListAsync();
            var company = new CompanyProfile()
            {
                address = data[0].address,
                bankAccount = data[0].bankAccount,
                bizPhone = data[0].bizPhone,
                code = data[0].code,
                city = data[0].city,
                companyName = data[0].companyName,
                taxCode = data[0].taxCode,
            };
            return company;
        }

        public bool SaveDataJson(string code)
        {
            string data = "";
            var folderName = Path.Combine("Reports", "Company");
            var pathToSave = Path.Combine(Directory.GetCurrentDirectory(), folderName);
            var fileName = "CompanyExist.json";
            var fullPath = Path.Combine(pathToSave, fileName);
            if (Directory.Exists(pathToSave))
            {
               
            }
            var CodeData = new CompanyModel()
            {
                Code = code,
            };
            if (data != code)
            {
                string json = JsonConvert.SerializeObject(CodeData);

                if (!Directory.Exists(pathToSave))
                {
                    Directory.CreateDirectory(pathToSave);
                }
                System.IO.File.WriteAllText(fullPath, json);
            }

            return true;
        }

        public void UpdateProfile(CompanyProfile file)
        {

            var getprofile = Entities.ToListAsync();
            Entities.Update(file);
        }
    }
}
