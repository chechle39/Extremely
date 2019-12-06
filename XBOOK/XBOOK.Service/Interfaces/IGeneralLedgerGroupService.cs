using System;
using System.Collections.Generic;
using System.Text;
using XBOOK.Data.Model;
using XBOOK.Data.ViewModels;

namespace XBOOK.Service.Interfaces
{
    public interface IGeneralLedgerGroupService
    {
        byte[] GetDataGeneralLedgerAsync(genledSearch request);
        List<GenneralViewModel> GetAllGeneralLed(genledSearch request);
    }
}
