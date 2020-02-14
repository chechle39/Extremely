namespace XBOOK.Data.Entities
{
    using System;
    using System.Collections.Generic;
    
    public partial class MasterParam
    {
        public MasterParam() {

        }
        public MasterParam(string paramType, string key, string name, string description)
        {
            this.paramType = paramType;
            this.key = key;
            this.name = name;
            this.description = description;
        }

        public string paramType { get; set; }
        public string key { get; set; }
        public string name { get; set; }
        public string description { get; set; }
    }
}
