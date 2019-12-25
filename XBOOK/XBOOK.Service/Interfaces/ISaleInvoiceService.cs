﻿using System.Collections.Generic;
using System.Threading.Tasks;
using XBOOK.Data.Model;
using XBOOK.Data.ViewModels;

namespace XBOOK.Service.Interfaces
{
    public interface ISaleInvoiceService
    {
        Task<IEnumerable<SaleInvoiceViewModel>> GetAllSaleInvoice(SaleInvoiceListRequest request);
        void Update(SaleInvoiceViewModel saleInvoiceViewModel);
        bool CreateSaleInvoice(SaleInvoiceModelRequest saleInvoiceViewModel);
        Task<IEnumerable<SaleInvoiceViewModel>> GetSaleInvoiceById(long id);
        Task<bool> DeletedSaleInv(List<requestDeleted> request);
        SaleInvoiceViewModel GetALlDF();
        SaleInvoiceViewModel GetLastInvoice();
    }
}
