using AutoMapper.QueryableExtensions;
using System;
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
    public class BuyInvoiceService: IBuyInvoiceService
    {
        private readonly IBuyInvoiceRepository _buyInvoiceRepository;
        private readonly IProductRepository _productRepository;
        private readonly IUnitOfWork _uow;
        public BuyInvoiceService(IBuyInvoiceRepository buyInvoiceRepository, IUnitOfWork uow, IProductRepository productRepository)
        {
            _buyInvoiceRepository = buyInvoiceRepository;
            _uow = uow;
            _productRepository = productRepository;
        }

        public async Task<bool> CreateBuyInvoice(BuyInvoiceModelRequest BuyInvoiceViewModel)
        {
            var data = await _buyInvoiceRepository.CreateBuyInvoice(BuyInvoiceViewModel);
            return data;
        }

        public async Task<bool> DeleteBuyInvoice(List<Deleted> request)
        {
            var delete = await _buyInvoiceRepository.DeleteBuyInvoice(request);
            _uow.SaveChanges();
            return delete;
        }

        public async Task<BuyInvoiceViewModel> GetALlDF()
        {
            try
            {
                var data = await _buyInvoiceRepository.GetALlDF();
                return data;
            }
            catch (Exception ex)
            {

            }
            return null;
        }

        public async Task<IEnumerable<BuyInvoiceViewModel>> GetBuyInvoiceById(long id)
        {
            var saleInvoie = await _buyInvoiceRepository.GetBuyInvoiceById(id);

            List<BuyInvoiceViewModel> listData = GetAllBuyInv(saleInvoie.ToList());
            return listData;
        }
        private List<BuyInvoiceViewModel> GetAllBuyInv(List<BuyInvoiceViewModel> saleInvoie)
        {
            var listData = new List<BuyInvoiceViewModel>();
            foreach (var item in saleInvoie)
            {
                var listInvo = new BuyInvoiceViewModel()
                {
                    InvoiceId = item.InvoiceId,
                    AmountPaid = item.AmountPaid,
                    supplierID = item.supplierID,
                    Discount = item.Discount,
                    DiscRate = item.DiscRate,
                    DueDate = item.DueDate,
                    InvoiceNumber = item.InvoiceNumber,
                    InvoiceSerial = item.InvoiceSerial,
                    IssueDate = item.IssueDate,
                    Note = item.Note,
                    Reference = item.Reference,
                    BuyInvDetailView = GetByIDInDetail(item.InvoiceId).ToList(),
                    Status = item.Status,
                    SubTotal = item.SubTotal,
                    Term = item.Term,
                    VatTax = item.VatTax,
                    PaymentView = GetByIDPay(item.InvoiceId).ToList(),
                    SupplierData = (item.supplierID != null) ? GetSupplierByID(item.supplierID).ToList() : null
                };
                listData.Add(listInvo);
            }

            return listData;
        }

        private IEnumerable<SupplierViewModel> GetSupplierByID(int? id)
        {
            var payList = _uow.GetRepository<IRepository<Supplier>>();
            var listInDetail = payList.GetAll().ProjectTo<SupplierViewModel>().Where(x => x.supplierID == id).ToList();
            return listInDetail;
        }
        private IEnumerable<Payment2ViewModel> GetByIDPay(long id)
        {
            var payList = _uow.GetRepository<IRepository<Payments_2>>();
            var listPay = payList.GetAll().ProjectTo<Payment2ViewModel>().Where(x => x.invoiceID == id).ToList();
            return listPay;
        }

        private IEnumerable<BuyInvDetailViewModel> GetByIDInDetail(long id)
        {
            var payList = _uow.GetRepository<IRepository<BuyInvDetail>>();
            var listInDetail = payList.GetAll().ProjectTo<BuyInvDetailViewModel>().Where(x => x.invoiceID == id).ToList();
            var dataList = new List<BuyInvDetailViewModel>();
            foreach (var item in listInDetail)
            {
                var data = new BuyInvDetailViewModel()
                {
                    amount = item.amount,
                    description = item.description,
                    ID = item.ID,
                    invoiceID = item.invoiceID,
                    price = item.price,
                    productID = item.productID,
                    productName = (_productRepository.GetByProductId(Int32.Parse(item.productID.ToString())).Unit != null) ? item.productName + " " + "(" + _productRepository.GetByProductId(Int32.Parse(item.productID.ToString())).Unit + ")" : item.productName,
                    qty = item.qty,
                    vat = item.vat,
                };
                dataList.Add(data);
            }
            return dataList;
        }

        public async Task<BuyInvoiceViewModel> GetLastBuyInvoice()
        {
            var data = await _buyInvoiceRepository.GetLastBuyInvoice();
            return data;
        }

        public async Task<bool> Update(BuyInvoiceViewModel buyInvoiceViewModel)
        {
            var data = await _buyInvoiceRepository.Update(buyInvoiceViewModel);
            return data;
        }
    }
}
