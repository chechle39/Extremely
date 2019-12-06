using System;
using System.Collections.Generic;
using System.Text;

namespace XBOOK.Data.ViewModels
{
    public class GenneralViewModel
    {
        public string accNumber { get; set; }
        public decimal totaldebit { get; set; }
        public decimal totalcredit { get; set; }
        public List<GeneralLedgerViewModel> GenneralListData { get; set; }
    }
}
