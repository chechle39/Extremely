using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using XBOOK.Data.Base;
using XBOOK.Data.Entities;
using XBOOK.Data.ViewModels;
using XBOOK.Service.Interfaces;

namespace XBOOK.Service.Service
{
    public class ProductService: IProductService
    {
        private readonly IRepository<Product> _productUowRepository;
        private readonly IUnitOfWork _uow;
        public ProductService(IRepository<Product> productUowRepository, IUnitOfWork uow)
        {
            _productUowRepository = productUowRepository;
            _uow = uow;
        }

        public async Task CreateProduct(ProductViewModel request)
        {
            var clientCreate = Mapper.Map<ProductViewModel, Product>(request);
            await _productUowRepository.Add(clientCreate);
        }

        public async Task<IEnumerable<ProductViewModel>> GetAllProduct()
        {
            return await _productUowRepository.GetAll().ProjectTo<ProductViewModel>().ToListAsync();
        }

        public async Task<IEnumerable<ProductViewModel>> GetProductById(int id)
        {
            return await _productUowRepository.GetAll().ProjectTo<ProductViewModel>().Where(x => x.productID == id).ToListAsync();
        }

        public async Task Update(ProductViewModel request)
        {
            var product = Mapper.Map<ProductViewModel, Product>(request);
            await _productUowRepository.Update(product);
        }
    }
}
