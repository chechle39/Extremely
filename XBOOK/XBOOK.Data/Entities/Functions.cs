using System.ComponentModel.DataAnnotations;

namespace XBOOK.Data.Entities
{
    public class Functions
    {
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
