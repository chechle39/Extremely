using System.Threading.Tasks;
using XBOOK.Data.Entities;

namespace XBOOK.Data.Interfaces
{
    public interface ICompanyProfileReponsitory
    {
        void UpdateProfile(CompanyProfile file);
        Task<CompanyProfile> GetCompanyProFile();
    }
}
