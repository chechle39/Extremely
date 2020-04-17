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
    public class SaleInvoiceDetailRepository : Repository<SaleInvDetail>, ISaleInvoiceDetailRepository
    {
        public SaleInvoiceDetailRepository(XBookContext context) : base(context)
        {
        }

        public bool CreateSaleIvDetail(SaleInvDetailViewModel request)
        {
            var saleInvoiceDetailCreate = Mapper.Map<SaleInvDetailViewModel, SaleInvDetail>(request);
            var createData = Entities.Add(saleInvoiceDetailCreate);
            return true;
        }

        public bool RemoveAll(List<SaleInvDetailViewModel> request)
        {
            foreach(var item in request)
            {
                var dataRm = Mapper.Map<SaleInvDetailViewModel, SaleInvDetail>(item);
                if (item.ProductId > 0)
                {
                    var remove = Entities.Update(dataRm);
                }
                else if (item.ProductId == 0)
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

        public bool UpdateSaleInvDetail(SaleInvDetailViewModel rs)
        {
            var dataRm = Mapper.Map<SaleInvDetailViewModel, SaleInvDetail>(rs);
            Entities.Update(dataRm);
            return true;
        }
    }
}
