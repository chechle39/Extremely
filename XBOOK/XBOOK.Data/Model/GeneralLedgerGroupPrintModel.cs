using System.Collections.Generic;
using XBOOK.Data.ViewModels;

namespace XBOOK.Data.Model
{
    public class GeneralLedgerGroupPrintModel
    {
        public string accNumber { get; set; }
        public decimal totaldebit { get; set; }
        public decimal totalcredit { get; set; }
        public List<GeneralLedgerViewModel> GenneralListData { get; set; }
    }
}
