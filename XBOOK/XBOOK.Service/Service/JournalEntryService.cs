using System.Collections.Generic;
using System.Threading.Tasks;
using XBOOK.Data.Base;
using XBOOK.Data.Interfaces;
using XBOOK.Data.Model;
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

        public async Task<bool> CreateJournalEntry(JournalEntryModelCreate request)
        {
            return await _journalEntryRepository.CreateJournalEntry(request);
        }

        public async Task<bool> DeleteJournalEntry(List<Deleted> request)
        {
            return await _journalEntryRepository.DeleteJournalEntry(request);
        }

        public async Task<IEnumerable<JournalEntryViewModel>> GetAllJournalEntry(DateRequest request)
        {
            return await _journalEntryRepository.GetAllJournalEntry(request);
        }

        public async Task<List<JournalEntryEmployeeViewModel>> GetDataMap(ClientSerchRequest request)
        {
            return await _journalEntryRepository.GetDataMap(request);
        }

        public async Task<JournalEntryModelCreate> GetJournalEntryById(long id)
        {
            return await _journalEntryRepository.GetJournalEntryById(id);
        }

        public async Task<bool> UpdateJournalEntry(JournalEntryModelCreate request)
        {
            return await _journalEntryRepository.UpdateJournalEntry(request);
        }
    }
}
