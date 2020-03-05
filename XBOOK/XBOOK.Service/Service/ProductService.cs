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

        public bool DeleteProduct(List<requestDeleted> id)
        {
            for(int i = 0; i < id.Count(); i++)
            {
                _iProductRespository.removeProduct(id[i].id);
            }
            try
            {
                _uow.SaveChanges();
            }catch(Exception e)
            {
                return false;
            }
            return true;
        }

        public async Task<ProductViewModel> GetALlPrDF()
        {
            var data = await _productUowRepository.GetAll().ProjectTo<ProductViewModel>().LastOrDefaultAsync();
            return data;
        }

        public async Task<IEnumerable<ProductViewModel>> GetAllProduct(ProductSerchRequest request)
        {
            var listData = await _iProductRespository.GetAllProductAsync(request);
            return listData;
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
        public bool CreateProductImport(List<ProductViewModel> request)
        {
            var productCreate = Mapper.Map<List<ProductViewModel>, List<Product>>(request);
            foreach (var item in request)
            {
                var product = new Product()
                {
                    productID = 0,
                    productName = item.productName,
                    description = item.description,
                    unitPrice = item.unitPrice,
                    categoryID = item.categoryID,
                    Unit = item.Unit,
                };
                _productUowRepository.AddData(product);
                _uow.SaveChanges();
            }
            return true;
        }
        public byte[] GetDataProductAsync(List<ProductViewModel> request)
        {
            var comlumHeadrs = new string[]
            {
                "productID",
                "productName",
                "description",
                "unitPrice",
                "categoryID",
                "Unit",
            };
            var listGen = new List<ProductViewModel>();

            listGen = request;

            var csv = (from item in listGen
                       select new object[]
                       {
                          item.productID,
                          item.productName,
                          item.description,
                          item.unitPrice,
                          item.categoryID,
                          item.Unit,
                       }).ToList();
            var csvData = new StringBuilder();

            csv.ForEach(line =>
            {
                csvData.AppendLine(string.Join(",", line));
            });
            byte[] buffer = Encoding.UTF8.GetBytes($"{string.Join(",", comlumHeadrs)}\r\n{csvData.ToString()}");
            return buffer;

        }
    }
}
