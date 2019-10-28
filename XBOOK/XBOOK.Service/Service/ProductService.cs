using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using XBOOK.Data.Base;
using XBOOK.Data.Entities;
using XBOOK.Data.Interfaces;
using XBOOK.Data.Model;
using XBOOK.Data.ViewModels;
using XBOOK.Service.Interfaces;

namespace XBOOK.Service.Service
{
    public class ProductService: IProductService
    {
        private readonly IRepository<Product> _productUowRepository;
        private readonly IUnitOfWork _uow;
        private readonly IProductRepository _iProductRespository;
        private readonly XBookContext _context;
        public ProductService(IRepository<Product> productUowRepository, IUnitOfWork uow, XBookContext context, IProductRepository iProductRepository)
        {
            _productUowRepository = productUowRepository;
            _uow = uow;
            _context = context;
            _iProductRespository = iProductRepository;
        }

        public async Task CreateProduct(ProductViewModel request)
        {
            var clientCreate = Mapper.Map<ProductViewModel, Product>(request);
            await _productUowRepository.Add(clientCreate);
        }

        public bool DeleteProduct(long id)
        {
           // _iProductRespository.removeProduct(id);
            _uow.SaveChanges();
            return true;
        }

        public async Task<ProductViewModel> GetALlPrDF()
        {
            var data = await _productUowRepository.GetAll().ProjectTo<ProductViewModel>().LastOrDefaultAsync();
            return data;
        }

        public async Task<IEnumerable<ProductViewModel>> GetAllProduct(ProductSerchRequest request)
        {
            if (!string.IsNullOrEmpty(request.ProductKeyword))
            {
                var listData = await _productUowRepository.GetAll().ProjectTo<ProductViewModel>().ToListAsync();
                var query = listData.Where(x => x.productName.ToLowerInvariant().Contains(request.ProductKeyword) || x.description.ToLowerInvariant().Contains(request.ProductKeyword)).ToList();
                return query;
            }
            else
            {
                return await _productUowRepository.GetAll().ProjectTo<ProductViewModel>().ToListAsync();
            }
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
