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
        public EntryPatternRepository(DbContext context) : base(context)
        {
        }
        public Task<List<EntryPatternViewModel>> GetAllEntry()
        {
            return Entities.Where(x=>x.transactionType == "MoneyReceipt").ProjectTo<EntryPatternViewModel>().ToListAsync();
        }
    }
}
