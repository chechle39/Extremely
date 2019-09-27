using System.Collections.Generic;
using System.Linq;
using AutoMapper;
using AutoMapper.QueryableExtensions;
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
        public bool CreateSaleInvDetail(SaleInvDetailViewModel saleInvoiceViewModel)
        {
            var saleInvoiceDetailCreate = Mapper.Map<SaleInvDetailViewModel, SaleInvDetail>(saleInvoiceViewModel);
            _saleInvDetailUowRepository.Add(saleInvoiceDetailCreate);
            _uow.SaveChanges();
            return true;
        }

        public IEnumerable<SaleInvDetailViewModel> GetAllSaleInvoiceDetail()
        {
            return _saleInvDetailUowRepository.GetAll().ProjectTo<SaleInvDetailViewModel>().ToList();
        }
    }
}
