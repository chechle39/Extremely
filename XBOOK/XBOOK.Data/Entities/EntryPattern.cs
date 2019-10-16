using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace XBOOK.Data.Entities
{
    public partial class EntryPattern
    {
        [Key]
        public int patternID { get; set; }
        public string transactionType { get; set; }
        public string entryType { get; set; }
        public string deditAccNumber { get; set; }
        public string creditAccNumber { get; set; }
        public string note { get; set; }
    }
}
