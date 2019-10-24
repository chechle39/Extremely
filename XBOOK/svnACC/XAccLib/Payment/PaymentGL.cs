﻿using System.Collections.Generic;
using XBOOK.Data.ViewModels;
using XBOOK.Data.Entities;
using System;
using XBOOK.Data.Base;
using System.Linq;
using AutoMapper.QueryableExtensions;

namespace XAccLib.Payment
{
    public class PaymentGL
    {
        private readonly IRepository<GeneralLedger> _generalLedgerUowRepository;
        private readonly IRepository<EntryPattern> _entryPatternUowRepository;
        private readonly IRepository<XBOOK.Data.Entities.SaleInvoice> _saleInvoiceUowRepository;
        private readonly IUnitOfWork _uow;
        IList<EntryPattern> entry;
        public PaymentGL(IUnitOfWork uow)
        {
            _uow = uow;
            _generalLedgerUowRepository = _uow.GetRepository<IRepository<GeneralLedger>>();
            _entryPatternUowRepository = _uow.GetRepository<IRepository<EntryPattern>>();
            _saleInvoiceUowRepository = _uow.GetRepository<IRepository<XBOOK.Data.Entities.SaleInvoice>>();
            //Get Entry pattern
            entry = _entryPatternUowRepository.GetAll().Where(s => s.transactionType == "Payment").ToList();
        }
        public void Insert(PaymentViewModel request)
        {
            var invoice = _saleInvoiceUowRepository.GetAll().ProjectTo<SaleInvoiceViewModel>().Where(i => i.InvoiceId == request.InvoiceId).FirstOrDefault();
            List<GeneralLedger> gls = new List<GeneralLedger>();

            // Cash entry (debit)
            if (request.PayType == "Cash")
            {
                gls.Add(new GeneralLedger()
                {
                    transactionType = "Payment",
                    transactionNo = invoice.InvoiceSerial + invoice.InvoiceNumber,
                    accNumber = entry.FirstOrDefault(s => s.entryType == "Cash").accNumber == "" ? "1111" : entry.FirstOrDefault(s => s.entryType == "Cash").accNumber,
                    crspAccNumber = entry.FirstOrDefault(s => s.entryType == "Cash").crspAccNumber == "" ? "1311" : entry.FirstOrDefault(s => s.entryType == "Cash").crspAccNumber,
                    dateIssue = request.PayDate,
                    clientID = invoice.ClientId.ToString(),
                    clientName = invoice.ClientData[0].ClientName,
                    note = request.Note,
                    reference = request.Id.ToString(), // Để xóa khi delete payment
                   debit = request.Amount,
                   credit=0
                });
                // Cash entry (credit)
                gls.Add(new GeneralLedger()
                {
                    transactionType = "Payment",
                    transactionNo = invoice.InvoiceSerial + invoice.InvoiceNumber,
                    crspAccNumber = entry.FirstOrDefault(s => s.entryType == "Cash").accNumber == "" ? "1111" : entry.FirstOrDefault(s => s.entryType == "Cash").accNumber,
                    accNumber = entry.FirstOrDefault(s => s.entryType == "Cash").crspAccNumber == "" ? "1311" : entry.FirstOrDefault(s => s.entryType == "Cash").crspAccNumber,
                    dateIssue = request.PayDate,
                    clientID = invoice.ClientId.ToString(),
                    clientName = invoice.ClientData[0].ClientName,
                    note = request.Note,
                    reference = request.Id.ToString(), // Để xóa khi delete payment
                    debit =0 ,
                    credit = request.Amount
                });

            }
            // Bank entry (debit)
            else
            {
                gls.Add(new GeneralLedger()
                {
                    transactionType = "Payment",
                    transactionNo = invoice.InvoiceSerial + invoice.InvoiceNumber,
                    accNumber = entry.FirstOrDefault(s => s.entryType == "Bank").accNumber == "" ? "1111" : entry.FirstOrDefault(s => s.entryType == "Bank").accNumber,
                    crspAccNumber = entry.FirstOrDefault(s => s.entryType == "Bank").crspAccNumber == "" ? "1311" : entry.FirstOrDefault(s => s.entryType == "Bank").crspAccNumber,
                    dateIssue = request.PayDate,
                    clientID = invoice.ClientId.ToString(),
                    clientName = invoice.ClientData[0].ClientName,
                    note = request.Note,
                    reference = request.Id.ToString(), // Để xóa khi delete payment
                    debit = request.Amount,
                    credit = 0
                });
                gls.Add(new GeneralLedger()
                {
                    transactionType = "Payment",
                    transactionNo = invoice.InvoiceSerial + invoice.InvoiceNumber,
                    crspAccNumber = entry.FirstOrDefault(s => s.entryType == "Bank").accNumber == "" ? "1111" : entry.FirstOrDefault(s => s.entryType == "Bank").accNumber,
                    accNumber = entry.FirstOrDefault(s => s.entryType == "Bank").crspAccNumber == "" ? "1311" : entry.FirstOrDefault(s => s.entryType == "Bank").crspAccNumber,
                    dateIssue = request.PayDate,
                    clientID = invoice.ClientId.ToString(),
                    clientName = invoice.ClientData[0].ClientName,
                    note = request.Note,
                    reference = request.Id.ToString(), // Để xóa khi delete payment
                    debit = 0,
                    credit = request.Amount
                });
            }
            // insert to database
            foreach (var item in gls)
            {
                _generalLedgerUowRepository.AddData(item);
            }
            _uow.SaveChanges();
        }
        public void Delete(PaymentViewModel request)
        {
            var gls = _generalLedgerUowRepository.GetAll().Where(s => s.reference == request.Id.ToString());
            _generalLedgerUowRepository.Remove(gls);
        }
        public void Update(PaymentViewModel request)
        {
            Insert(request);
            Delete(request);
        }
    }
}
   