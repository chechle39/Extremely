export class ApplicationDependantAppendix {
    Id: Number;
    ApplicationDependantId: Number;
    AppendixTypeVersionId: Number;
    Data: any;
    IsValid: Boolean;
    PartType: any;

    constructor(item: any = null) {
        if (item) {
            this.Id = item.id;
            this.ApplicationDependantId = item.applicationDependantId;
            this.AppendixTypeVersionId = item.appendixTypeVersionId;
            this.Data = item.data ? JSON.parse(item.data) : {};
            this.IsValid = item.isValid;
            this.PartType = item.partType;
        }
    }
}
