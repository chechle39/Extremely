using System;
using System.Collections.Generic;
using System.Text;

namespace XBOOK.Data.ViewModels
{
    public class JournalEntryViewModel
    {
        public long ID { get; set; }
        public string EntryName { get; set; }
        public string Description { get; set; }
        public DateTime DateCreate { get; set; }
        public string ObjectType { get; set; }
        public long ObjectID { get; set; }
        public string ObjectName { get; set; }
    }
}
