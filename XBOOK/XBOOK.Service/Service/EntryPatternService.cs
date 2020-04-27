using AutoMapper;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using XBOOK.Data.Base;
using XBOOK.Data.Entities;
using XBOOK.Data.Interfaces;
using XBOOK.Data.ViewModels;
using XBOOK.Service.Interfaces;

namespace XBOOK.Service.Service
{
    public class EntryPatternService : IEntryPatternService
    {
        private readonly IRepository<EntryPattern> _entryPatternUowRepository;
        private readonly IEntryPatternRepository _entryPatternRepository;
        private readonly IUnitOfWork _uow;
        public EntryPatternService(IRepository<EntryPattern> entryPatternUowRepository, IEntryPatternRepository entryPatternRepository, IUnitOfWork uow)
        {
            _entryPatternRepository = entryPatternRepository;
            _uow = uow;
            _entryPatternUowRepository = entryPatternUowRepository;
        }

        public async Task<List<EntryPatternViewModel>> GetAllEntry()
        {
            return await _entryPatternRepository.GetAllEntry();
        }
        public async Task<List<EntryPatternViewModel>> GetAllEntryPayment()
        {
            return await _entryPatternRepository.GetAllEntryPayment();
        }

        public async Task<EntryPatternSearchDataViewModel> getSearchData()
        {
            return await _entryPatternRepository.getSearchData();
        }

        public async Task<List<EntryPatternViewModel>> getEntry(EntryPatternRequest request)
        {
            return await _entryPatternRepository.getEntry(request);
        }
        public async Task updateEntryPattern(List<EntryPatternViewModel> request)
        {
            var entryPatternList = Mapper.Map<List<EntryPatternViewModel>, List<EntryPattern>>(request);
            await _entryPatternUowRepository.Update(entryPatternList);
        }
        public async Task<List<string>> getTransactionType()
        {
            return await _entryPatternRepository.getTransactionType();
        }
        public async Task<List<string>> getEntryTypeByTransactionType(TransactionTypeRequest request)
        {
            return await _entryPatternRepository.getEntryTypeByTransactionType(request);
        }
    }
}
