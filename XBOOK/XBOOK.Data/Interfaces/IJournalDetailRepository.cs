using System.Collections.Generic;
using System.Threading.Tasks;
using XBOOK.Data.Model;

namespace XBOOK.Data.Interfaces
{
    public interface IJournalDetailRepository
    {
        Task<bool> CreateJournalDetail(List<JournalEntryDetailModelCreate> reqest, long id);
        Task<bool> UpdateJournalDetail(List<JournalEntryDetailModelCreate> reqest, long id);
        Task<List<JournalEntryDetailModelCreate>> GetJournalEntryDetailById(long id);
        Task<bool> DeleteJournalEntryDetail(List<Deleted> request);
        Task<bool> DeleteJournalEntryDetailByJournalId(List<Deleted> request);
    }
}
