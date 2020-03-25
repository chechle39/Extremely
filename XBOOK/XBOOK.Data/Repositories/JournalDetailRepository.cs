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
using XBOOK.Data.Model;

namespace XBOOK.Data.Repositories
{
    public class JournalDetailRepository : Repository<JournalDetail>, IJournalDetailRepository
    {
        private readonly IUnitOfWork _uow;
        public JournalDetailRepository(XBookContext context, IUnitOfWork uow) : base(context)
        {
            _uow = uow;
        }

        public async Task<bool> CreateJournalDetail(List<JournalEntryDetailModelCreate> reqest, long id)
        {
            foreach(var item in reqest)
            {
                if (item.crspAccNumber != "")
                {
                    var createRequest = new JournalDetail()
                    {
                        JournalID = id,
                        accNumber = item.accNumber,
                        credit = item.credit,
                        crspAccNumber = item.crspAccNumber,
                        debit = item.debit,
                        ID = item.Id,
                        note = item.note
                    };
                    Entities.Add(createRequest);
                    _uow.SaveChanges();
                }
                
            }
         
            return await Task.FromResult(true);
        }

        public async Task<bool> DeleteJournalEntryDetail(List<Deleted> request)
        {
            foreach (var item in request)
            {
                var data = Entities.Find(item.id);
                if (data != null)
                {
                    Entities.Remove(data);
                }
            }
            _uow.SaveChanges();
            return await Task.FromResult(true);
        }

        public async Task<bool> DeleteJournalEntryDetailByJournalId(List<Deleted> request)
        {
            foreach (var item in request)
            {
                var data = await Entities.Where(x=>x.JournalID == item.id).ToListAsync();
                if (data.Count() > 0)
                {
                    Entities.Remove(data[0]);
                }
            }
            return await Task.FromResult(true);
        }

        public async Task<List<JournalEntryDetailModelCreate>> GetJournalEntryDetailById(long id)
        {
            var data = await Entities.ProjectTo<JournalEntryDetailModelCreate>().Where(x => x.JournalID == id).ToListAsync();
            return data;
        }

        public async Task<bool> UpdateJournalDetail(List<JournalEntryDetailModelCreate> reqest, long id)
        {
            foreach(var item in reqest)
            {
                var update = new JournalDetail()
                {
                    JournalID = id,
                    accNumber = item.accNumber,
                    credit = item.credit,
                    crspAccNumber = item.crspAccNumber,
                    debit = item.debit,
                    ID = item.Id,
                    note = item.note
                };
                Entities.Update(update);
            }
            return await Task.FromResult(true);
        }
    }
}
