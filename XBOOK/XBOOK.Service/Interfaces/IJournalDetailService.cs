using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using XBOOK.Data.Model;

namespace XBOOK.Service.Interfaces
{
    public interface IJournalDetailService
    {
        Task<bool> DeleteJournalEntryDetail(List<Deleted> request);
        Task<List<JournalEntryDetailModelCreate>> GetJournalEntryDetailById(long id);
    }
}
