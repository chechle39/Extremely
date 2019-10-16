using System.Collections.Generic;
using XBOOK.Data.ViewModels;
using XBOOK.Data.Entities;
using System;
using XBOOK.Data;
using XBOOK.Data.Base;
using System.Linq;

namespace XAccLib.SaleInvoice
{
    public class SaleInvoiceGL
    {
        private readonly IRepository<GeneralLedger> _generalLedgerUowRepository;
        private readonly IUnitOfWork _uow;
        private readonly IRepository<EntryPattern> _entryPatternUowRepository;
        IList<EntryPattern> entry;     
        public SaleInvoiceGL()
        {
            //_uow = uow;
            _generalLedgerUowRepository = _uow.GetRepository<IRepository<GeneralLedger>>();
            _entryPatternUowRepository= _uow.GetRepository<IRepository<EntryPattern>>();
            //Get Entry pattern
            entry = _entryPatternUowRepository.GetAll().Where(s => s.transactionType =="Invoice").ToList();
        }
          
        // Add new entry to GL
        public void InvoiceGL(SaleInvoiceViewModel request)
        {
            IList<GeneralLedger> gls = new List<GeneralLedger>
            {
                //entry doanh thu
                new GeneralLedger()
                {
                    transactionType = "Invoice",
                    transactionNo = request.InvoiceSerial+request.InvoiceNumber ,
                    deditAccNumber = entry.FirstOrDefault(s => s.entryType=="Revenue").deditAccNumber=="" ? entry.FirstOrDefault(s => s.entryType=="Revenue").deditAccNumber : "1311",
                    creditAccNumber = entry.FirstOrDefault(s => s.entryType=="Revenue").creditAccNumber=="" ? entry.FirstOrDefault(s => s.entryType=="Revenue").creditAccNumber : "5111",
                    dateIssue = request.IssueDate ?? DateTime.Now,
                    clientID = request.ClientId.ToString(),
                    clientName = request.ClientData[0].ClientName,
                    note = request.Note,
                    reference = request.Reference,
                    amount = request.SubTotal ?? 0
                },
                //entry thue VAT
                new GeneralLedger()
                {
                    transactionType = "Invoice",
                    transactionNo = request.InvoiceSerial+request.InvoiceNumber ,
                deditAccNumber = entry.FirstOrDefault(s => s.entryType == "Tax").deditAccNumber == "" ? entry.FirstOrDefault(s => s.entryType == "Tax").deditAccNumber : "1311",
                creditAccNumber = entry.FirstOrDefault(s => s.entryType == "Tax").creditAccNumber == "" ? entry.FirstOrDefault(s => s.entryType == "Tax").creditAccNumber : "3331",
                    dateIssue = request.IssueDate ?? DateTime.Now,
                    clientID = request.ClientId.ToString(),
                    clientName = request.ClientData[0].ClientName,
                    note = request.Note,
                    reference = request.Reference,
                    amount = request.VatTax ?? 0
                }
            };
            //entry discount
            if (request.Discount.HasValue && request.Discount != 0 )
            { gls.Add(new GeneralLedger() {
                transactionType = "Invoice",
                transactionNo = request.InvoiceSerial + request.InvoiceNumber,
                deditAccNumber = entry.FirstOrDefault(s => s.entryType == "Discount").deditAccNumber == "" ? entry.FirstOrDefault(s => s.entryType == "Discount").deditAccNumber : "5111",
                creditAccNumber = entry.FirstOrDefault(s => s.entryType == "Discount").creditAccNumber == "" ? entry.FirstOrDefault(s => s.entryType == "Discount").creditAccNumber : "1311",
                dateIssue = request.IssueDate ?? DateTime.Now,
                clientID = request.ClientId.ToString(),
                clientName = request.ClientData[0].ClientName,
                note = request.Note,
                reference = request.Reference,
                amount = request.Discount ?? 0
                });
            }
            // insert to database
            _generalLedgerUowRepository.Add(gls);           
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
