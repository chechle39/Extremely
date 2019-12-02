using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using XBOOK.Data.Base;
using XBOOK.Data.Entities;
using XBOOK.Data.Interfaces;
using XBOOK.Data.Model;
using XBOOK.Data.ViewModels;

namespace XBOOK.Data.Repositories
{
    public class ProductRepository : Repository<Product>, IProductRepository
    {
        public ProductRepository(DbContext context) : base(context)
        {
        }

        public async Task<IEnumerable<ProductViewModel>> GetAllProductAsync(ProductSerchRequest request)
        {
            var listData = new List<ProductViewModel>();
            if (request.IsGrid == true)
            {
                if (string.IsNullOrEmpty(request.ProductKeyword))
                {
                    listData = await Entities.ProjectTo<ProductViewModel>().Take(200).ToListAsync();
                }
                else
                if (!string.IsNullOrEmpty(request.ProductKeyword))
                {
                    var keyWord = "%" + request.ProductKeyword + "%";
                    var data = from c in Entities
                               where EF.Functions.Like(c.productName, keyWord) || EF.Functions.Like(c.description, keyWord)
                               select c;

                    listData = data.ProjectTo<ProductViewModel>().ToList();
                }
            }
            else
            {
                
                if (!string.IsNullOrEmpty(request.ProductKeyword))
                {

                    var keyWord = "%" + request.ProductKeyword + "%";
                    var data = from c in Entities
                               where EF.Functions.Like(c.productName, keyWord) || EF.Functions.Like(c.description, keyWord)
                               select c;

                    listData = data.ProjectTo<ProductViewModel>().Take(20).ToList();
                }
                else
                {
                    listData = await Entities.ProjectTo<ProductViewModel>().Take(20).ToListAsync();
                }
            }
            return listData;
        }

        public IEnumerable<Product> GetLDFProduct()
        {
            var ListClient = Entities;
            return ListClient;
        }

        public bool removeProduct(long id)
        {
            var ListProduct = Entities.Where(x => x.productID == id).ToList();
            Entities.Remove(ListProduct[0]);
            return true;
        }

        public bool SaveProduct(ProductViewModel rs)
        {
            var update = AutoMapper.Mapper.Map<ProductViewModel, Product>(rs);
            var createCl = Entities.Add(update);
            return true;
        }
    }
}
