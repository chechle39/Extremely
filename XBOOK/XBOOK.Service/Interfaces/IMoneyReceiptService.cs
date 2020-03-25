﻿using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using XBOOK.Data.Model;
using XBOOK.Data.ViewModels;

namespace XBOOK.Service.Interfaces
{
    public interface IMoneyReceiptService
    {
        Task<bool> CreateMoneyReceipt(MoneyReceiptViewModel request);
        Task<bool> DeletedMoneyReceipt(List<requestDeleted> request);
        Task<MoneyReceiptViewModel> GetLastMoneyReceipt();
        Task<MoneyReceiptViewModel> GetMoneyById(MoneyReceiptID request);
        Task<bool> CreateMoneyReceiptPaymentAsync(MoneyReceiptPayment request);
        Task<bool> Update(MoneyReceiptViewModel request);
        Task<MoneyReceiptByIdViewModel> GetMoneyByIdObject(long id);
    }
}
