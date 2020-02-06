using System;

namespace XBOOK.Data.ViewModels
{
    public class AccountChartViewModel
    {
        public string accountNumber { get; set; }
        public string accountName { get; set; }
        public bool isParent { get; set; }
    }

    public class TreeNode
    {
        public string accountNumber { get; set; } //id
        public string accountName { get; set; } // text
        public string accountType { get; set; }
        public bool isParent { get; set; }
        public string parentAccount { get; set; } // parent
        public Nullable<decimal> openingBalance { get; set; }
        public Nullable<decimal> closingBalance { get; set; }
        public string parentId { get { return parentAccount; } }
    }
}
