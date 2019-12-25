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
    }
}
