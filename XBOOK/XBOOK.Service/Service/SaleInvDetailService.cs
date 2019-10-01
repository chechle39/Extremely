using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;
using XBOOK.Data.Base;
using XBOOK.Data.Entities;
using XBOOK.Service.Interfaces;
using XBOOK.Service.ViewModels;

namespace XBOOK.Service.Service
{
    public class SaleInvDetailService : ISaleInvDetailService
    {
        private readonly IRepository<SaleInvDetail> _saleInvDetailUowRepository;
        private readonly IUnitOfWork _uow;
        public SaleInvDetailService(IUnitOfWork uow)
        {
            _uow = uow;
            _saleInvDetailUowRepository = _uow.GetRepository<IRepository<SaleInvDetail>>();
        }

        public async Task CreateListSaleDetail(List<SaleInvDetailViewModel> saleInvoiceViewModel)
        {
            var saleDetail = new List<SaleInvDetailViewModel>();
            foreach(var item in saleInvoiceViewModel)
            {
                var saleDetailData = new SaleInvDetailViewModel
                {
                    Amount = item.Price * item.Qty,
                    Qty = item.Qty,
                    Price = item.Price,
                    Description = item.Description,
                    Id = item.Id,
                    InvoiceId = item.InvoiceId,
                    ProductId = item.ProductId,
                    ProductName = item.ProductName,
                    Vat = item.Vat
                };
                saleDetail.Add(saleDetailData);
            }
            var saleInvoiceDetailCreate = Mapper.Map<List<SaleInvDetailViewModel>, List<SaleInvDetail>>(saleDetail);
            await _saleInvDetailUowRepository.Add(saleInvoiceDetailCreate);
        }

        public async Task CreateSaleInvDetail(SaleInvDetailViewModel saleInvoiceViewModel)
        {
            var saleInvoiceDetailCreate = Mapper.Map<SaleInvDetailViewModel, SaleInvDetail>(saleInvoiceViewModel);
            await _saleInvDetailUowRepository.Add(saleInvoiceDetailCreate);
        }

        public async Task<IEnumerable<SaleInvDetailViewModel>> GetAllSaleInvoiceDetail()
        {
            return await _saleInvDetailUowRepository.GetAll().ProjectTo<SaleInvDetailViewModel>().ToListAsync();
        }

        public async Task UpdateListSaleDetail(List<SaleInvDetailViewModel> saleInvoiceViewModel)
        {
            var saleDetail = new List<SaleInvDetailViewModel>();
            foreach (var item in saleInvoiceViewModel)
            {
                var saleDetailData = new SaleInvDetailViewModel
                {
                    Amount = item.Price * item.Qty,
                    Qty = item.Qty,
                    Price = item.Price,
                    Description = item.Description,
                    Id = item.Id,
                    InvoiceId = item.InvoiceId,
                    ProductId = item.ProductId,
                    ProductName = item.ProductName,
                    Vat = item.Vat
                };
                saleDetail.Add(saleDetailData);
            }
            var saleInvoiceDetailCreate = Mapper.Map<List<SaleInvDetailViewModel>, List<SaleInvDetail>>(saleDetail);
            await _saleInvDetailUowRepository.Update(saleInvoiceDetailCreate);
            throw new System.NotImplementedException();
        }
    }
}
