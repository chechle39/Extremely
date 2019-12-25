using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using XBOOK.Data.Base;
using XBOOK.Data.Interfaces;
using XBOOK.Data.ViewModels;
using XBOOK.Service.Interfaces;

namespace XBOOK.Service.Service
{
    public class EntryPatternService : IEntryPatternService
    {
        private readonly IEntryPatternRepository _entryPatternRepository;
        private readonly IUnitOfWork _uow;
        public EntryPatternService(IEntryPatternRepository entryPatternRepository, IUnitOfWork uow)
        {
            _entryPatternRepository = entryPatternRepository;
            _uow = uow;
        }

        public async Task<List<EntryPatternViewModel>> GetAllEntry()
        {
            return await _entryPatternRepository.GetAllEntry();
        }
    }
}
