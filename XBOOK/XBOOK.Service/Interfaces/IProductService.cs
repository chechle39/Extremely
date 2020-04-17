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
        Task<bool> CreateProduct(ProductViewModel request);
        Task<bool> Update(ProductViewModel request);
        Task<ProductViewModel> GetALlPrDF();
        bool DeleteProduct(List<requestDeleted> id);
        byte[] GetDataProductAsync(List<ProductViewModel> request);
        bool CreateProductImport(List<ProductViewModel> request);
    }
}
