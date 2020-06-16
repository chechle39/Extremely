using AutoMapper;
using AutoMapper.QueryableExtensions;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
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
    public class TaxBuySaleInvoiceService : ITaxBuySaleInvoiceService
    {
        public readonly ITaxBuyInvoiceRepository _taxBuyInvoiceRepository;
        public readonly ITaxBuyInvDetailRepository _taxBuyInvDetailRepository;
        private readonly IUnitOfWork _uow;
        private readonly IRepository<TaxBuyInvoice> _taxBuyInvoiceUowRepository;
        private readonly ITaxBuyInvDetailService _taxBuyInvDetailService;
        private readonly ISupplierService _isupplierService;
        private readonly ISupplierRepository _isupplierRepository;
        private readonly IInvoice_TaxInvoiceRepository _iInvoice_TaxInvoiceRepository;
        private readonly IProductRepository _iProductRepository;
        XBookContext _context;
        public TaxBuySaleInvoiceService(
            ITaxBuyInvoiceRepository taxBuyInvoiceRepository, 
            IUnitOfWork uow,
            ISupplierService isupplierService,
            ISupplierRepository isupplierRepository,
            ITaxBuyInvDetailService taxBuyInvDetailService,
            XBookContext context,
            IProductRepository productRepository,
            ITaxBuyInvDetailRepository taxBuyInvDetailRepository,
            ISaleInvoiceRepository saleInvoiceRepository
            )
        {
            _taxBuyInvoiceRepository = taxBuyInvoiceRepository;
            _uow = uow;
            _taxBuyInvoiceUowRepository = _uow.GetRepository<IRepository<TaxBuyInvoice>>();
            _isupplierService = isupplierService;
            _isupplierRepository = isupplierRepository;
            _taxBuyInvDetailService = taxBuyInvDetailService;
            _context = context;
            _iInvoice_TaxInvoiceRepository = new Invoice_TaxInvoiceRepository(_context, saleInvoiceRepository);
            _taxBuyInvDetailRepository = taxBuyInvDetailRepository;
            _iProductRepository = productRepository;
        }
        public async Task<bool> CreateTaxInvoice(TaxBuyInvoiceModelRequest taxInvoiceViewModel)
        {
            //try add client if not exist
            if (taxInvoiceViewModel.supplierID == 0 &&
                !String.IsNullOrEmpty(taxInvoiceViewModel.supplierName))
            {
                var ClientViewModel = new SupplierCreateRequest()
                {
                    Address = taxInvoiceViewModel.address,
                    supplierName = taxInvoiceViewModel.supplierName,
                    Email = taxInvoiceViewModel.email,
                    ContactName = taxInvoiceViewModel.contactName,
                    Note = taxInvoiceViewModel.note,
                    Tag = taxInvoiceViewModel.tag,
                    TaxCode = taxInvoiceViewModel.taxCode,
                    supplierID = (int)taxInvoiceViewModel.supplierID
                };
                _isupplierService.CreateSupplier(ClientViewModel);
            }

            //get Clientid
            var client = _isupplierRepository.GetSupplierBySupplierName(taxInvoiceViewModel.supplierName).Result;
            taxInvoiceViewModel.supplierID = client.supplierID;

            var model = Mapper.Map<TaxBuyInvoiceModelRequest, TaxBuyInvoice>(taxInvoiceViewModel);

            //_taxSaleInvoiceRepository.CreateTaxInvoice(taxInvoiceViewModel);
            try
            {
                _uow.BeginTransaction();
                _taxBuyInvoiceUowRepository.AddData(model);
                _uow.SaveChanges();
                _uow.CommitTransaction();
            }
            catch(Exception ex)
            {

            }

            //add tax invoice detail
            if (taxInvoiceViewModel.TaxBuyInvDetailView != null && taxInvoiceViewModel.TaxBuyInvDetailView.Any())
            {
                taxInvoiceViewModel.TaxBuyInvDetailView.ForEach(item =>
                {
                    item.taxInvoiceID = model.invoiceID;
                    _taxBuyInvDetailService.CreateTaxInvDetail(item);
                });
            }

            //update add records table Invoice_TaxInvoice
            if (!string.IsNullOrEmpty(taxInvoiceViewModel.invoiceNumber))
            {
                //taxInvoiceViewModel.invoiceNumber.Split(',').ToList().ForEach(async item =>
                //{
                //    var data = new Invoice_TaxInvoiceViewModel()
                //    {
                //        invoiceNumber = item,
                //        ID = 0,
                //        isSale = false,
                //        taxInvoiceNumber = model.TaxInvoiceNumber,
                //        amount = model.subTotal
                //    };
                //    await _iInvoice_TaxInvoiceRepository.SaveInvoiceTaxInvoice(data);

                //    _uow.SaveChanges();
                //});
            }
            return await Task.FromResult(true);
        }

        public async Task<bool> DeletedTaxSaleInv(List<requestDeleted> deleted)
        {
            foreach (var item in deleted)
            {
                var getId = (await _taxBuyInvoiceRepository.GetTaxBuyInvoiceById(item.id)).ToList();
                await _taxBuyInvDetailRepository.RemoveTaxSaleInvByTaxInvoiceID(new Deleted() { id = item.id });
                //_uow.SaveChanges();
                await _taxBuyInvoiceRepository.removeTaxBuyInv(item.id);

                if (getId != null)
                {
                    //await _iInvoice_TaxInvoiceRepository.DeleteInvoiceTaxInvoiceByTaxInvoiceNumber(getId[0].TaxInvoiceNumber);
                }
                _uow.SaveChanges();
            }

            return await Task.FromResult(true);
        }

        public TaxBuyInvoice GetALlDF()
        {
            var data = _taxBuyInvoiceUowRepository.GetAll().LastOrDefault();
            return data;
        }

        public TaxBuyInvoice GetLastInvoice()
        {
            var data = _taxBuyInvoiceRepository.GetLastInvoice();
            var lastInvoice = new TaxBuyInvoice();
            if (data.Result != null && data.Result.invoiceID > 0)
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

        public async Task<bool> UpdateTaxInvoice(TaxBuyInvoiceModelRequest taxInvoiceViewModel)
        {
            var save = await _taxBuyInvoiceRepository.UpdateTaxBuyInvoice(taxInvoiceViewModel);
            _uow.SaveChanges();
            return save;
        }
        public async Task<IEnumerable<TaxBuyInvoiceViewModel>> GetTaxBuyInvoiceById(long id)
        {

            //  var saleInvoie=await _saleInvoiceUowRepository.GetAll().ProjectTo<SaleInvoiceViewModel>().Where(x => x.InvoiceId == id).ToListAsync();
            var taxsaleInvoice = await _taxBuyInvoiceRepository.GetTaxBuyInvoiceById(id);
            /*saleInvoie = SerchData(null, null, null, saleInvoie.ToList(), null)*/

            return this.GetTaxInvoiceViewModel(taxsaleInvoice);
        }

        private List<TaxBuyInvoiceViewModel> GetTaxInvoiceViewModel(IEnumerable<TaxBuyInvoice> taxSaleInvoices)
        {
            var listData = new List<TaxBuyInvoiceViewModel>();
            foreach (var taxSaleInvoice in taxSaleInvoices)
            {
                var item = new TaxBuyInvoiceViewModel()
                {
                    invoiceID = taxSaleInvoice.invoiceID,
                    amountPaid = taxSaleInvoice.amountPaid,
                    supplierID = taxSaleInvoice.supplierID,
                    discount = taxSaleInvoice.discount,
                    discRate = taxSaleInvoice.discRate,
                    dueDate = taxSaleInvoice.dueDate,
                    taxInvoiceNumber = taxSaleInvoice.TaxInvoiceNumber,
                    invoiceNumber = taxSaleInvoice.invoiceNumber,
                    invoiceSerial = taxSaleInvoice.invoiceSerial,
                    issueDate = taxSaleInvoice.issueDate,
                    note = taxSaleInvoice.note,
                    reference = taxSaleInvoice.reference,
                    TaxBuyInvDetailView = this.GetByIDTaxInvDetail(taxSaleInvoice.invoiceID),
                    status = taxSaleInvoice.status,
                    subTotal = taxSaleInvoice.subTotal,
                    term = taxSaleInvoice.term,
                    vatTax = taxSaleInvoice.vatTax,
                    SupplierData = (taxSaleInvoice.supplierID != null) ? GetClientByID(taxSaleInvoice.supplierID).ToList() : null,
                };
                listData.Add(item);
            }
            return listData;
        }
        private IEnumerable<SupplierViewModel> GetClientByID(int? id)
        {
            var payList = _uow.GetRepository<IRepository<Supplier>>();
            var listInDetail = payList.GetAll().ProjectTo<SupplierViewModel>().Where(x => x.supplierID == id).ToList();
            return listInDetail;
        }
        private List<TaxBuyInvDetailViewModel> GetByIDTaxInvDetail(long id)
        {
            var dataList = new List<TaxBuyInvDetailViewModel>();
            try
            {
                var payList = _uow.GetRepository<IRepository<TaxBuyInvDetail>>();
                var listInDetail = payList.GetAll().ProjectTo<TaxBuyInvDetailViewModel>().Where(x => x.taxInvoiceID == id).ToList();
                foreach (var item in listInDetail)
                {
                    var data = new TaxBuyInvDetailViewModel()
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
            catch (Exception ex)
            {
                throw ex;
            }
            return dataList;
        }
    }
}
