using System.Collections.Generic;
using System.Threading.Tasks;
using XBOOK.Data.Base;
using XBOOK.Data.Entities;
using XBOOK.Data.Interfaces;
using XBOOK.Data.ViewModels;
using XBOOK.Service.Interfaces;

namespace XBOOK.Service.Service
{
    public class TaxInvDetailService : ITaxInvDetailService
    {
        private readonly IUnitOfWork _uow;
        private readonly ITaxInvDetailRepository _taxInvDetailRepository;
        public TaxInvDetailService(IUnitOfWork uow, ITaxInvDetailRepository taxInvDetailRepository)
        {
            _uow = uow;
            _taxInvDetailRepository = taxInvDetailRepository;
        }
        public async Task<bool> CreateTaxInvDetail(TaxInvDetailViewModel taxInvDetailViewModel)
        {
            var save = await _taxInvDetailRepository.CreateTaxInvDetail(taxInvDetailViewModel);
            _uow.SaveChanges();
            return save;
        }

        public async Task<TaxSaleInvDetail> GetTaxInvoiceBySaleInvDetailId(long Id)
        {
            return await _taxInvDetailRepository.GetTaxInvoiceBySaleInvDetailId(Id);
        }

        public async Task<bool> UpdateTaxInvDetail(TaxInvDetailViewModel taxInvDetailViewModel)
        {
            var save = await _taxInvDetailRepository.UpdateTaxInvDetail(taxInvDetailViewModel);
            _uow.SaveChanges();
            return save;
        }
    }
}
