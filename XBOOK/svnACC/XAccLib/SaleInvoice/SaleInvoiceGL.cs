﻿using System.Collections.Generic;
using XBOOK.Data.ViewModels;
using XBOOK.Data.Entities;
using System;
using XBOOK.Data.Base;
using System.Linq;

namespace XAccLib.SaleInvoice
{
    public class SaleInvoiceGL
    {
        private readonly IRepository<GeneralLedger> _generalLedgerUowRepository;
        private readonly IRepository<EntryPattern> _entryPatternUowRepository;
        private readonly IUnitOfWork _uow;
        IList<EntryPattern> entry;     
        public SaleInvoiceGL(IUnitOfWork uow)
        {
            _uow = uow;
            _generalLedgerUowRepository = _uow.GetRepository<IRepository<GeneralLedger>>();
            _entryPatternUowRepository= _uow.GetRepository<IRepository<EntryPattern>>();
            //Get Entry pattern
            entry = _entryPatternUowRepository.GetAll().Where(s => s.transactionType =="Invoice").ToList();
        }
          
        // Add new entry to GL
        public void InvoiceGL(SaleInvoiceViewModel request)
        {
            List<GeneralLedger> gls = new List<GeneralLedger>
            {
                //entry  doanh thu (debit)
                new GeneralLedger()
                {
                    transactionType = "Invoice",
                    transactionNo = request.InvoiceSerial+request.InvoiceNumber ,
                    accNumber = entry.FirstOrDefault(s => s.entryType=="Revenue").accNumber=="" ? "1311" : entry.FirstOrDefault(s => s.entryType=="Revenue").accNumber ,
                    crspAccNumber = entry.FirstOrDefault(s => s.entryType=="Revenue").crspAccNumber=="" ? "5111" : entry.FirstOrDefault(s => s.entryType=="Revenue").crspAccNumber ,
                    dateIssue = request.IssueDate ?? DateTime.Now,
                    clientID = request.ClientId.ToString(),
                    clientName = request.ClientData[0].ClientName,
                    note = request.Note,
                    reference = request.Reference,
                    debit = request.SubTotal ?? 0,
                    credit=0
                },
                //entry thue (debit)
                new GeneralLedger()
                {
                    transactionType = "Invoice",
                    transactionNo = request.InvoiceSerial+request.InvoiceNumber ,
                    accNumber = entry.FirstOrDefault(s => s.entryType == "Tax").accNumber == "" ? "1311" : entry.FirstOrDefault(s => s.entryType == "Tax").accNumber ,
                    crspAccNumber = entry.FirstOrDefault(s => s.entryType == "Tax").crspAccNumber == "" ? "3331" : entry.FirstOrDefault(s => s.entryType == "Tax").crspAccNumber ,
                    dateIssue = request.IssueDate ?? DateTime.Now,
                    clientID = request.ClientId.ToString(),
                    clientName = request.ClientData[0].ClientName,
                    note = request.Note,
                    reference = request.Reference,
                    debit = request.VatTax ?? 0,
                    credit=0
                },
            
            //entry  doanh thu (credit)
            new GeneralLedger()
            {
                transactionType = "Invoice",
                transactionNo = request.InvoiceSerial + request.InvoiceNumber,
                crspAccNumber = entry.FirstOrDefault(s => s.entryType == "Revenue").accNumber == "" ? "1311" : entry.FirstOrDefault(s => s.entryType == "Revenue").accNumber,
                accNumber = entry.FirstOrDefault(s => s.entryType == "Revenue").crspAccNumber == "" ? "1511" : entry.FirstOrDefault(s => s.entryType == "Revenue").crspAccNumber,
                dateIssue = request.IssueDate ?? DateTime.Now,
                clientID = request.ClientId.ToString(),
                clientName = request.ClientData[0].ClientName,
                note = request.Note,
                reference = request.Reference,
                debit = 0,
                credit = request.SubTotal ?? 0
            },
                //entry thue (credit)
                new GeneralLedger()
                {
                    transactionType = "Invoice",
                    transactionNo = request.InvoiceSerial + request.InvoiceNumber,
                    crspAccNumber = entry.FirstOrDefault(s => s.entryType == "Tax").accNumber == "" ? "1311" : entry.FirstOrDefault(s => s.entryType == "Tax").accNumber,
                    accNumber = entry.FirstOrDefault(s => s.entryType == "Tax").crspAccNumber == "" ? "3331" : entry.FirstOrDefault(s => s.entryType == "Tax").crspAccNumber,
                    dateIssue = request.IssueDate ?? DateTime.Now,
                    clientID = request.ClientId.ToString(),
                    clientName = request.ClientData[0].ClientName,
                    note = request.Note,
                    reference = request.Reference,
                    debit = 0,
                    credit = request.VatTax ?? 0
                }
            };
            
            //entry discount
            if (request.Discount.HasValue && request.Discount != 0 )
            {
                gls.Add(          new GeneralLedger()
                {
                    transactionType = "Invoice",
                    transactionNo = request.InvoiceSerial + request.InvoiceNumber,
                    accNumber = entry.FirstOrDefault(s => s.entryType == "Discount").crspAccNumber == "" ? "5111" : entry.FirstOrDefault(s => s.entryType == "Discount").crspAccNumber,
                    crspAccNumber = entry.FirstOrDefault(s => s.entryType == "Discount").accNumber == "" ? "1311" : entry.FirstOrDefault(s => s.entryType == "Discount").accNumber,
                    dateIssue = request.IssueDate ?? DateTime.Now,
                    clientID = request.ClientId.ToString(),
                    clientName = request.ClientData[0].ClientName,
                    note = request.Note,
                    reference = request.Reference,
                    debit = request.Discount ?? 0,
                    credit=0
                }    
                );
                gls.Add(               new GeneralLedger()
                {
                    transactionType = "Invoice",
                    transactionNo = request.InvoiceSerial + request.InvoiceNumber,
                    crspAccNumber = entry.FirstOrDefault(s => s.entryType == "Discount").crspAccNumber == "" ? "5111" : entry.FirstOrDefault(s => s.entryType == "Discount").crspAccNumber,
                    accNumber = entry.FirstOrDefault(s => s.entryType == "Discount").accNumber == "" ? "1311": entry.FirstOrDefault(s => s.entryType == "Discount").accNumber,
                    dateIssue = request.IssueDate ?? DateTime.Now,
                    clientID = request.ClientId.ToString(),
                    clientName = request.ClientData[0].ClientName,
                    note = request.Note,
                    reference = request.Reference,
                    debit = 0,
                    credit = request.Discount ?? 0
                }
                );
            }
            // insert to database
            foreach(var item in gls)
            {
                _generalLedgerUowRepository.AddData(item);
            }
            _uow.SaveChanges();
        }
         
        public void deleteGL(SaleInvoiceViewModel request) {
            var gls =_generalLedgerUowRepository.GetAll().Where(s => s.transactionNo==request.InvoiceSerial+request.InvoiceNumber && s.transactionType=="Invoice"); 
            _generalLedgerUowRepository.Remove(gls);
        }
        public void updateGL(SaleInvoiceViewModel request) {
            deleteGL(request);
            InvoiceGL(request);                       
        }

    } 
    
}