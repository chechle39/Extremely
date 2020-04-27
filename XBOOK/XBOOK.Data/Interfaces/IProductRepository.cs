using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using XBOOK.Data.Base;
using XBOOK.Data.Entities;
using XBOOK.Data.Model;
using XBOOK.Data.ViewModels;

namespace XBOOK.Data.Interfaces
{
    public interface IProductRepository : IRepository<Product>
    {
        IEnumerable<Product> GetLDFProduct();
        bool removeProduct(long id);
        bool SaveProduct(ProductViewModel rs);
        Task<IEnumerable<ProductViewModel>> GetAllProductAsync(ProductSerchRequest request);
        Task<IEnumerable<ProductViewModel>> GetAllProductForSearchAsync(ProductSerchRequest request);
        Product GetByProductId(int id);

    }
}
