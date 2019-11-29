using System;
using System.Collections.Generic;

namespace XBOOK.Data.DataBase
{
    public partial class EntryPattern
    {
        public int PatternId { get; set; }
        public string TransactionType { get; set; }
        public string EntryType { get; set; }
        public string AccNumber { get; set; }
        public string CrspAccNumber { get; set; }
        public string Note { get; set; }
    }
}
