using System;
using System.Collections.Generic;
using System.Text;

namespace XBOOK.Data.Model
{
    public class JournalEntryModelCreate
    {
        public long Id { get; set; }
        public string EntryName { get; set; }
        public string Description { get; set; }
        public DateTime DateCreate { get; set; }
        public string ObjectType { get; set; }
        public long? ObjectID { get; set; }
        public string ObjectName { get; set; }
        public List<JournalEntryDetailModelCreate> Detail { get; set; }
    }

    public class JournalEntryDetailModelCreate
    {
        public long Id { get; set; }
        public long JournalID { get; set; }
        public string accNumber { get; set; }
        public string crspAccNumber { get; set; }
        public string note { get; set; }
        public decimal debit { get; set; }
        public decimal credit { get; set; }
    }
}
