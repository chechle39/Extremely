using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using XBOOK.Data.Base;
using XBOOK.Data.Entities;
using XBOOK.Data.Interfaces;
using XBOOK.Data.Model;
using XBOOK.Data.ViewModels;

namespace XBOOK.Data.Repositories
{
    public class SaleInvoiceRepository : Repository<SaleInvoice>, ISaleInvoiceRepository
    {
        public SaleInvoiceRepository(XBookContext context) : base(context)
        {
        }

        public async Task<SaleInvoiceViewModel> GetLastInvoice()
        {
            if (Entities.Count() > 1)
            {
                var data = await Entities.ProjectTo<SaleInvoiceViewModel>().OrderByDescending(xx => xx.InvoiceId).Take(1).LastOrDefaultAsync();
                return data;
            }else if (Entities.Count() == 1)
            {
                var data = await Entities.ProjectTo<SaleInvoiceViewModel>().ToListAsync();
                return data[0];
            } else
            {
                return null;
            }
        }

        public async Task<IEnumerable<SaleInvoiceViewModel>> GetSaleInvoiceById(long id)
        {
            var data = await Entities.AsNoTracking().ProjectTo<SaleInvoiceViewModel>().Where(x=>x.InvoiceId == id).ToListAsync();
            return data;
        }

        public bool removeInv(long id)
        {
            var ListClient = Entities.Where(x => x.invoiceID == id).ToList();
            Entities.Remove(ListClient[0]);
            return true;
        }


        public bool UpdateSaleInv(SaleInvoiceViewModel rs)
        {
            var saleInvoice = Mapper.Map<SaleInvoiceViewModel, SaleInvoice>(rs);
            Entities.Update(saleInvoice);
            return true;
        }


        public async Task<bool> UpdateItem(long id, decimal? sum)
        {
            var invoiceById = await Entities.AsNoTracking().Where(x => x.invoiceID == id).ToListAsync();
            var saleInRq = new SaleInvoice()
            {
                amountPaid = invoiceById[0].amountPaid - sum,
                clientID = invoiceById[0].clientID,
                discount = invoiceById[0].discount,
                discRate = invoiceById[0].discRate,
                dueDate = invoiceById[0].dueDate,
                invoiceID = invoiceById[0].invoiceID,
                invoiceNumber = invoiceById[0].invoiceNumber,
                invoiceSerial = invoiceById[0].invoiceSerial,
                issueDate = invoiceById[0].issueDate,
                note = invoiceById[0].note,
                reference = invoiceById[0].reference,
                status = invoiceById[0].status,
                subTotal = invoiceById[0].subTotal,
                term = invoiceById[0].term,
                vatTax = invoiceById[0].vatTax,
                TaxInvoiceNumber = invoiceById[0].TaxInvoiceNumber
            };
            Entities.Update(saleInRq);
            return true;
        }
        public  bool UpdateSaleInvEn(Invoice request, decimal sum)
        {
            var invoiceById = Entities.AsNoTracking().Where(x => x.invoiceID == request.InvoiceId).ToListAsync();
            var saleInRq = new SaleInvoice()
            {
                amountPaid = sum,
                clientID = invoiceById.Result[0].clientID,
                discount = invoiceById.Result[0].discount,
                discRate = invoiceById.Result[0].discRate,
                dueDate = invoiceById.Result[0].dueDate,
                invoiceID = invoiceById.Result[0].invoiceID,
                invoiceNumber = invoiceById.Result[0].invoiceNumber,
                invoiceSerial = invoiceById.Result[0].invoiceSerial,
                issueDate = invoiceById.Result[0].issueDate,
                note = invoiceById.Result[0].note,
                reference = invoiceById.Result[0].reference,
                status = invoiceById.Result[0].status,
                subTotal = invoiceById.Result[0].subTotal,
                term = invoiceById.Result[0].term,
                vatTax = invoiceById.Result[0].vatTax,
            };
            Entities.Update(saleInRq);
            return true;
        }

        public SaleInvoice SaveSaleInvoice(SaleInvoice save)
        {
            Entities.Add(save);
            return  save;
        }

        public async Task<bool> UpdateItemTaxNum(long id, string tax)
        {
            var invoiceById = await Entities.AsNoTracking().Where(x => x.invoiceID == id).ToListAsync();
            var saleInRq = new SaleInvoice()
            {
                amountPaid = invoiceById[0].amountPaid,
                clientID = invoiceById[0].clientID,
                discount = invoiceById[0].discount,
                discRate = invoiceById[0].discRate,
                dueDate = invoiceById[0].dueDate,
                invoiceID = invoiceById[0].invoiceID,
                invoiceNumber = invoiceById[0].invoiceNumber,
                invoiceSerial = invoiceById[0].invoiceSerial,
                issueDate = invoiceById[0].issueDate,
                note = invoiceById[0].note,
                reference = invoiceById[0].reference,
                status = invoiceById[0].status,
                subTotal = invoiceById[0].subTotal,
                term = invoiceById[0].term,
                vatTax = invoiceById[0].vatTax,
                TaxInvoiceNumber = tax
            };
            Entities.Update(saleInRq);

            return true;
        }
    }
}
