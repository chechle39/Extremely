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
        public string deditAccNumber { get; set; }
        public string creditAccNumber { get; set; }
        public string clientID { get; set; }
        public string clientName { get; set; }
        public string note { get; set; }
        public decimal amount { get; set; }
    }
}
