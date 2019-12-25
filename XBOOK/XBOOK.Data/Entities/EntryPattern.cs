using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace XBOOK.Data.Entities
{
    public partial class EntryPattern
    {
        public EntryPattern(string accNumber, string entryType, string note, string transactionType, string crspAccNumber)
        {
            this.accNumber = accNumber;
            this.entryType = entryType;
            this.note = note;
            this.transactionType = transactionType;
            this.crspAccNumber = crspAccNumber;
        }

        [Key]
        public int patternID { get; set; }
        public string transactionType { get; set; }
        public string entryType { get; set; }
        public string accNumber { get; set; }
        public string crspAccNumber { get; set; }
        public string note { get; set; }
    }
}
