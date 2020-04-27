using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using XBOOK.Data.ViewModels;

namespace XBOOK.Data.Interfaces
{
    public interface IEntryPatternRepository
    {
        Task<List<EntryPatternViewModel>> GetAllEntry();
        Task<List<EntryPatternViewModel>> GetAllEntryPayment();
        Task<EntryPatternSearchDataViewModel> getSearchData();
        Task<List<EntryPatternViewModel>> getEntry(EntryPatternRequest request);
        Task<List<string>> getEntryTypeByTransactionType(TransactionTypeRequest request);
        Task<List<string>> getTransactionType();
    }
}
