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
                    var prod = new List<Product>();
                    foreach (var item in data)
                    {
                        var obj = new Product()
                        {
                            productName = item.Unit != null ? item.productName + "(" + item.Unit + ")" : item.productName,
                            unitPrice = item.unitPrice,
                            Unit = item.Unit,
                            categoryID = item.categoryID,
                            description = item.description,
                            productID = item.productID,
                            SaleInvDetails = item.SaleInvDetails,
                        };
                        prod.Add(obj);
                    }
                    listData = prod.AsQueryable().ProjectTo<ProductViewModel>().Take(20).ToList();
                  //  listData = data.ProjectTo<ProductViewModel>().Take(20).ToList();
                }
                else
                {
                    var data  = await Entities.ProjectTo<ProductViewModel>().Take(20).ToListAsync();
                    var prod = new List<Product>();
                    foreach (var item in data)
                    {
                        var obj = new Product()
                        {
                            productName = item.Unit != null ? item.productName + "(" + item.Unit + ")" : item.productName,
                            unitPrice = item.unitPrice,
                            Unit = item.Unit,
                            categoryID = item.categoryID,
                            description = item.description,
                            productID = item.productID,
                        };
                        prod.Add(obj);
                    }
                    listData = prod.AsQueryable().ProjectTo<ProductViewModel>().Take(20).ToList();
                }
            }
            return listData;
        }

        public Product GetByProductId(int id)
        {
            try
            {
                var data = Entities.Where(x => x.productID == id).ToList()[0];
                return data;
            } catch(Exception ex)
            {

            }
            return null;
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
