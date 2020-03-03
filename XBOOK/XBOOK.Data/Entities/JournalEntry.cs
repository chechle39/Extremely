namespace XBOOK.Data.Entities
{
    using System;
    using System.ComponentModel.DataAnnotations;

    public partial class JournalEntry
    {
        public JournalEntry() { }
        public JournalEntry(DateTime dateCreate, string description, string entryName, long iD, long objectID, string objectName, string objectType)
        {
            this.dateCreate = dateCreate;
            this.description = description;
            this.entryName = entryName;
            ID = iD;
            this.objectID = objectID;
            this.objectName = objectName;
            this.objectType = objectType;
        }

        [Key]
        public long ID { get; set; }
        public string entryName { get; set; }
        public string description { get; set; }
        public DateTime dateCreate { get; set; }
        public string objectType { get; set; }
        public long? objectID { get; set; }
        public string objectName { get; set; }
    }
}
