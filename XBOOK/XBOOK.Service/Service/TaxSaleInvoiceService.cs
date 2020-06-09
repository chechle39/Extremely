using AutoMapper.QueryableExtensions;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using XBOOK.Common.Method;
using XBOOK.Data.Base;
using XBOOK.Data.Entities;
using XBOOK.Data.Interfaces;
using XBOOK.Data.ViewModels;
using XBOOK.Service.Interfaces;

namespace XBOOK.Service.Service
{
    public class TaxSaleInvoiceService : ITaxSaleInvoiceService
    {
        public readonly ITaxSaleInvoiceRepository _taxSaleInvoiceRepository;
        private readonly IUnitOfWork _uow;
        private readonly IRepository<TaxSaleInvoice> _taxSaleInvoiceUowRepository;
        public TaxSaleInvoiceService(ITaxSaleInvoiceRepository taxSaleInvoiceRepository, IUnitOfWork uow)
        {
            _taxSaleInvoiceRepository = taxSaleInvoiceRepository;
            _uow = uow;
            _taxSaleInvoiceUowRepository = _uow.GetRepository<IRepository<TaxSaleInvoice>>();
        }
        public async Task<bool> CreateTaxInvoice(TaxSaleInvoiceModelRequest taxInvoiceViewModel)
        {
            var save = await _taxSaleInvoiceRepository.CreateTaxInvoice(taxInvoiceViewModel);
            _uow.SaveChanges();
            return save;
        }

        public async Task<bool> UpdateTaxInvoice(TaxSaleInvoiceModelRequest taxInvoiceViewModel)
        {
            var save = await _taxSaleInvoiceRepository.UpdateTaxInvoice(taxInvoiceViewModel);
            // _uow.SaveChanges();
            return save;
        }
        public async Task<IEnumerable<TaxSaleInvoice>> GetTaxSaleInvoiceById(long id)
        {

            //  var saleInvoie=await _saleInvoiceUowRepository.GetAll().ProjectTo<SaleInvoiceViewModel>().Where(x => x.InvoiceId == id).ToListAsync();
            var saleInvoie = await _taxSaleInvoiceRepository.GetTaxSaleInvoiceById(id);
            /*saleInvoie = SerchData(null, null, null, saleInvoie.ToList(), null)*/
            ;
            return saleInvoie;
        }
        public TaxSaleInvoice GetALlDF()
        {
            var data = _taxSaleInvoiceUowRepository.GetAll().LastOrDefault();
            return data;
        }

        public TaxSaleInvoice GetLastInvoice()
        {
            var data = _taxSaleInvoiceRepository.GetLastInvoice();
            var lastInvoice = new TaxSaleInvoice();
            if (data.Result != null && data.Result.taxInvoiceID > 0)
            {
                lastInvoice = data.Result;
                lastInvoice.invoiceNumber = MethodCommon.InputString(lastInvoice.invoiceNumber);
                return lastInvoice;
            }
            else
            {
                return lastInvoice;
            }

        }
    }
}
