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
        public CompanyProfileReponsitory(DbContext context) : base(context)
        {
        }

        public void UpdateProfile(CompanyProfile file)
        {

            var getprofile = Entities.ToListAsync();
            Entities.Update(file);
        }
    }
}
