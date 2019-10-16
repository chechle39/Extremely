namespace XBOOK.Data.Entities
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;

    public partial class JournalEntry
    {
        [Key]
        public long JournalID { get; set; }
        public string accountNumber { get; set; }
        public decimal debitAmount { get; set; }
        public decimal creditAmount { get; set; }
    }
}
