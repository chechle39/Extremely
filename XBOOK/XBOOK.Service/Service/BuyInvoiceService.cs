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
using XAccLib.GL;

namespace XBOOK.Service.Service
{
    public class BuyInvoiceService: IBuyInvoiceService
    {
        private readonly IRepository<BuyInvoice> _buyInvoiceUowRepository;
        private readonly IBuyInvoiceRepository _buyInvoiceRepository;
        private readonly IProductRepository _productRepository;
        private readonly IUnitOfWork _uow;
        public BuyInvoiceService(IBuyInvoiceRepository buyInvoiceRepository, IUnitOfWork uow, IProductRepository productRepository)
        {
            _buyInvoiceRepository = buyInvoiceRepository;
            _uow = uow;
            _productRepository = productRepository;
            _buyInvoiceUowRepository = _uow.GetRepository<IRepository<BuyInvoice>>();
        }

        public async Task<bool> CreateBuyInvoice(BuyInvoiceModelRequest BuyInvoiceViewModel)
        {
            var data = await _buyInvoiceRepository.CreateBuyInvoice(BuyInvoiceViewModel);
            var saleInvoieLast = _buyInvoiceUowRepository.GetAll().ProjectTo<BuyInvoiceViewModel>().LastOrDefault();
            var obj = new List<BuyInvoiceViewModel>()
            {
                new BuyInvoiceViewModel()
                {
                    VatTax = saleInvoieLast.VatTax,
                    AmountPaid = saleInvoieLast.VatTax,
                    SupplierData = saleInvoieLast.SupplierData,
                    supplierID = saleInvoieLast.supplierID,
                    Discount = saleInvoieLast.Discount,
                    DiscRate = saleInvoieLast.DiscRate,
                    DueDate = saleInvoieLast.DueDate,
                    InvoiceId = saleInvoieLast.InvoiceId,
                    InvoiceNumber = saleInvoieLast.InvoiceNumber,
                    InvoiceSerial = saleInvoieLast.InvoiceSerial,
                    IssueDate = saleInvoieLast.IssueDate,
                    Note = saleInvoieLast.Note,
                    PaymentView = saleInvoieLast.PaymentView,
                    Reference = saleInvoieLast.Reference,
                    BuyInvDetailView = saleInvoieLast.BuyInvDetailView,
                    Status =saleInvoieLast.Status,
                    SubTotal = saleInvoieLast.SubTotal,
                    Term = saleInvoieLast.Term,
                }
            };
            var listData = GetAllBuyInv(obj);
            var objData = new BuyInvoiceViewModel()
            {
                VatTax = listData[0].VatTax,
                AmountPaid = listData[0].VatTax,
                SupplierData = listData[0].SupplierData,
                supplierID = listData[0].supplierID,
                Discount = listData[0].Discount == null ? 0 : listData[0].Discount,
                DiscRate = listData[0].DiscRate == null ? 0 : listData[0].DiscRate,
                DueDate = listData[0].DueDate,
                InvoiceId = listData[0].InvoiceId,
                InvoiceNumber = listData[0].InvoiceNumber,
                InvoiceSerial = listData[0].InvoiceSerial,
                IssueDate = listData[0].IssueDate,
                Note = listData[0].Note,
                PaymentView = listData[0].PaymentView,
                Reference = listData[0].Reference,
                BuyInvDetailView = listData[0].BuyInvDetailView,
                Status = listData[0].Status,
                SubTotal = listData[0].SubTotal,
                Term = listData[0].Term,
            };
            var saleInvoiceGL = new BuyInvoiceGL(_uow);
            saleInvoiceGL.Insert(objData);
            _uow.SaveChanges();
            return data;
        }

        public async Task<bool> DeleteBuyInvoice(List<Deleted> request)
        {
            var delete = await _buyInvoiceRepository.DeleteBuyInvoice(request);
            foreach (var item in request)
            {
                var buyInvViewModel = await GetBuyInvoiceById(item.id);
                var buyInvoiceGL = new BuyInvoiceGL(_uow);
                buyInvoiceGL.delete(buyInvViewModel.ToList()[0]);
            }
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
            var sale = new List<BuyInvoiceViewModel>()
            {
                new BuyInvoiceViewModel()
                {
                    VatTax = buyInvoiceViewModel.VatTax,
                    AmountPaid = buyInvoiceViewModel.VatTax,
                    SupplierData = buyInvoiceViewModel.SupplierData,
                    supplierID = buyInvoiceViewModel.supplierID,
                    Discount = buyInvoiceViewModel.Discount,
                    DiscRate = buyInvoiceViewModel.DiscRate,
                    DueDate = buyInvoiceViewModel.DueDate,
                    InvoiceId = buyInvoiceViewModel.InvoiceId,
                    InvoiceNumber = buyInvoiceViewModel.InvoiceNumber,
                    InvoiceSerial = buyInvoiceViewModel.InvoiceSerial,
                    IssueDate = buyInvoiceViewModel.IssueDate,
                    Note = buyInvoiceViewModel.Note,
                    PaymentView = buyInvoiceViewModel.PaymentView,
                    Reference = buyInvoiceViewModel.Reference,
                    BuyInvDetailView = buyInvoiceViewModel.BuyInvDetailView,
                    Status = buyInvoiceViewModel.Status,
                    SubTotal = buyInvoiceViewModel.SubTotal,
                    Term = buyInvoiceViewModel.Term,
                }
            };
            var listData = GetAllBuyInv(sale);
            var objData = new BuyInvoiceViewModel()
            {
                VatTax = listData[0].VatTax,
                AmountPaid = listData[0].VatTax,
                SupplierData = listData[0].SupplierData,
                supplierID = listData[0].supplierID,
                Discount = listData[0].Discount == null ? 0 : listData[0].Discount,
                DiscRate = listData[0].DiscRate == null ? 0 : listData[0].DiscRate,
                DueDate = listData[0].DueDate,
                InvoiceId = listData[0].InvoiceId,
                InvoiceNumber = listData[0].InvoiceNumber,
                InvoiceSerial = listData[0].InvoiceSerial,
                IssueDate = listData[0].IssueDate,
                Note = listData[0].Note,
                PaymentView = listData[0].PaymentView,
                Reference = listData[0].Reference,
                BuyInvDetailView = listData[0].BuyInvDetailView,
                Status = listData[0].Status,
                SubTotal = listData[0].SubTotal,
                Term = listData[0].Term,
            };
            var buyInvoiceGL = new BuyInvoiceGL(_uow);
            buyInvoiceGL.update(objData);
            return data;
        }

        //private List<BuyInvoiceViewModel> GetAllBuyInv(List<BuyInvoiceViewModel> buyInvoie)
        //{
        //    var listData = new List<BuyInvoiceViewModel>();
        //    foreach (var item in buyInvoie)
        //    {
        //        var listInvo = new BuyInvoiceViewModel()
        //        {
        //            InvoiceId = item.InvoiceId,
        //            AmountPaid = item.AmountPaid,
        //            supplierID = item.supplierID,
        //            Discount = item.Discount,
        //            DiscRate = item.DiscRate,
        //            DueDate = item.DueDate,
        //            InvoiceNumber = item.InvoiceNumber,
        //            InvoiceSerial = item.InvoiceSerial,
        //            IssueDate = item.IssueDate,
        //            Note = item.Note,
        //            Reference = item.Reference,
        //            BuyInvDetailView = GetByIDInDetail(item.InvoiceId).ToList(),
        //            Status = item.Status,
        //            SubTotal = item.SubTotal,
        //            Term = item.Term,
        //            VatTax = item.VatTax,
        //            PaymentView = GetByIDPay(item.InvoiceId).ToList(),
        //            SupplierData = (item.supplierID != null) ? GetSupplierByIDList(item.supplierID).ToList() : null
        //        };
        //        listData.Add(listInvo);
        //    }

        //    return listData;
        //}

        //private IEnumerable<SupplierViewModel> GetSupplierByIDList(int? id)
        //{
        //    var payList = _uow.GetRepository<IRepository<Supplier>>();
        //    var listInDetail = payList.GetAll().ProjectTo<SupplierViewModel>().Where(x => x.supplierID == id).ToList();
        //    return listInDetail;
        //}
    }
}
