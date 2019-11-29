using System;
using System.Collections.Generic;

namespace XBOOK.Data.DataBase
{
    public partial class JournalEntry
    {
        public long Id { get; set; }
        public string EntryName { get; set; }
        public string Description { get; set; }
        public DateTime DateCreate { get; set; }
    }
}
