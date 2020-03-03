using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using XBOOK.Data.Interfaces;
using XBOOK.Data.Model;
using XBOOK.Service.Interfaces;

namespace XBOOK.Service.Service
{
    public class JournalDetailService : IJournalDetailService
    {
        private readonly IJournalDetailRepository _journalDetailRepository;
        public JournalDetailService(IJournalDetailRepository journalDetailRepository)
        {
            _journalDetailRepository = journalDetailRepository;
        }

        public async Task<bool> DeleteJournalEntryDetail(List<Deleted> request)
        {
            return await _journalDetailRepository.DeleteJournalEntryDetail(request);
        }

        public async Task<List<JournalEntryDetailModelCreate>> GetJournalEntryDetailById(long id)
        {
            return await _journalDetailRepository.GetJournalEntryDetailById(id);
        }
    }
}
