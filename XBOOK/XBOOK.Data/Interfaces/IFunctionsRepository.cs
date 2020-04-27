using System.Collections.Generic;
using System.Threading.Tasks;
using XBOOK.Data.ViewModels;

namespace XBOOK.Data.Interfaces
{
    public interface IFunctionsRepository
    {
        Task<List<FunctionViewModel>> GetAllFunction();
    }
}
