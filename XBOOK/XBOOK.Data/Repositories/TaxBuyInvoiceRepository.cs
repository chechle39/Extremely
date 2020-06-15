using AutoMapper;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using XBOOK.Data.Base;
using XBOOK.Data.Entities;
using XBOOK.Data.Interfaces;
using XBOOK.Data.ViewModels;

namespace XBOOK.Data.Repositories
{
    public class TaxBuyInvoiceRepository : Repository<TaxBuyInvoice>, ITaxBuyInvoiceRepository
    {
        private readonly IUnitOfWork _unitOfWork;
        public TaxBuyInvoiceRepository(XBookContext db, IUnitOfWork unitOfWork) : base(db)
        {
            _unitOfWork = unitOfWork;
        }
        public async Task<bool> CreateTaxBuyInvoice(TaxSaleInvoiceModelRequest taxBuyInvoiceViewModel)
        {
            var taxInvoiceCreate = Mapper.Map<TaxSaleInvoiceModelRequest, TaxBuyInvoice>(taxBuyInvoiceViewModel);
            _unitOfWork.BeginTransaction();
            Entities.Add(taxInvoiceCreate);
            _unitOfWork.SaveChanges();
            _unitOfWork.CommitTransaction();
            return await Task.FromResult(true);
        }

        public Task<TaxBuyInvoice> GetLastInvoice()
        {
            throw new NotImplementedException();
        }

        public Task<IEnumerable<TaxBuyInvoice>> GetTaxInvoiceBySaleInvId(string taxInvoiceNumber)
        {
            throw new NotImplementedException();
        }

        public Task<IEnumerable<TaxBuyInvoice>> GetTaxSaleInvoiceById(long id)
        {
            throw new NotImplementedException();
        }

        public Task<bool> removeTaxSaleInv(long id)
        {
            throw new NotImplementedException();
        }

        public Task<bool> UpdateTaxInvoice(TaxSaleInvoiceModelRequest taxInvoiceViewModel)
        {
            throw new NotImplementedException();
        }
    }
}
