using System.Collections.Generic;
using System.Threading.Tasks;
using XBOOK.Data.Base;
using XBOOK.Data.Interfaces;
using XBOOK.Data.ViewModels;
using XBOOK.Service.Interfaces;

namespace XBOOK.Service.Service
{
    public class JournalEntryService : IJournalEntryService
    {
        private readonly IUnitOfWork _uow;
        private readonly IJournalEntryRepository _journalEntryRepository;
        public JournalEntryService(IUnitOfWork uow, IJournalEntryRepository journalEntryRepository)
        {
            _uow = uow;
            _journalEntryRepository = journalEntryRepository;
        }

        public async Task<IEnumerable<JournalEntryViewModel>> GetAllJournalEntry()
        {
            return await _journalEntryRepository.GetAllJournalEntry();
        }

        public async Task<List<JournalEntryEmployeeViewModel>> GetDataMap()
        {
            return await _journalEntryRepository.GetDataMap();
        }
    }
}
