using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using XBOOK.Data.ViewModels;

namespace XBOOK.Service.Interfaces
{
    public interface ICategoryService
    {
        Task<IEnumerable<CategoryViewModel>> GetAllCategory();
        Task<IEnumerable<CategoryViewModel>> GetCategoryById(int id);
    }
}
