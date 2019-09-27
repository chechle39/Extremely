namespace XBOOK.Data.Entities
{
    using System;
    using System.Collections.Generic;
    
    public partial class JournalEntry
    {
        public long ID { get; set; }
        public string entryName { get; set; }
        public string description { get; set; }
        public System.DateTime dateCreate { get; set; }
    }
}
