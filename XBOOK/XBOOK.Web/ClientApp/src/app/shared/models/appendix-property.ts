export class AppendixProperty {
    Id: Number;
    AppendixTypeVersionId: Number;
    ControlType: Number;
    Description: String;
    IsRequired: Boolean;
    Label: String;
    Name: String;
    Options: String;
    ValueType: Number;
    IsExternal: Boolean;

    constructor(item: any = null) {
        if (item) {
            this.AppendixTypeVersionId = item.appendixTypeVersionId;
            this.ControlType = item.controlType;
            this.Description = item.description;
            this.Id = item.id;
            this.IsRequired = item.isRequired;
            this.Label = item.label;
            this.Name = item.name;
            this.Options = item.options;
            this.ValueType = item.valueType;
        }
    }
}
