using System.Collections.Generic;
using System.Threading.Tasks;
using XBOOK.Data.ViewModels;

namespace XBOOK.Service.Interfaces
{
    public interface IEntryPatternService
    {
        Task<List<EntryPatternViewModel>> GetAllEntry();
        Task<List<EntryPatternViewModel>> GetAllEntryPayment();
    }
}
