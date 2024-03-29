﻿using Dapper;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Configuration;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using XBOOK.Dapper.Interfaces;
using XBOOK.Dapper.ViewModels;
using XBOOK.Data.EntitiesDBCommon;
using XBOOK.Data.Interfaces;
using XBOOK.Data.Model;

namespace XBOOK.Dapper.Service
{
    public class BuyInvoiceServiceDapper: IBuyInvoiceServiceDapper
    {
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly IMemoryCache _cache;
        private readonly IUserCommonRepository _userCommonRepository;

        public BuyInvoiceServiceDapper(IHttpContextAccessor httpContextAccessor, IMemoryCache cache, IUserCommonRepository userCommonRepository)
        {
            _httpContextAccessor = httpContextAccessor;
            _cache = cache;
            _userCommonRepository = userCommonRepository;
        }

        public async Task<byte[]> ExportBuyInvoiceAsync()
        {
            var connect = new XBOOK.Dapper.helpers.connect(_httpContextAccessor, _cache, _userCommonRepository);
            var connectString = connect.ConnectString();
            using (var sqlConnection = new SqlConnection(connectString))
            {
                var comlumHeadrs = new string[]
                {
                    "InvoiceId",
                    "InvoiceNumber",
                    "InvoiceSerial",
                    "SupplierName",
                    "Note",
                    "IssueDate",
                    "DueDate",
                    "Amount",
                    "AmountPaid",
                    "SupplierID",
                    "ContactName",
                    "BankAccount"
                };
                await sqlConnection.OpenAsync();
                var dynamicParameters = new DynamicParameters();
                dynamicParameters.Add("@searchString", "");
                dynamicParameters.Add("@fromDate", "");
                dynamicParameters.Add("@toDate", "");
                dynamicParameters.Add("@isIssueDate", true);
                dynamicParameters.Add("@getDebtOnly", "");
                var data = await sqlConnection.QueryAsync<BuyInvoiceViewModel>(
                   "GetBuyInvoiceList", dynamicParameters, commandType: CommandType.StoredProcedure);


                var csv = (from item in data
                           select new object[]
                           {
                          item.InvoiceId,
                          item.InvoiceNumber,
                          item.InvoiceSerial,
                          item.SupplierName,
                          item.Note.Replace(","," "),
                          item.IssueDate,
                          item.DueDate,
                          item.Amount,
                          item.AmountPaid,
                          item.SupplierID,
                          item.ContactName,
                          item.BankAccount
                           }).ToList();
                var csvData = new StringBuilder();

                csv.ForEach(line =>
                {
                    csvData.AppendLine(string.Join(",", line));
                });
                byte[] buffer = Encoding.UTF8.GetBytes($"{string.Join(",", comlumHeadrs)}\r\n{csvData.ToString()}");
                return buffer;
            }
        }

        public async Task<IEnumerable<BuyInvoiceViewModel>> GetBuyInvoice(SaleInvoiceListRequest request)
        {
            var connect = new XBOOK.Dapper.helpers.connect(_httpContextAccessor, _cache, _userCommonRepository);
            var connectString = connect.ConnectString();
            using (var sqlConnection = new SqlConnection(connectString))
            {
                if (!string.IsNullOrEmpty(request.StartDate) && !string.IsNullOrEmpty(request.EndDate))
                {
                    //DateTime start = DateTime.ParseExact(request.StartDate, "MM/dd/yyyy", CultureInfo.GetCultureInfo("vi-VN"));
                    //DateTime end = DateTime.ParseExact(request.EndDate, "MM/dd/yyyy", CultureInfo.GetCultureInfo("vi-VN"));
                    await sqlConnection.OpenAsync();
                    var dynamicParameters = new DynamicParameters();
                    dynamicParameters.Add("@searchString", request.Keyword);
                    dynamicParameters.Add("@fromDate", request.StartDate);
                    dynamicParameters.Add("@toDate", request.EndDate);
                    dynamicParameters.Add("@isIssueDate", request.isIssueDate);
                    dynamicParameters.Add("@getDebtOnly", request.getDebtOnly);
                    return await sqlConnection.QueryAsync<BuyInvoiceViewModel>(
                       "GetBuyInvoiceList", dynamicParameters, commandType: CommandType.StoredProcedure);
                }
                else
                {
                    await sqlConnection.OpenAsync();
                    var dynamicParameters = new DynamicParameters();
                    dynamicParameters.Add("@searchString", request.Keyword);
                    dynamicParameters.Add("@fromDate", null);
                    dynamicParameters.Add("@toDate", null);
                    dynamicParameters.Add("@isIssueDate", request.isIssueDate);
                    dynamicParameters.Add("@getDebtOnly", request.getDebtOnly);
                    return await sqlConnection.QueryAsync<BuyInvoiceViewModel>(
                       "GetBuyInvoiceList", dynamicParameters, commandType: CommandType.StoredProcedure);
                }

            }
        }
    }
}
