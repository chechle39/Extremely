using AutoMapper.QueryableExtensions;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Text;
using XBOOK.Data.Base;
using XBOOK.Data.Entities;
using XBOOK.Data.Model;
using XBOOK.Data.ViewModels;
using XBOOK.Service.Interfaces;

namespace XBOOK.Service.Service
{
    public class GeneralLedgerService : IGeneralLedgerService
    {
        private readonly IRepository<GeneralLedger> _generalLedgerUowRepository;
        private readonly IUnitOfWork _uow;
        public GeneralLedgerService(IRepository<GeneralLedger> categoryUowRepository, IUnitOfWork uow)
        {
            _generalLedgerUowRepository = categoryUowRepository;
            _uow = uow;
        }

        public List<GeneralLedgerViewModel> GetAllGeneralLed(genledSearch request)
        {
            var listGen = new List<GeneralLedgerViewModel>();
            if (string.IsNullOrEmpty(request.StartDate) && string.IsNullOrEmpty(request.EndDate)&&(request.AccNumber==null))
            {
                 listGen = _generalLedgerUowRepository.GetAll().Take(200).ProjectTo<GeneralLedgerViewModel>().ToList();
            }               
            else
            if (!string.IsNullOrEmpty(request.StartDate) || !string.IsNullOrEmpty(request.EndDate))
            {
                listGen =new List<GeneralLedgerViewModel>();
                string[] names = request.AccNumber;
                DateTime start = DateTime.ParseExact(request.StartDate, "dd/MM/yyyy", CultureInfo.GetCultureInfo("vi-VN"));
                DateTime end = DateTime.ParseExact(request.EndDate, "dd/MM/yyyy", CultureInfo.GetCultureInfo("vi-VN"));
                var listTemp = new List<GeneralLedgerViewModel>();
                if (names == null)
                {                   
                    
                        var listGenSearch = _generalLedgerUowRepository.GetAll().
                        Where(x => ((x.dateIssue >= start && x.dateIssue <= end))).ProjectTo<GeneralLedgerViewModel>().ToList();
                    listTemp = listGenSearch;
                        for (int j = 0; j < listTemp.Count(); j++)
                        {
                            listGen.Add(listTemp[j]);
                        }                    
                }
                else {
                    if (request.Isaccount == true && request.IsAccountReciprocal == false)
                    {
                        for (int i = 0; i < names.Length; i++)
                        {
                            var listGenSearch = _generalLedgerUowRepository.GetAll().
                            Where(x => ((x.dateIssue >= start && x.dateIssue <= end) && (x.accNumber == names[i]))).ProjectTo<GeneralLedgerViewModel>().ToList();
                            listTemp = listGenSearch;
                            for (int j = 0; j < listTemp.Count(); j++)
                            {
                                listGen.Add(listTemp[j]);
                            }
                        }
                    }
                    if (request.Isaccount == false && request.IsAccountReciprocal == true)
                    {
                        for (int i = 0; i < names.Length; i++)
                        {
                            var listGenSearch = _generalLedgerUowRepository.GetAll().
                            Where(x => ((x.dateIssue >= start && x.dateIssue <= end) && (x.crspAccNumber == names[i]))).ProjectTo<GeneralLedgerViewModel>().ToList();
                            listTemp = listGenSearch;
                            for (int j = 0; j < listTemp.Count(); j++)
                            {
                                listGen.Add(listTemp[j]);
                            }
                        }
                    }
                    if (request.Isaccount == true && request.IsAccountReciprocal == true)
                    {
                        for (int i = 0; i < names.Length; i++)
                        {
                            var listGenSearch = _generalLedgerUowRepository.GetAll().
                            Where(x => ((x.dateIssue >= start && x.dateIssue <= end) && (x.crspAccNumber == names[i] || x.accNumber == names[i]))).ProjectTo<GeneralLedgerViewModel>().ToList();
                            listTemp = listGenSearch;
                            for (int j = 0; j < listTemp.Count(); j++)
                            {
                                listGen.Add(listTemp[j]);
                            }
                        }
                    }
                }
                
                return listGen;
            }      
            return listGen;
        }

        public  byte[] GetDataGeneralLedgerAsync(genledSearch request)
        {
            var comlumHeadrs = new string[]
            {
                "Số Hiệu",
                "Ngày Tháng",
                "Diễn Giải",
                "Tài Khoản",
                "TK Đối Ứng",
                "Phát Sinh Nợ",
                "Phát Sinh Có",
            };
            var listGen = new List<GeneralLedgerViewModel>();
            if (string.IsNullOrEmpty(request.StartDate) && string.IsNullOrEmpty(request.EndDate) && (request.AccNumber == null))
            {
                listGen = _generalLedgerUowRepository.GetAll().Take(200).ProjectTo<GeneralLedgerViewModel>().ToList();
            }
            else
            if (!string.IsNullOrEmpty(request.StartDate) || !string.IsNullOrEmpty(request.EndDate))
            {
                listGen = new List<GeneralLedgerViewModel>();
                string[] names = request.AccNumber;
                DateTime start = DateTime.ParseExact(request.StartDate, "dd/MM/yyyy", CultureInfo.GetCultureInfo("vi-VN"));
                DateTime end = DateTime.ParseExact(request.EndDate, "dd/MM/yyyy", CultureInfo.GetCultureInfo("vi-VN"));
                var listTemp = new List<GeneralLedgerViewModel>();
                if (names == null)
                {

                    var listGenSearch =  _generalLedgerUowRepository.GetAll().
                    Where(x => ((x.dateIssue >= start && x.dateIssue <= end))).ProjectTo<GeneralLedgerViewModel>().ToList();
                    listTemp = listGenSearch;
                    for (int j = 0; j < listTemp.Count(); j++)
                    {
                        listGen.Add(listTemp[j]);
                    }
                }
                else
                {
                    if (request.Isaccount == true && request.IsAccountReciprocal == false)
                    {
                        for (int i = 0; i < names.Length; i++)
                        {
                            var listGenSearch = _generalLedgerUowRepository.GetAll().
                            Where(x => ((x.dateIssue >= start && x.dateIssue <= end) && (x.accNumber == names[i]))).ProjectTo<GeneralLedgerViewModel>().ToList();
                            listTemp = listGenSearch;
                            for (int j = 0; j < listTemp.Count(); j++)
                            {
                                listGen.Add(listTemp[j]);
                            }
                        }
                    }
                    if (request.Isaccount == false && request.IsAccountReciprocal == true)
                    {
                        for (int i = 0; i < names.Length; i++)
                        {
                            var listGenSearch = _generalLedgerUowRepository.GetAll().
                            Where(x => ((x.dateIssue >= start && x.dateIssue <= end) && (x.crspAccNumber == names[i]))).ProjectTo<GeneralLedgerViewModel>().ToList();
                            listTemp = listGenSearch;
                            for (int j = 0; j < listTemp.Count(); j++)
                            {
                                listGen.Add(listTemp[j]);
                            }
                        }
                    }
                    if (request.Isaccount == true && request.IsAccountReciprocal == true)
                    {
                        for (int i = 0; i < names.Length; i++)
                        {
                            var listGenSearch = _generalLedgerUowRepository.GetAll().
                            Where(x => ((x.dateIssue >= start && x.dateIssue <= end) && (x.crspAccNumber == names[i] || x.accNumber == names[i]))).ProjectTo<GeneralLedgerViewModel>().ToList();
                            listTemp = listGenSearch;
                            for (int j = 0; j < listTemp.Count(); j++)
                            {
                                listGen.Add(listTemp[j]);
                            }
                        }
                    }
                }              
            }
            var csv = (from item in listGen
                      select new object[]
                      {
                          item.transactionNo,
                          item.dateIssue,
                          item.note,
                          item.accNumber,
                          item.crspAccNumber,
                          item.debit,
                          item.credit
                      }).ToList();
            var csvData = new StringBuilder();
            csv.ForEach(line =>
            {
                csvData.AppendLine(string.Join(",", line));
            });
          
            byte[] buffer = Encoding.Unicode.GetBytes($"{string.Join(",", comlumHeadrs)}\r\n{csvData.ToString()}");
            return buffer;
        }

    }
}
