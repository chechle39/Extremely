namespace XBOOK.Data.Entities
{
    using System;
    using System.Collections.Generic;
    
    public partial class Tax
    {
        public int ID { get; set; }
        public string taxName { get; set; }
        public Nullable<decimal> taxRate { get; set; }
    }
}
