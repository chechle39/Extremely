using System.ComponentModel.DataAnnotations;

namespace XBOOK.Data.Entities
{
    public class Functions
    {
        public Functions() { }
        public Functions(string iconCss, string id, string name, string parentId, int sortOrder, int status, string uRL)
        {
            IconCss = iconCss;
            Id = id;
            Name = name;
            ParentId = parentId;
            SortOrder = sortOrder;
            Status = status;
            URL = uRL;
        }

        [Key]
        public string Id { get; set; }
        public string IconCss { get; set; }
        public string Name { get; set; }
        public string ParentId { get; set; }
        public int SortOrder { get; set; }
        public int Status { get; set; }
        public string URL { get; set; }
    }
}
