using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using XBOOK.Data.Entities;
using XBOOK.Data.Model;
using XBOOK.Data.ViewModels;

namespace XBOOK.Service.Interfaces
{
    public interface ICompanyProfileService
    {
        Task<IEnumerable<CompanyProfileViewModel>> GetInFoProfile1();
        Task<CompanyProfileViewModel> GetInFoProfile();
        Task<bool> UpdateCompanyProfile(CompanyProfileViewModel request);
        bool UpdateCompany(string request);
        CompanyProfile CreateCompanyProfile(CompanyProfileViewModel request);
        Task<CompanyProfileViewModel> GetCompanyById(int id);
    }
}
