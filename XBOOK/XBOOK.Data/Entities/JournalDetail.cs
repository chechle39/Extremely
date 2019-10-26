namespace XBOOK.Data.Entities
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;

    public partial class JournalDetail
    {
        [Key]
        public long ID { get; set; }
        public long JournalID { get; set; }
        public string accNumber { get; set; }
        public string crspAccNumber { get; set; }
        public string note { get; set; }
        public decimal debit { get; set; }
        public decimal credit { get; set; }
    }
}
