using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using XBOOK.Data.Entities;
using XBOOK.Data.ViewModels;

namespace XBOOK.Service.Interfaces
{
    public interface ICompanyProfileService
    {
        Task<CompanyProfileViewModel> GetInFoProfile();
        bool UpdateCompany(string request);
    }
}
