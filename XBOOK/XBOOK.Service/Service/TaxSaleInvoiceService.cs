using AutoMapper;
using AutoMapper.QueryableExtensions;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Xbook.TaxInvoice.Interfaces;
using Xbook.TaxInvoice.Repositories;
using XBOOK.Common.Method;
using XBOOK.Data.Base;
using XBOOK.Data.Entities;
using XBOOK.Data.Interfaces;
using XBOOK.Data.Model;
using XBOOK.Data.ViewModels;
using XBOOK.Service.Interfaces;

namespace XBOOK.Service.Service
{
    public class TaxSaleInvoiceService : ITaxSaleInvoiceService
    {
        public readonly ITaxSaleInvoiceRepository _taxSaleInvoiceRepository;
        private readonly IUnitOfWork _uow;
        private readonly IRepository<TaxSaleInvoice> _taxSaleInvoiceUowRepository;
        private readonly IRepository<TaxSaleInvDetail> _taxSaleInvDetailUowRepository;
        private readonly ITaxInvDetailRepository _taxSaleInvDetailRepository;
        private readonly IRepository<Client> _clientUowRepository;
        private readonly IProductRepository _iProductRepository;
        private readonly ITaxInvDetailService _taxInvDetailService;
        private readonly IClientService _iclientService;
        private readonly IClientRepository _iClientRepository;
        private readonly Invoice_TaxInvoiceRepository _iInvoice_TaxInvoiceRepository;
        private readonly XBookContext _context;
        private readonly ISaleInvoiceRepository _saleInvoiceRepository;
        public TaxSaleInvoiceService(
             IBuyInvoiceRepository buyInvoiceRepository,
            ITaxSaleInvoiceRepository taxSaleInvoiceRepository,
            ITaxInvDetailRepository taxSaleInvDetailRepository,
            IUnitOfWork uow,
            IProductRepository productRepository,
            ITaxInvDetailService taxInvDetailService,
            IClientService clientService,
            IClientRepository clientRepository,
            XBookContext context,
            ISaleInvoiceRepository saleInvoiceRepository
            )
        {
            _context = context;
            _saleInvoiceRepository = saleInvoiceRepository;
            _taxSaleInvoiceRepository = taxSaleInvoiceRepository;
            _taxSaleInvDetailRepository = taxSaleInvDetailRepository;
            _iProductRepository = productRepository;
            _uow = uow;
            _taxSaleInvoiceUowRepository = _uow.GetRepository<IRepository<TaxSaleInvoice>>();
            _taxSaleInvDetailUowRepository = _uow.GetRepository<IRepository<TaxSaleInvDetail>>();
            _clientUowRepository = uow.GetRepository<IRepository<Client>>();
            _taxInvDetailService = taxInvDetailService;
            _iclientService = clientService;
            _iClientRepository = clientRepository;
            _iInvoice_TaxInvoiceRepository = new Invoice_TaxInvoiceRepository(_context, _saleInvoiceRepository, buyInvoiceRepository);

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

            var model = Mapper.Map<TaxSaleInvoiceModelRequest, TaxSaleInvoice>(taxInvoiceViewModel);

             var saveTax = _taxSaleInvoiceRepository.CreateTaxInvoice(taxInvoiceViewModel);

            //add tax invoice detail
            if (taxInvoiceViewModel.TaxInvDetailView != null && taxInvoiceViewModel.TaxInvDetailView.Any())
            {
                taxInvoiceViewModel.TaxInvDetailView.ForEach(item =>
                {
                    item.taxInvoiceID = saveTax.taxInvoiceID;
                    _taxInvDetailService.CreateTaxInvDetail(item);
                });
            }

            //update add records table Invoice_TaxInvoice
            if (!string.IsNullOrEmpty(taxInvoiceViewModel.invoiceNumber))
            {

                foreach (var item in taxInvoiceViewModel.invoiceReferenceList)
                {
                    var data = new Invoice_TaxInvoiceViewModel()
                    {
                        invoiceNumber = item.invoiceNumber,
                        ID = 0,
                        isSale = true,
                        taxInvoiceNumber = saveTax.TaxInvoiceNumber,
                        amount = (saveTax.subTotal + saveTax.vatTax) - saveTax.discount,
                        invoiceAmount = saveTax.subTotal,
                        invoiceID = item.InvoiceID,
                        taxInvoiceID = saveTax.taxInvoiceID,
                    };
                    await _iInvoice_TaxInvoiceRepository.SaveInvoiceTaxInvoice(data, false);

                    var save = _saleInvoiceRepository.UpdateItemTaxNum(item.InvoiceID, saveTax.TaxInvoiceNumber).Result;
                    _uow.SaveChanges();
                }
            }
            return true;
        }

        public async Task<bool> UpdateTaxInvoice(TaxSaleInvoiceModelRequest taxInvoiceViewModel)
        {
            var save = await _taxSaleInvoiceRepository.UpdateTaxInvoice(taxInvoiceViewModel);
            _uow.SaveChanges();
            return save;
        }
        public async Task<IEnumerable<TaxInvoiceViewModel>> GetTaxSaleInvoiceById(long id)
        {

            //  var saleInvoie=await _saleInvoiceUowRepository.GetAll().ProjectTo<SaleInvoiceViewModel>().Where(x => x.InvoiceId == id).ToListAsync();
            var taxsaleInvoice = await _taxSaleInvoiceRepository.GetTaxSaleInvoiceById(id);
            /*saleInvoie = SerchData(null, null, null, saleInvoie.ToList(), null)*/
            
            return this.GetTaxInvoiceViewModel(taxsaleInvoice);
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
                lastInvoice.TaxInvoiceNumber = MethodCommon.InputString(lastInvoice.TaxInvoiceNumber);
                return lastInvoice;
            }
            else
            {
                return lastInvoice;
            }

        }
        public async Task<bool> DeletedTaxSaleInv(List<requestDeleted> deleted)
        {
            foreach (var item in deleted)
            {
                var getId = (await _taxSaleInvoiceRepository.GetTaxSaleInvoiceById(item.id)).ToList();
                await _taxSaleInvDetailRepository.RemoveTaxSaleInvByTaxInvoiceID(new Deleted() { id = item.id });
                //_uow.SaveChanges();
                var remove = await _taxSaleInvoiceRepository.removeTaxSaleInv(item.id);

                if(remove)
                {
                    await _iInvoice_TaxInvoiceRepository.DeleteInvoiceTaxInvoiceByTaxInvoiceNumber(getId[0].TaxInvoiceNumber, true);
                }
                _uow.SaveChanges();
            }

            return await Task.FromResult(true);
        }
        

        private List<TaxInvoiceViewModel> GetTaxInvoiceViewModel(IEnumerable<TaxSaleInvoice> taxSaleInvoices)
        {
            var listData = new List<TaxInvoiceViewModel>();
            foreach (var taxSaleInvoice in taxSaleInvoices)
            {
                var item = new TaxInvoiceViewModel()
                {
                    taxInvoiceID = taxSaleInvoice.taxInvoiceID,
                    amountPaid = taxSaleInvoice.amountPaid,
                    clientID = taxSaleInvoice.clientID,
                    discount = taxSaleInvoice.discount,
                    discRate = taxSaleInvoice.discRate,
                    dueDate = taxSaleInvoice.dueDate,
                    taxInvoiceNumber = taxSaleInvoice.TaxInvoiceNumber,
                    invoiceNumber = taxSaleInvoice.invoiceNumber,
                    invoiceSerial = taxSaleInvoice.invoiceSerial,
                    issueDate = taxSaleInvoice.issueDate,
                    note = taxSaleInvoice.note,
                    reference = taxSaleInvoice.reference,
                    TaxInvDetailView = this.GetByIDTaxInvDetail(taxSaleInvoice.taxInvoiceID),
                    status = taxSaleInvoice.status,
                    subTotal = taxSaleInvoice.subTotal,
                    term = taxSaleInvoice.term,
                    vatTax = taxSaleInvoice.vatTax,
                    ClientData = (taxSaleInvoice.clientID != null) ? GetClientByID(taxSaleInvoice.clientID).ToList() : null,
                };
                listData.Add(item);
            }
            return listData;
        }
        private IEnumerable<ClientViewModel> GetClientByID(int? id)
        {
            var payList = _uow.GetRepository<IRepository<Client>>();
            var listInDetail = payList.GetAll().ProjectTo<ClientViewModel>().Where(x => x.ClientId == id).ToList();
            return listInDetail;
        }
        private List<TaxInvDetailViewModel> GetByIDTaxInvDetail(long id)
        {
            var dataList = new List<TaxInvDetailViewModel>();
            try
            {
                var payList = _uow.GetRepository<IRepository<TaxSaleInvDetail>>();
                var listInDetail = payList.GetAll().ProjectTo<TaxInvDetailViewModel>().Where(x => x.taxInvoiceID == id).ToList();
                foreach (var item in listInDetail)
                {
                    var data = new TaxInvDetailViewModel()
                    {
                        amount = item.amount,
                        description = item.description,
                        ID = item.ID,
                        taxInvoiceID = item.taxInvoiceID,
                        price = item.price,
                        productID = item.productID,
                        productName = (_iProductRepository.GetByProductId(Int32.Parse(item.productID.ToString())).Unit != null) ? item.productName + " " + "(" + _iProductRepository.GetByProductId(Int32.Parse(item.productID.ToString())).Unit + ")" : item.productName,
                        qty = item.qty,
                        vat = item.vat,
                    };
                    dataList.Add(data);
                }
            }
            catch(Exception ex)
            {
                throw ex;
            }
            return dataList;
        }
    }
}
