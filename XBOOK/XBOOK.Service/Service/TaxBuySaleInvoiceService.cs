using AutoMapper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Xbook.TaxInvoice.Repositories;
using XBOOK.Data.Base;
using XBOOK.Data.Entities;
using XBOOK.Data.Interfaces;
using XBOOK.Data.Model;
using XBOOK.Data.ViewModels;
using XBOOK.Service.Interfaces;

namespace XBOOK.Service.Service
{
    public class TaxBuySaleInvoiceService : ITaxBuySaleInvoiceService
    {
        public readonly ITaxBuyInvoiceRepository _taxBuyInvoiceRepository;
        private readonly IUnitOfWork _uow;
        private readonly IRepository<TaxBuyInvoice> _taxBuyInvoiceUowRepository;
      //  private readonly ITaxBuyInvDetailService _taxBuyInvDetailService;
        private readonly IClientService _iclientService;
        private readonly IClientRepository _iClientRepository;
        private readonly Invoice_TaxInvoiceRepository _iInvoice_TaxInvoiceRepository;
        public TaxBuySaleInvoiceService(
            ITaxBuyInvoiceRepository taxBuyInvoiceRepository, 
            IUnitOfWork uow, IClientService iclientService, 
            IClientRepository iClientRepository, 
           // ITaxBuyInvDetailService taxBuyInvDetailService,
            Invoice_TaxInvoiceRepository iInvoice_TaxInvoiceRepository
            )
        {
            _taxBuyInvoiceRepository = taxBuyInvoiceRepository;
            _uow = uow;
            _taxBuyInvoiceUowRepository = _uow.GetRepository<IRepository<TaxBuyInvoice>>();
            _iclientService = iclientService;
            _iClientRepository = iClientRepository;
         //   _taxBuyInvDetailService = taxBuyInvDetailService;
            _iInvoice_TaxInvoiceRepository = iInvoice_TaxInvoiceRepository;
        }
        public async Task<bool> CreateTaxInvoice(TaxSaleInvoiceModelRequest taxInvoiceViewModel)
        {
            //try add client if not exist
            if (taxInvoiceViewModel.clientID == 0 &&
                !String.IsNullOrEmpty(taxInvoiceViewModel.clientName))
            {
                var ClientViewModel = new ClientCreateRequet()
                {
                    Address = taxInvoiceViewModel.address,
                    ClientName = taxInvoiceViewModel.clientName,
                    Email = taxInvoiceViewModel.email,
                    ContactName = taxInvoiceViewModel.contactName,
                    Note = taxInvoiceViewModel.note,
                    Tag = taxInvoiceViewModel.tag,
                    TaxCode = taxInvoiceViewModel.taxCode,
                    ClientID = (int)taxInvoiceViewModel.clientID
                };
                _iclientService.CreateClient(ClientViewModel);
            }

            //get Clientid
            var client = _iClientRepository.GetClientByClientName(taxInvoiceViewModel.clientName).Result;
            taxInvoiceViewModel.clientID = client.ClientId;

            var model = Mapper.Map<TaxSaleInvoiceModelRequest, TaxBuyInvoice>(taxInvoiceViewModel);

            //_taxSaleInvoiceRepository.CreateTaxInvoice(taxInvoiceViewModel);
            _uow.BeginTransaction();
            _taxBuyInvoiceUowRepository.AddData(model);
            _uow.SaveChanges();
            _uow.CommitTransaction();

            //add tax invoice detail
            if (taxInvoiceViewModel.TaxInvDetailView != null && taxInvoiceViewModel.TaxInvDetailView.Any())
            {
                taxInvoiceViewModel.TaxInvDetailView.ForEach(item =>
                {
                    item.taxInvoiceID = model.invoiceID;
                 //   _taxBuyInvDetailService.CreateTaxInvDetail(item);
                });
            }

            //update add records table Invoice_TaxInvoice
            if (!string.IsNullOrEmpty(taxInvoiceViewModel.invoiceNumber))
            {
                taxInvoiceViewModel.invoiceNumber.Split(',').ToList().ForEach(async item =>
                {
                    var data = new Invoice_TaxInvoiceViewModel()
                    {
                        invoiceNumber = item,
                        ID = 0,
                        isSale = true,
                        taxInvoiceNumber = model.TaxInvoiceNumber,
                        amount = model.subTotal
                    };
                    await _iInvoice_TaxInvoiceRepository.SaveInvoiceTaxInvoice(data);

                    _uow.SaveChanges();
                });
            }
            return await Task.FromResult(true);
        }

        public Task<bool> DeletedTaxSaleInv(List<requestDeleted> deleted)
        {
            throw new NotImplementedException();
        }

        public TaxSaleInvoice GetALlDF()
        {
            throw new NotImplementedException();
        }

        public TaxSaleInvoice GetLastInvoice()
        {
            throw new NotImplementedException();
        }

        public Task<IEnumerable<TaxInvoiceViewModel>> GetTaxSaleInvoiceById(long id)
        {
            throw new NotImplementedException();
        }

        public Task<bool> UpdateTaxInvoice(TaxSaleInvoiceModelRequest taxInvoiceViewModel)
        {
            throw new NotImplementedException();
        }
    }
}
