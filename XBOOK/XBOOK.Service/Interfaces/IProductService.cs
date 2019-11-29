using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using XBOOK.Data.Model;
using XBOOK.Data.ViewModels;

namespace XBOOK.Service.Interfaces
{
    public interface IProductService
    {
        Task<IEnumerable<ProductViewModel>> GetAllProduct(ProductSerchRequest request);
        Task<IEnumerable<ProductViewModel>> GetProductById(int id);
        Task CreateProduct(ProductViewModel request);
        Task Update(ProductViewModel request);
        Task<ProductViewModel> GetALlPrDF();
        bool DeleteProduct(List<requestDeleted> id);
    }
}
