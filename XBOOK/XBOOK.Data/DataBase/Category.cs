using System;
using System.Collections.Generic;

namespace XBOOK.Data.DataBase
{
    public partial class Category
    {
        public Category(int categoryID, string categoryName)
        {
            CategoryId = categoryID;
            CategoryName = categoryName;
        }

        public int CategoryId { get; set; }
        public string CategoryName { get; set; }
    }
}
