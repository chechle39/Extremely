using System.Collections.Generic;
using System.Threading.Tasks;
using XBOOK.Data.ViewModels;

namespace XBOOK.Data.Interfaces
{
    public interface IJournalEntryRepository
    {
        Task<IEnumerable<JournalEntryViewModel>> GetAllJournalEntry();
        Task<List<JournalEntryEmployeeViewModel>> GetDataMap();
    }
}
