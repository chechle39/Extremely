using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using XBOOK.Data.Model;

namespace XBOOK.Data.Interfaces
{
    public interface IMasterParamRepository
    {
        bool DeleteMaster(List<requestDeletedMaster> request);
    }
}
