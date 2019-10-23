export const API_URI = {
  createSaleInv: 'api/SaleInvoice/CreateSaleInvoice',
  createSaleInvDetail: 'api/SaleInvDetail/CreateListSaleDetail',
  invoice: 'api/SaleInvoice/GetAllSaleInvoice',
  invoiceById: 'api/SaleInvoice/GetSaleInvoiceById',
  client: 'api/v1/client',
  updateClient: 'api/client/UpdateClient',
  clientById: 'api/client/GetClientById',
  clientAll: 'api/Client/GetAllClientAsync',
  product: 'api/v1/product',
  productGetAll: 'api/Product/GetAllProductAsync',
  payment: 'api/Payments/v1/CreatePayments',
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
  taxGetAll: 'api/Tax/GetAllTax',
  createTax: 'api/Tax/CreateTax'
};
export const PAGING_CONFIG = {
  pageIndex: 1,
  pageSize: 10
};
