export const API_URI = {
  deleteUser: 'api/User/Delete',
  deleteRole: 'api/Role/Delete',
  updateUserData: 'api/User/Update',
  adminUser: 'api/User/SaveEntity',
  saveRole: 'api/Role/CreateRole',
  adminRole: 'api/Seed/CreateAdminRole',
  adminUserAdminRole: 'api/Seed/AddUserToAdminRole',
  createSaleInv: 'api/SaleInvoice/CreateSaleInvoice',
  createSaleInvDetail: 'api/SaleInvDetail/CreateListSaleDetail',
  invoice: 'api/SaleInvoice/GetAllSaleInvoice',
  invoiceById: 'api/SaleInvoice/GetSaleInvoiceById',
  updateClient: 'api/client/UpdateClient',
  clientById: 'api/client/GetClientById',
  clientAll: 'api/Client/GetAllClientAsync',
  ExportClient: 'api/Client/ExportClient',
  productGetAll: 'api/Product/GetAllProductAsync',
  paymentCreate: 'api/Payments/CreatePayments',
  paymentIvById: 'api/Payments/GetPaymentByInv',
  paymentById: 'api/Payments/GetPaymentById',
  updatePayment: 'api/Payments/UpdatePayment',
  deletePayment: 'api/Payments/DeletePayment',
  invoiceDF: 'api/SaleInvoice/GetDF',
  deleteSaleInvoice: 'api/SaleInvoice/DeleteSaleInv',
  updateSaleInv: 'api/SaleInvoice/UpdateSaleInvoice',
  deleteSaleInvoiceDetail: 'api/SaleInvDetail/DeletedSaleInvDetail',
  deleteClient: 'api/client/DeleteClient',
  createClient: 'api/client/SaveClient',
  createImportClient: 'api/client/CreateImportClient',
  GetFieldName: 'api/client/ImportExcel',

  taxGetAll: 'api/Tax/GetAllTax',
  MasterGetAll: 'api/MasterParam/GetAllMaster',
  createMaster: 'api/MasterParam/CreateMasterParam',
  MasterGetbyId: 'api/MasterParam/GetMasterById',
  deleteMaster: 'api/MasterParam/DeleteMaster',
  updateMaster: 'api/MasterParam/UpdateMaster',
  createTax: 'api/Tax/CreateTax',
  deleteProduct: 'api/Product/DeleteProduct',
  getGen: 'api/GeneralLedger/GetAllGen',
  exportCSV: 'api/GeneralLedger/GetCSV',
  getAccountChart: 'api/AccountChart/GetAllAccount',
  createProduct: 'api/Product/CreateProduct',
  updateProduct: 'api/Product/UpdateProduct',
  productById: 'api/Product/GetProductById',
  categoryById: 'api/Category/GetCategoryById',
  categoryGetAll: 'api/Category/GetAllCategory',
  lastInvoice: 'api/SaleInvoice/GetLastIndexInvoiceAsync',
  uploadProfile: 'api/UploadProfile/Upload',
  getProfile: 'api/UploadProfile/GetAllProFile',
  getFile: 'api/UploadProfile/GetIMG',
  getClientDap: 'api/Client/GetAllClientDapper',
  getAccountBalanceAccountViewModelDap: 'api/AccountBalance/GetAllAccountBalanceAccountDapper',
  getAccountBalanceViewModelDap: 'api/AccountBalance/GetAllAccountBalanceDapper',
  getGengroup: 'api/GeneralLedgerGroup/GetAllGen',
  exportCSVgroup: 'api/GeneralLedgerGroup/GetCSV',
  uploadFileInv: 'api/SaleInvoice/Upload',
  getFileName: 'api/SaleInvoice/GetFile',
  removeFile: 'api/SaleInvoice/RemoveFile',
  deleteTax: 'api/Tax/DeleteTax',
  saleInVoiceSaveDataPrint: 'api/SaleInvoice/SaveFileJson',
  downLoadFile: 'api/SaleInvoice/Download',
  getLastMoneyReceipt: 'api/MoneyReceipt/GetLastMoneyReceipt',
  createMoneyReceipt: 'api/MoneyReceipt/CreateMoneyReceipt',
  getAllEntryURL: 'api/EntryPattern/GetAllEntry',
  getAllMoneyReceiptURL: 'api/MoneyReceipt/GetAllMoneyReceipt',
  deleteMoneyReceiptURL: 'api/MoneyReceipt/DeleteMoneyReceipt',
  createMoneyReceiptPay: 'api/MoneyReceipt/CreateMoneyReceiptPayMent',
  AccountBalanceSaveDataPrint : 'api/AccountBalance/SaveFileJson',
  GenLedGroupSaveDataPrint : 'api/GeneralLedgerGroup/SaveFileJson',
  GenLedSaveDataPrint : 'api/GeneralLedger/SaveFileJson',
  updateMoneyReceipt: 'api/MoneyReceipt/UpdateMoneyReceipt',
  MoneyReceiptSaveDataPrint : 'api/MoneyReceipt/SaveFileJson',
  getDebitAge: 'api/DebitAge/GetALLDebitageServiceDapper',
  DebitAgeSaveDataPrint: 'api/DebitAge/SaveFileJson',
  SalesreportSaveDataPrint: 'api/SalesReport/SaveFileJson',
  getDataReportAccountDetail : 'api/AccountDetail/GetAccountDetailReportAsync',
  accountdetailreportSaveDataPrint: 'api/AccountDetail/SaveFileJson',
  getAccountDetail: 'api/AccountDetail/GetAllAccountDetailAsync',
  getPurchaseReport: 'api/PurchaseReport/GetPurchaseReportGroupAsync',
  getDataPurchaseReportReport: 'api/PurchaseReport/GetAllPurchaseReportAsync',
  PurchasereportSaveDataPrint: 'api/PurchaseReport/SaveFileJson',
  getcompanyProfile: 'api/CompanyProfile/GetAllClientAsync',
  createProfile: 'api/CompanyProfile/SaveCompanyProfile',
  updateCompanyProfile: 'api/CompanyProfile/UpdateCompanyProfile',
  companyProfileById: 'api/CompanyProfile/GetCompanyById',
  ReadNameReport: 'api/ReportDesigner/ReadNameReport',
  // -------------------------------
  buyinvoice: 'api/BuyInvoices/GetAllBuyInvoice',
  deleteBuyInvoice: 'api/BuyInvoices/DeleteBuyInv',
  supplierAll: 'api/Supplier/GetAllSupplierAsync',
  lastBuyInvoice: 'api/BuyInvoices/GetLastIndexBuyInvoiceAsync',
  createBuyInv: 'api/BuyInvoices/CreateBuyInvoice',
  buyInvoiceDF: 'api/BuyInvoices/GetDF',
  byInvoiceById: 'api/BuyInvoices/GetBuyInvoiceById',
  updateBuyInv: 'api/BuyInvoices/UpdateBuyInvoice',
  createBuyInvDetail: 'api/BuyInvoiceDetail/CreateListBuyDetail',
  deleteBuyInvoiceDetail: 'api/BuyInvoiceDetail/DeletedBuyInvDetail',
  payment2IvById: 'api/Payments2/GetPaymentByInv',
  payment2ById: 'api/Payments2/GetPaymentById',
  payment2Create: 'api/Payments2/CreatePayments',
  updatePayment2: 'api/Payments2/UpdatePayment',
  deletePayment2: 'api/Payments2/DeletePayment',
  supplierById: 'api/Supplier/GetSupplierById',
  createSupplier: 'api/Supplier/SaveSupplier',
  updateSupplier: 'api/Supplier/UpdateSupplier',
  deleteSupplier: 'api/Supplier/DeleteClient',
  getSupplierDap: 'api/Supplier/GetAllSupplierDapper',
  ExportSupplier: 'api/Supplier/ExportSupplier',
  GetFieldNameSupplier: 'api/Supplier/ImportExcel',
  createImportSupplier: 'api/Supplier/CreateImportSupplier',
  getSalesreport: 'api/SalesReport/GetALLDebitageServiceDapper',
  getDataReport: 'api/SalesReport/GetDatareportServiceDapper',


  getLastPaymentReceipt: 'api/PaymentReceipt/GetLastPaymentReceipt',
  createPaymentReceipt: 'api/PaymentReceipt/CreatePaymentReceipt',
  updatePaymentReceipt: 'api/PaymentReceipt/UpdatePaymentReceipt',
  getAllPaymentReceiptURL: 'api/PaymentReceipt/GetAllPaymentReceipt',
  deletePaymentReceiptURL: 'api/PaymentReceipt/DeletePaymentReceipt',
  createPaymentReceiptPay: 'api/PaymentReceipt/CreatePaymentReceiptPayMent',
  getAllEntryPaymentURL: 'api/EntryPattern/GetAllEntryPayment',
  uploadFileBuyInv: 'api/BuyInvoices/Upload',
  removeFileBuy: 'api/BuyInvoices/RemoveFile',
  getFileBuyName: 'api/BuyInvoices/GetFile',
  uploadProfileSupplier: 'api/UploadProfile/UploadSupplier',
  getFileSupplier: 'api/UploadProfile/GetIMGSupplier',
  downLoadFileBuy: 'api/BuyInvoices/Download',
  getAccountChartTree: 'api/AccountChart/GetAllTreeAccount',
  updateAcountChart: 'api/AccountChart/Update',
  createAccountChart: 'api/AccountChart/CreateAccountChart',
  deleteAccount: 'api/AccountChart/DeleteAcount',
  getListRole: 'api/Role/GetAllRole',
  login: 'api/Account/Login',
  logout: 'api/Account/Logout',
  checkAcount: 'api/Account/CheckUserAcount',
  register: 'api/Account/Register',
  getAllUser: 'api/User/GetUser',
  getUserById: 'api/User/GetById',
  getRoleById: 'api/Role/GetById',

  JournalGetAll: 'api/JournalEntry/GetAllJournalEntry',
  dataMap: 'api/JournalEntry/GetDataMap',
  createJournal: 'api/JournalEntry/CreateJournalEntry',
  getJournalById: 'api/JournalEntry/JournalEntryById',
  updateJournal: 'api/JournalEntry/UpdateJournalEntry',
  deleteJournalDetail: 'api/JournalDetail/DeleteJournalDetail',
  deleteJournal: 'api/JournalEntry/DeleteJournal',
  PaymentReceiptSaveDataPrint: 'api/PaymentReceipt/SaveFileJson',
};
export const PAGING_CONFIG = {
  pageIndex: 1,
  pageSize: 20,
};
