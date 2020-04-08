using Microsoft.Extensions.Configuration;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using XBOOK.Dapper.Interfaces;
using XBOOK.Data.Model;
using Dapper;
using System.Data;

namespace XBOOK.Dapper.Service
{
    public class DashboardServiceDapper: IDashboardServiceDapper
    {
        private readonly IConfiguration _configuration;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private string storedName = "Dashboard";
        public DashboardServiceDapper(IConfiguration configuration, IHttpContextAccessor httpContextAccessor)
        {
            _httpContextAccessor = httpContextAccessor;
            _configuration = configuration;
        }

        public async Task<PurchaseChartViewModel> getPurchaseChartDataAsync(DashboardRequest request)
        {
            var reportId = 2;

            var Code = _httpContextAccessor.HttpContext.User.Claims.Where(x => x.Type == "codeCompany").ToList()[0].Value;
            using (var sqlConnection = new SqlConnection(_configuration.GetConnectionString(Code)))
            {
                await sqlConnection.OpenAsync();
                var dynamicParameters = new DynamicParameters();
                dynamicParameters.Add("@reportId", reportId);
                dynamicParameters.Add("@interval", request.interval);

                var result = (await sqlConnection.QueryAsync<DashboardRawDataViewModel>(
                    storedName, dynamicParameters, commandType: CommandType.StoredProcedure)).ElementAt(0);

                var labels = this.getLabels(request.interval);
                var data = new PurchaseChartViewModel();
                data.chart = this.mappingToSingleBarChart(result, labels);
                data.ammountOfItemOutstanding = (int)result.value6;
                data.outstanding = (int)result.value7;
                data.ammountOfItemOverduce = (int)result.value8;
                data.overduce = (int)result.value9;
                return data;
            }
        }

        public async Task<SaleChartViewModel> getSaleChartDataAsync(DashboardRequest request)
        {
            var reportId = 1;

            var Code = _httpContextAccessor.HttpContext.User.Claims.Where(x => x.Type == "codeCompany").ToList()[0].Value;
            using (var sqlConnection = new SqlConnection(_configuration.GetConnectionString(Code)))
            {
                await sqlConnection.OpenAsync();
                var dynamicParameters = new DynamicParameters();
                dynamicParameters.Add("@reportId", reportId);
                dynamicParameters.Add("@interval", request.interval);

                var result = (await sqlConnection.QueryAsync<DashboardRawDataViewModel>(
                    storedName, dynamicParameters, commandType: CommandType.StoredProcedure)).ElementAt(0);
                var labels = this.getLabels(request.interval);
                var data = new SaleChartViewModel();
                data.chart = this.mappingToSingleBarChart(result, labels);
                data.ammountOfItemOutstanding = (int)result.value6;
                data.outstanding = (int)result.value7;
                data.ammountOfItemOverduce = (int)result.value8;
                data.overduce = (int)result.value9;
                return data;
            }
        }

        public async Task<BalanceChartViewModel> getBalanceChartDataAsync(DashboardRequest request)
        {
            var reportId = 3;

            var Code = _httpContextAccessor.HttpContext.User.Claims.Where(x => x.Type == "codeCompany").ToList()[0].Value;
            using (var sqlConnection = new SqlConnection(_configuration.GetConnectionString(Code)))
            {
                await sqlConnection.OpenAsync();
                var dynamicParameters = new DynamicParameters();
                dynamicParameters.Add("@reportId", reportId);
                dynamicParameters.Add("@interval", request.interval);

                //get data from stored procedures
                var result = (await sqlConnection.QueryAsync<DashboardRawDataViewModel>(
                    storedName, dynamicParameters, commandType: CommandType.StoredProcedure)).ElementAt(0);
                reportId = 4;
                dynamicParameters.Add("@reportId", reportId);
                var result2 = (await sqlConnection.QueryAsync<DashboardRawDataViewModel>(
                    storedName, dynamicParameters, commandType: CommandType.StoredProcedure)).ElementAt(0);

                var data = new BalanceChartViewModel();

                //mapping data
                var labels = this.getLabels2(request.interval);
                var barLabels = new List<string>() { "Tiền thu", "Tiền chi" };
                data.chart = this.mappingToMultiBarChart(result, result2, labels, barLabels);
                data.cashBalance = (int)result.value6;

                return data;
            }
        }

        public async Task<SaleInvoiceReportViewModel> getSaleInvoiceReportAsync(DashboardRequest request)
        {
            var reportId = 5;

            var Code = _httpContextAccessor.HttpContext.User.Claims.Where(x => x.Type == "codeCompany").ToList()[0].Value;
            using (var sqlConnection = new SqlConnection(_configuration.GetConnectionString(Code)))
            {
                await sqlConnection.OpenAsync();
                var dynamicParameters = new DynamicParameters();
                dynamicParameters.Add("@reportId", reportId);
                dynamicParameters.Add("@interval", request.interval);

                var result = (await sqlConnection.QueryAsync<DashboardRawDataViewModel>(
                    storedName, dynamicParameters, commandType: CommandType.StoredProcedure)).ElementAt(0);
                var labels = this.getLabels2(request.interval);
                var data = new SaleInvoiceReportViewModel();

                data.chart = this.mappingToSingleBarChart(result, labels);
                return data;
            }
        }

        private List<string> getLabels(string interval)
        {
            if(interval == "week")
            {
                return new List<string>(new string[] { "2 tuần trước", "Tuần trước", "Tuần này", "Tuần sau", "2 tuần sau" });
            }
            else if(interval == "month")
            {
                return new List<string>(new string[] { this.getMonth(-2), this.getMonth(-1), "Tháng này", this.getMonth(1), this.getMonth(2) });
            }
            else if (interval == "quater")
            {
                return new List<string>(new string[] { "Q1", "Q2", "Q3", "Q4", null });
            }
            else
            {
                return new List<string>(new string[] { "2 năm trước", "Năm trước", " Năm này", " Năm sau", "2 năm sau" });
            }
        }

        private List<string> getLabels2(string interval)
        {
            if (interval == "week")
            {
                return new List<string>(new string[] { "2 tuần trước", "Tuần trước", "Tuần này", "Tuần sau", "2 tuần sau" });
            }
            else if (interval == "month")
            {
                return new List<string>(new string[] { this.getMonth(-2), this.getMonth(-1), this.getMonth(0), this.getMonth(1), this.getMonth(2) });
            }
            else if (interval == "quater")
            {
                return new List<string>(new string[] { "Q1", "Q2", "Q3", "Q4", null });
            }
            else
            {
                return new List<string>(new string[] { "2 năm trước", "Năm trước", " Năm này", " Năm sau", "2 năm sau" });
            }
        }

        private string getMonth(int input = 0)
        {
            return DateTime.Now.AddMonths(input).ToString("MMM");
        }

        private List<ChartMultiBar> mappingToMultiBarChart(DashboardRawDataViewModel result, DashboardRawDataViewModel result2, List<string> labels, List<string> barLabels)
        {
            var chart = new List<ChartMultiBar>();
            List<ChartSingleBar> bars;
            if (!string.IsNullOrEmpty(labels[0]))
            {
                bars = new List<ChartSingleBar>();
                bars.Add(new ChartSingleBar() { label = barLabels[0], value = (int)result.value1 });
                bars.Add(new ChartSingleBar() { label = barLabels[1], value = (int)result2.value1 });
                chart.Add(new ChartMultiBar() { label = labels[0], bars = bars });
            }
            if (!string.IsNullOrEmpty(labels[1]))
            {
                bars = new List<ChartSingleBar>();
                bars.Add(new ChartSingleBar() { label = barLabels[0], value = (int)result.value2 });
                bars.Add(new ChartSingleBar() { label = barLabels[1], value = (int)result2.value2 });
                chart.Add(new ChartMultiBar() { label = labels[1], bars = bars });
            }
            if (!string.IsNullOrEmpty(labels[2]))
            {
                bars = new List<ChartSingleBar>();
                bars.Add(new ChartSingleBar() { label = barLabels[0], value = (int)result.value3 });
                bars.Add(new ChartSingleBar() { label = barLabels[1], value = (int)result2.value3 });
                chart.Add(new ChartMultiBar() { label = labels[2], bars = bars });
            }
            if (!string.IsNullOrEmpty(labels[3]))
            {
                bars = new List<ChartSingleBar>();
                bars.Add(new ChartSingleBar() { label = barLabels[0], value = (int)result.value4 });
                bars.Add(new ChartSingleBar() { label = barLabels[1], value = (int)result2.value4 });
                chart.Add(new ChartMultiBar() { label = labels[3], bars = bars });
            }
            if (!string.IsNullOrEmpty(labels[4]))
            {
                bars = new List<ChartSingleBar>();
                bars.Add(new ChartSingleBar() { label = barLabels[0], value = (int)result.value5 });
                bars.Add(new ChartSingleBar() { label = barLabels[1], value = (int)result2.value5 });
                chart.Add(new ChartMultiBar() { label = labels[4], bars = bars });
            }
            return chart;
        }

        private List<ChartSingleBar> mappingToSingleBarChart(DashboardRawDataViewModel result, List<string> labels)
        {
            var chart = new List<ChartSingleBar>();
            if (!string.IsNullOrEmpty(labels[0]))
            {
                chart.Add(new ChartSingleBar() { label = labels[0], value = (int)result.value1 });
            }
            if (!string.IsNullOrEmpty(labels[1]))
            {
                chart.Add(new ChartSingleBar() { label = labels[1], value = (int)result.value2 });
            }
            if (!string.IsNullOrEmpty(labels[2]))
            {
                chart.Add(new ChartSingleBar() { label = labels[2], value = (int)result.value3 });
            }
            if (!string.IsNullOrEmpty(labels[3]))
            {
                chart.Add(new ChartSingleBar() { label = labels[3], value = (int)result.value4 });
            }
            if (!string.IsNullOrEmpty(labels[4]))
            {
                chart.Add(new ChartSingleBar() { label = labels[4], value = (int)result.value5 });
            }
            return chart;
        }
    }
}
