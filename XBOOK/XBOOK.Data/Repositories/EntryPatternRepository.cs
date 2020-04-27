using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using XBOOK.Data.Base;
using XBOOK.Data.Entities;
using XBOOK.Data.Interfaces;
using XBOOK.Data.ViewModels;

namespace XBOOK.Data.Repositories
{
    public class EntryPatternRepository: Repository<EntryPattern>, IEntryPatternRepository
    {
        public EntryPatternRepository(XBookContext context) : base(context)
        {
        }
        public Task<List<EntryPatternViewModel>> GetAllEntry()
        {
            return Entities.Where(x=>x.transactionType == "MoneyReceipt").ProjectTo<EntryPatternViewModel>().ToListAsync();
        }
        public Task<List<EntryPatternViewModel>> GetAllEntryPayment()
        {
            return Entities.Where(x => x.transactionType == "PaymentReceipt").ProjectTo<EntryPatternViewModel>().ToListAsync();
        }
        public async Task<EntryPatternSearchDataViewModel> getSearchData()
        {
            var data = Entities.ProjectTo<EntryPatternViewModel>().ToListAsync().Result;
            var result = new EntryPatternSearchDataViewModel()
            {
                EntryType = data.Select(item => item.EntryType).Distinct().ToList(),
                TransactionType = data.Select(item => item.TransactionType).Distinct().ToList()
            };
            return await Task.FromResult(result);
        }
        public async Task<List<string>> getTransactionType()
        {
            return await Entities.Select(item => item.transactionType).Distinct().ToListAsync();
        }
        public async Task<List<string>> getEntryTypeByTransactionType(TransactionTypeRequest request)
        {
            return await Entities.Where(x => x.transactionType == request.TransactionType).Select(item => item.entryType).Distinct().ToListAsync();
        }
        public Task<List<EntryPatternViewModel>> getEntry(EntryPatternRequest request)
        {
            var queryBuilder = Entities.AsQueryable(); ;
            if (!string.IsNullOrEmpty(request.EntryType))
            {
                queryBuilder = queryBuilder.Where(x => x.entryType == request.EntryType);
            }
            if (!string.IsNullOrEmpty(request.TransactionType))
            {
                queryBuilder = queryBuilder.Where(x => x.transactionType == request.TransactionType);
            }
            return queryBuilder.ProjectTo<EntryPatternViewModel>().ToListAsync();
        }
    }
}
