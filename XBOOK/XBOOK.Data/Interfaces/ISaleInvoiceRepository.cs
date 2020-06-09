using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using XBOOK.Data.Base;
using XBOOK.Data.Entities;
using XBOOK.Data.Model;
using XBOOK.Data.ViewModels;

namespace XBOOK.Data.Interfaces
{
    public interface ISaleInvoiceRepository : IRepository<SaleInvoice>
    {
        bool UpdateSaleInv(SaleInvoiceViewModel rs);
        bool removeInv(long id);
        Task<SaleInvoiceViewModel> GetLastInvoice();
        Task<IEnumerable<SaleInvoiceViewModel>> GetSaleInvoiceById(long id);
        bool UpdateSaleInvEn(Invoice request , decimal sum);
        Task<bool> UpdateItem(long id, decimal sum);
    }
}
