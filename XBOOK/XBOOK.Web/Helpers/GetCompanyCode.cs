using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using XBOOK.Data.Model;

namespace XBOOK.Web.Helpers
{
    public class GetCompanyCode
    {
        public static CompanyModel GetCode()
        {
            var folderName = Path.Combine("Reports", "Company");
            var pathToSave = Path.Combine(Directory.GetCurrentDirectory(), folderName);
            var fileName = "CompanyExist.json";
            var fullPath = Path.Combine(pathToSave, fileName);
            using (StreamReader r = new StreamReader(fullPath))
            {
                var json = r.ReadToEnd();
                var items = JsonConvert.DeserializeObject<CompanyModel>(json);
                return items;
            }
        }

        public static bool SaveDataJson(string code)
        {
            string data = "";
            var folderName = Path.Combine("Reports", "Company");
            var pathToSave = Path.Combine(Directory.GetCurrentDirectory(), folderName);
            var fileName = "CompanyExist.json";
            var fullPath = Path.Combine(pathToSave, fileName);
            if (Directory.Exists(pathToSave))
            {
                 data = GetCode().Code;
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
    }
}
