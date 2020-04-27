using System;
using System.Collections.Generic;
using System.Text;

namespace XBOOK.Data.ViewModels
{
    public class EntryPatternViewModel
    {
        public int PatternID { get; set; }
        public string TransactionType { get; set; }
        public string EntryType { get; set; }
        public string AccNumber { get; set; }
        public string CrspAccNumber { get; set; }
        public string Note { get; set; }
        public string payType { get; set; }
    }

    public class EntryPatternSearchDataViewModel
    {
        public List<string> TransactionType { get; set; }
        public List<string> EntryType { get; set; }
    }
    public class EntryPatternRequest
    {
        public string TransactionType { get; set; }
        public string EntryType { get; set; }
    }
    public class TransactionTypeRequest
    {
        public string TransactionType { get; set; }
    }
}
