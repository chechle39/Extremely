using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using XBOOK.Data.Base;
using XBOOK.Data.Entities;
using XBOOK.Data.Interfaces;

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

        public void UpdateProfile(CompanyProfile file)
        {

            var getprofile = Entities.ToListAsync();
            Entities.Update(file);
        }
    }
}
