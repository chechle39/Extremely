using System.Collections.Generic;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.EntityFrameworkCore;
using XBOOK.Data.Base;
using XBOOK.Data.Entities;
using XBOOK.Data.Interfaces;
using XBOOK.Data.Model;
using XBOOK.Data.ViewModels;

namespace XBOOK.Data.Repositories
{
    public class TaxSaleInvoiceDetailRepository : Repository<TaxSaleInvDetail>, ITaxSaleInvoiceDetailRepository
    {
        public TaxSaleInvoiceDetailRepository(XBookContext context) : base(context)
        {
        }

        public bool CreateTaxSaleIvDetail(TaxInvDetailViewModel request)
        {
            var saleInvoiceDetailCreate = Mapper.Map<TaxInvDetailViewModel, TaxSaleInvDetail>(request);
            var createData = Entities.Add(saleInvoiceDetailCreate);
            return true;
        }

        public bool RemoveAll(List<TaxInvDetailViewModel> request)
        {
            foreach(var item in request)
            {
                var dataRm = Mapper.Map<TaxInvDetailViewModel, TaxSaleInvDetail>(item);
                if (item.productID > 0)
                {
                    var remove = Entities.Update(dataRm);
                }
                else if (item.productID == 0)
                {
                    var create = Entities.Add(dataRm);
                }
            }
            return true;
        }

        public async Task<bool> RemoveSale(List<Deleted> id)
        {
            foreach (var item in id)
            {
                Entities.Remove(Entities.Find(item.id));
            }
            return await Task.FromResult(true);
        }

        public bool UpdateTaxSaleInvDetail(TaxInvDetailViewModel rs)
        {
            var dataRm = Mapper.Map<TaxInvDetailViewModel, TaxSaleInvDetail>(rs);
            Entities.Update(dataRm);
            return true;
        }
    }
}
