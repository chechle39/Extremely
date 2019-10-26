using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using XBOOK.Data.Base;
using XBOOK.Data.Entities;
using XBOOK.Data.Interfaces;
using XBOOK.Data.ViewModels;

namespace XBOOK.Data.Repositories
{
    public class ProductRepository : Repository<Product>, IProductRepository
    {
        public ProductRepository(DbContext context) : base(context)
        {
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
