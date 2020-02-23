using System.Collections.Generic;
using System.Threading.Tasks;
using XBOOK.Data.ViewModels;

namespace XBOOK.Service.Interfaces
{
    public interface IJournalEntryService
    {
        Task<IEnumerable<JournalEntryViewModel>> GetAllJournalEntry();
        Task<List<JournalEntryEmployeeViewModel>> GetDataMap();
    }
}
