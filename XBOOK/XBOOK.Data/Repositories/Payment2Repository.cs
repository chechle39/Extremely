using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using XBOOK.Data.Base;
using XBOOK.Data.Entities;
using XBOOK.Data.Interfaces;
using XBOOK.Data.ViewModels;

namespace XBOOK.Data.Repositories
{
    public class Payment2Repository : Repository<Payments_2>, IPayment2Repository
    {
        private readonly IUnitOfWork _uow;
        private readonly IBuyInvoiceRepository _buyInvoiceRepository;
        public Payment2Repository(XBookContext context, IUnitOfWork uow, IBuyInvoiceRepository buyInvoiceRepository) : base(context)
        {
            _uow = uow;
            _buyInvoiceRepository = buyInvoiceRepository;
        }

        public async Task<bool> DeletedPaymentAsync(string request)
    {
        var finData = Entities.Where(x => x.receiptNumber == request).ToList();
        if (finData.Count() > 0)
        {
            foreach (var item in finData)
            {
                Entities.Remove(item);
                await _buyInvoiceRepository.UpdateItem(item.invoiceID, item.amount);
                    _uow.SaveChanges();
                }
            return await Task.FromResult(true);
        }
        else
        {
            return false;
        }

    }

        public async Task<bool> UpdatePaymentByReceiptNumber(PaymentReceiptViewModel request)
        {
            var finData = Entities.Where(x => x.receiptNumber == request.ReceiptNumber).AsNoTracking().ToList();
            if (finData.Count == 0)
                return false;
            var update = new Payments_2()
            {
                amount = request.Amount,
                ID = finData[0].ID,
                invoiceID = finData[0].invoiceID,
                receiptNumber = request.ReceiptNumber,
                note = request.Note,
                payDate = request.PayDate,
                payName = request.PayName,
                payType = request.PayType,
            };

            Entities.Update(update);

            return await Task.FromResult(true);
        }
    }
}
