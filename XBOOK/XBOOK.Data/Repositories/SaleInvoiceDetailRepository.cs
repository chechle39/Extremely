using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using AutoMapper.QueryableExtensions;
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
        private readonly ITaxInvDetailRepository _taxInvDetailRepository;
        public SaleInvoiceDetailRepository(XBookContext context, ITaxInvDetailRepository taxInvDetailRepository) : base(context)
        {
            _taxInvDetailRepository = taxInvDetailRepository;
        }

        public SaleInvDetail CreateSaleIvDetail(SaleInvDetailViewModel request)
        {
            var saleInvoiceDetailCreate = Mapper.Map<SaleInvDetailViewModel, SaleInvDetail>(request);
            var createData = Entities.Add(saleInvoiceDetailCreate);

            return saleInvoiceDetailCreate;
        }

        public Task<List<SaleInvDetailViewModel>> GetSaleInvByinID(long id)
        {
            var getSaleInVDt = Entities.Where(x=>x.invoiceID == id).AsNoTracking().ProjectTo<SaleInvDetailViewModel>().ToListAsync();

            return getSaleInVDt;
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
                await _taxInvDetailRepository.RemoveTaxSale(item.id);
            }
            return await Task.FromResult(true);
        }

        public SaleInvDetail UpdateSaleInvDetail(SaleInvDetailViewModel rs)
        {
            var dataRm = Mapper.Map<SaleInvDetailViewModel, SaleInvDetail>(rs);
            Entities.Update(dataRm);
            return dataRm;
        }
    }
}
