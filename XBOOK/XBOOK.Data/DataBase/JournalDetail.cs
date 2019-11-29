using System;
using System.Collections.Generic;

namespace XBOOK.Data.DataBase
{
    public partial class JournalDetail
    {
        public long Id { get; set; }
        public long JournalId { get; set; }
        public string AccNumber { get; set; }
        public string CrspAccNumber { get; set; }
        public string Note { get; set; }
        public decimal Debit { get; set; }
        public decimal Credit { get; set; }
    }
}
