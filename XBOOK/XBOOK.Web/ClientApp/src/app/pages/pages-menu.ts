import { NbMenuItem } from '@nebular/theme';

export const MENU_ITEMS: NbMenuItem[] = [
  {
    title: 'Danh mục chung',
    icon: 'layout-outline',
    children: [
      {
        title: 'Products',
        link: '/pages/product',
      },
      {
        title: 'Clients',
        link: '/pages/clients',
      },
      {
        title: 'Supplier',
        link: '/pages/supplier',
      },
    ],
  },
  {
    title: 'Mua hàng - Trả hàng',
    icon: 'car-outline',
    children: [
      {
        title: 'Buy invoice',
        link: '/pages/buyinvoice',
      },
      {
        title: 'Payment Receipt',
        link: '/pages/paymentreceipt',
      },
    ],
  },
  {
    title: 'Bán hàng - Thu tiền',
    icon: 'paper-plane-outline',
    children: [
      {
        title: 'Invoice',
        link: '/pages/invoice',
      },
      {
        title: 'Money Receipt',
        link: '/pages/moneyreceipt',
      },
      {
        title: 'Debit Age',
        link: '/pages/debitage',
      },
      {
        title: 'Sales Report',
        link: '/pages/salesreport',
      },
    ],
  },
  {
    title: 'Kế toán tổng hợp',
    icon: 'edit-outline',
    children: [
      {
        title: 'Account Chart',
        link: '/pages/accountchart',
      },
      {
        title: 'Journal Entries',
        link: '/pages/journalentries',
      },
    ],
  },
  {
    title: 'Sổ sách kế toán',
    icon: 'book-outline',
    children: [
      {
        title: 'General Journal',
        link: '/pages/generalentry',
      },
      {
        title: 'General Ledger',
        link: '/pages/genledgroup',
      },
    ],
  },
  {
    title: 'System & Extra Functions',
    icon: 'person-outline',
    children: [
      {
        title: 'Company profile',
        link: '/pages/companyProfile',
      },
      {
        title: 'Master Param',
        link: '/pages/masterParam',
      },
      {
        title: 'Print',
        link: '/pages/print/disign',
      },
    ],
  },
  {
    title: 'Purchase Report',
    icon: 'file-text',
    link: '/pages/purchasereport',
    home: true,
  },
];
