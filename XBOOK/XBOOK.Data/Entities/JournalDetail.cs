namespace XBOOK.Data.Entities
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;

    public partial class JournalDetail
    {
        public JournalDetail() { }
        public JournalDetail(long journalID, string note, string accNumber, decimal credit, string crspAccNumber, decimal debit, long id)
        {
            JournalID = journalID;
            this.note = note;
            this.accNumber = accNumber;
            this.credit = credit;
            this.crspAccNumber = crspAccNumber;
            this.debit = debit;
            ID = id;
        }

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
