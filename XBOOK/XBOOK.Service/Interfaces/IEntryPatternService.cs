using System.Collections.Generic;
using System.Threading.Tasks;
using XBOOK.Data.ViewModels;

namespace XBOOK.Service.Interfaces
{
    public interface IEntryPatternService
    {
        Task<List<EntryPatternViewModel>> GetAllEntry();
        Task<List<EntryPatternViewModel>> GetAllEntryPayment();
        Task<EntryPatternSearchDataViewModel> getSearchData();
        Task<List<EntryPatternViewModel>> getEntry(EntryPatternRequest request);
        Task updateEntryPattern(List<EntryPatternViewModel> request);
        Task<List<string>> getEntryTypeByTransactionType(TransactionTypeRequest request);
        Task<List<string>> getTransactionType();
    }
}
