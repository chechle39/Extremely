using System;
using System.Collections.Generic;
using System.Text;

namespace XBOOK.Dapper.ViewModels
{
    public class AccountBalanceViewModel
    {
        public string accNumber { get; set; }
        public string accName { get; set; }        
        public decimal debitOpening { get; set; }
        public decimal creditOpening { get; set; }
        public decimal debit { get; set; }
        public decimal credit { get; set; }
        public decimal debitClosing { get; set; }
        public decimal creditClosing { get; set; }

    }
   
}
