export class AcountChartModel {
    accountNumber: string;
    accountName: string;
    accountType: string;
    isParent: boolean;
    parentAccount: string;
    openingBalance: number;
    closingBalance: string;
    parentId: string;
    treeStatus: string;
}
export class AcountChartViewModel {
    accountNumber: string;
    accountName: string;
    accountType: string;
    isParent: boolean;
    parentAccount: string;
    openingBalance: number;
    closingBalance: number;
}
