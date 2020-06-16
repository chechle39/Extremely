﻿using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using XBOOK.Data.Entities;
using XBOOK.Data.Model;
using XBOOK.Data.ViewModels;

namespace XBOOK.Data.Interfaces
{
    public interface IBuyInvoiceRepository
    {
        Task<BuyInvoice> CreateBuyInvoice( BuyInvoiceModelRequest BuyInvoiceViewModel);
        Task<bool> Update(BuyInvoiceViewModel buyInvoiceViewModel);

        Task<bool> DeleteBuyInvoice(List<Deleted> request);
        Task<BuyInvoiceViewModel> GetALlDF();
        Task<BuyInvoiceViewModel> GetLastBuyInvoice();
        Task<IEnumerable<BuyInvoiceViewModel>> GetBuyInvoiceById(long id);
        bool UpdateSaleInvEn(Invoice request, decimal sum);
        Task<bool> UpdateItem(long id, decimal sum);
    }
}
