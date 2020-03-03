using System.Collections.Generic;
using System.Threading.Tasks;
using XBOOK.Data.Base;
using XBOOK.Data.Entities;
using XBOOK.Data.Model;
using XBOOK.Data.ViewModels;

namespace XBOOK.Data.Interfaces
{
    public interface IJournalEntryRepository : IRepository<JournalEntry>
    {
        Task<IEnumerable<JournalEntryViewModel>> GetAllJournalEntry(DateRequest request);
        Task<List<JournalEntryEmployeeViewModel>> GetDataMap(ClientSerchRequest request);
        Task<bool> CreateJournalEntry(JournalEntryModelCreate request);
        Task<JournalEntryModelCreate> GetJournalEntryById(long id);
        Task<bool> UpdateJournalEntry(JournalEntryModelCreate request);
        Task<bool> DeleteJournalEntry(List<Deleted> request);
    }
}
