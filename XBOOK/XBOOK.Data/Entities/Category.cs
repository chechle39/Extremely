namespace XBOOK.Data.Entities
{
    public partial class Category
    {
        public Category(int categoryID, string categoryName)
        {
            CategoryID = categoryID;
            CategoryName = categoryName;
        }

        public int CategoryID { get; set; }
        public string CategoryName { get; set; }
    }
}
