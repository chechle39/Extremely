using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using XBOOK.Data.Base;
using XBOOK.Data.Entities;
using XBOOK.Data.Interfaces;
using XBOOK.Data.ViewModels;

namespace XBOOK.Data.Repositories
{
    public class SaleInvoiceRepository : Repository<SaleInvoice>, ISaleInvoiceRepository
    {
        public SaleInvoiceRepository(DbContext context) : base(context)
        {
        }

        public async Task<SaleInvoiceViewModel> GetLastInvoice()
        {
            if (Entities.Count() > 1)
            {
                var data = await Entities.ProjectTo<SaleInvoiceViewModel>().OrderByDescending(xx => xx.InvoiceId).Take(1).LastOrDefaultAsync();
                return data;
            }else if (Entities.Count() == 1)
            {
                var data = await Entities.ProjectTo<SaleInvoiceViewModel>().ToListAsync();
                return data[0];
            } else
            {
                return null;
            }
        }

        public async Task<IEnumerable<SaleInvoiceViewModel>> GetSaleInvoiceById(long id)
        {
            var data = await Entities.ProjectTo<SaleInvoiceViewModel>().Where(x=>x.InvoiceId == id).ToListAsync();
            return data;
        }

        public bool removeInv(long id)
        {
            var ListClient = Entities.Where(x => x.invoiceID == id).ToList();
            Entities.Remove(ListClient[0]);
            return true;
        }

        public bool UpdateSaleInv(SaleInvoiceViewModel rs)
        {
            var saleInvoice = Mapper.Map<SaleInvoiceViewModel, SaleInvoice>(rs);
            Entities.Update(saleInvoice);
            return true;
        }
    }
}
