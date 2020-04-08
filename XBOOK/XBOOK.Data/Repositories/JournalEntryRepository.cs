using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Threading.Tasks;
using XBOOK.Data.Base;
using XBOOK.Data.Entities;
using XBOOK.Data.Interfaces;
using XBOOK.Data.Model;
using XBOOK.Data.ViewModels;

namespace XBOOK.Data.Repositories
{
    public class JournalEntryRepository : Repository<JournalEntry>, IJournalEntryRepository
    {
        private readonly IUnitOfWork _uow;
        private readonly IClientRepository _clientRepository;
        private readonly ISupplierRepository _supplierRepository;
        private readonly IJournalDetailRepository _journalDetailRepository;
        public JournalEntryRepository(XBookContext context, IUnitOfWork uow, IClientRepository clientRepository, ISupplierRepository supplierRepository, IJournalDetailRepository journalDetailRepository) : base(context)
        {
            _uow = uow;
            _clientRepository = clientRepository;
            _supplierRepository = supplierRepository;
            _journalDetailRepository = journalDetailRepository;
        }

        public async Task<bool> CreateJournalEntry(JournalEntryModelCreate request)
        {
            var createRequest = new JournalEntry()
            {
                dateCreate = request.DateCreate,
                description = request.Description,
                entryName = request.EntryName,
                objectID = request.ObjectID,
                objectName = request.ObjectName,
                objectType = request.ObjectType,
                ID = request.Id
            };
            Entities.Add(createRequest);
            _uow.SaveChanges();
            if (request.Detail.Count() > 0)
            {
                var data = await Entities.ProjectTo<JournalEntryViewModel>().OrderByDescending(xx => xx.ID).Take(1).LastOrDefaultAsync();
                await _journalDetailRepository.CreateJournalDetail(request.Detail, data.ID);
            }
            
            return await Task.FromResult(true);
        }

        public async Task<bool> DeleteJournalEntry(List<Deleted> request)
        {
            foreach (var item in request)
            {
                var data = Entities.Find(item.id);
                if (data != null)
                {
                    Entities.Remove(data);
                }
            }
            await _journalDetailRepository.DeleteJournalEntryDetailByJournalId(request);
            _uow.SaveChanges();
            return await Task.FromResult(true);
        }

        public async Task<IEnumerable<JournalEntryViewModel>> GetAllJournalEntry(DateRequest request)
        {
            var data = await Entities.ProjectTo<JournalEntryViewModel>().ToListAsync();
            if (!string.IsNullOrEmpty(request.StartDate.ToString()))
            {
              //  DateTime start = DateTime.ParseExact(request.StartDate.ToString(), "dd/MM/yyyy", CultureInfo.GetCultureInfo("vi-VN"));
                data = data.Where(x => x.DateCreate >= request.StartDate).ToList();
            }
            if (!string.IsNullOrEmpty(request.EndDate.ToString()))
            {
               // DateTime end = DateTime.ParseExact(request.EndDate, "dd/MM/yyyy", CultureInfo.GetCultureInfo("vi-VN"));
                data = data.Where(x => x.DateCreate <= request.EndDate).ToList();
            }
            if (!string.IsNullOrEmpty(request.Keyword))
            {
              //  data = data.Where(x => x.EntryName.Contains(request.Keyword)).ToList();
                var keyWord = "%" + request.Keyword + "%";
                var data1 = from c in data
                       where EF.Functions.Like(c.EntryName, keyWord) || EF.Functions.Like(c.ObjectName, keyWord)
                           select c;
                data = data1.ToList();
            }
            return data;
        }

        public async Task<List<JournalEntryEmployeeViewModel>> GetDataMap(ClientSerchRequest request)
        {
            var dataMap = new List<JournalEntryEmployeeViewModel>();
            var supplier = await _supplierRepository.GetAllSupplier();

            var client = await _clientRepository.GetAllClientData();
            foreach (var item in client)
            {
                var data = new JournalEntryEmployeeViewModel()
                {
                    ID = item.ClientId,
                    ObjectName = item.ClientName,
                    ObjectType = "Client"
                };
                dataMap.Add(data);
            }

            foreach(var item in supplier)
            {
                var data = new JournalEntryEmployeeViewModel()
                {
                    ID = item.supplierID,
                    ObjectName = item.supplierName,
                    ObjectType = "Supplier"
                };
                dataMap.Add(data);
            }

            var listData = new List<JournalEntryEmployeeViewModel>();
            if (!string.IsNullOrEmpty(request.ClientKeyword))
            {
                var keyWord = "%" + request.ClientKeyword + "%";
                var data = from c in dataMap
                           where EF.Functions.Like(c.ObjectName, keyWord) || EF.Functions.Like(c.ObjectType, keyWord)
                           select c;
                listData = data.Take(20).ToList();
            }
            else if (string.IsNullOrEmpty(request.ClientKeyword))
            {
                listData = dataMap.Take(20).ToList();
            }
            return listData;
        }

        public async Task<JournalEntryModelCreate> GetJournalEntryById(long id)
        {
            var journalEntry = await Entities.Where(x=>x.ID == id).ToListAsync();
            var data = new JournalEntryModelCreate()
            {
                DateCreate = journalEntry[0].dateCreate,
                Description = journalEntry[0].description,
                EntryName = journalEntry[0].entryName,
                ObjectID = journalEntry[0].objectID,
                ObjectName = journalEntry[0].objectName,
                Id = journalEntry[0].ID,
                ObjectType = journalEntry[0].objectType,
                Detail = await _journalDetailRepository.GetJournalEntryDetailById(id),
            };
            return data ;
        }

        public async Task<bool> UpdateJournalEntry(JournalEntryModelCreate request)
        {
            var update = new JournalEntry()
            {
                dateCreate = request.DateCreate,
                description = request.Description,
                entryName = request.EntryName,
                objectID = request.ObjectID,
                objectName = request.ObjectName,
                objectType = request.ObjectType,
                ID = request.Id
            };
            Entities.Update(update);
            await _journalDetailRepository.UpdateJournalDetail(request.Detail, update.ID);
            _uow.SaveChanges();
            return await Task.FromResult(true);
        }
    }
}
