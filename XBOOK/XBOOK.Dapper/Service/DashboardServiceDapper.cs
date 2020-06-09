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
using XBOOK.Data.Interfaces;
using Microsoft.Extensions.Caching.Memory;
using XBOOK.Data.EntitiesDBCommon;

namespace XBOOK.Dapper.Service
{
    public class DashboardServiceDapper : IDashboardServiceDapper
    {
        private string storedName = "Dashboard";
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly IMemoryCache _cache;
        private readonly IUserCommonRepository _userCommonRepository;

        public DashboardServiceDapper(IHttpContextAccessor httpContextAccessor, IMemoryCache cache, IUserCommonRepository userCommonRepository)
        {
            _httpContextAccessor = httpContextAccessor;
            _cache = cache;
            _userCommonRepository = userCommonRepository;
        }
        public async Task<PurchaseChartViewModel> getPurchaseChartDataAsync(DashboardRequest request)
        {
            var reportId = 2;

            var connect = new XBOOK.Dapper.helpers.connect(_httpContextAccessor, _cache, _userCommonRepository);
            var connectString = connect.ConnectString();
            using (var sqlConnection = new SqlConnection(connectString))
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

            var connect = new XBOOK.Dapper.helpers.connect(_httpContextAccessor, _cache, _userCommonRepository);
            var connectString = connect.ConnectString();
            using (var sqlConnection = new SqlConnection(connectString))
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

            var connect = new XBOOK.Dapper.helpers.connect(_httpContextAccessor, _cache, _userCommonRepository);
            var connectString = connect.ConnectString();
            using (var sqlConnection = new SqlConnection(connectString))
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
                var barLabels = new List<string>() { "DASHBOARD.CASHBALANCE.LEGEND.RECEIVE", "DASHBOARD.CASHBALANCE.LEGEND.PAY" };
                data.chart = this.mappingToMultiBarChart(result, result2, labels, barLabels);
                data.cashBalance = (int)result.value6;

                return data;
            }
        }

        public async Task<SaleInvoiceReportViewModel> getSaleInvoiceReportAsync(DashboardRequest request)
        {
            var reportId = 5;

            var connect = new XBOOK.Dapper.helpers.connect(_httpContextAccessor, _cache, _userCommonRepository);
            var connectString = connect.ConnectString();
            using (var sqlConnection = new SqlConnection(connectString))
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
            if (interval == "week")
            {
                return new List<string>(new string[] { "DASHBOARD.BAR.LABEL.2WEEKSAGO", "DASHBOARD.BAR.LABEL.LASTWEEK", "DASHBOARD.BAR.LABEL.THISWEEK", "DASHBOARD.BAR.LABEL.NEXTWEEK", "DASHBOARD.BAR.LABEL.2WEEKSLATER" });
            }
            else if (interval == "month")
            {
                return new List<string>(new string[] { this.getMonth(-2), this.getMonth(-1), this.getMonth(0), this.getMonth(1), this.getMonth(2) });
            }
            else if (interval == "quater")
            {
                return new List<string>(new string[] { null, this.getQuarter(-3), this.getQuarter(-2), this.getQuarter(-1), this.getQuarter(0) });
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
                return new List<string>(new string[] { "DASHBOARD.BAR.LABEL.2WEEKSAGO", "DASHBOARD.BAR.LABEL.LASTWEEK", "DASHBOARD.BAR.LABEL.THISWEEK", "DASHBOARD.BAR.LABEL.NEXTWEEK", "DASHBOARD.BAR.LABEL.2WEEKSLATER" });
            }
            else if (interval == "month")
            {
                return new List<string>(new string[] { this.getMonth(-4), this.getMonth(-3), this.getMonth(-2), this.getMonth(-1), this.getMonth(0) });
            }
            else if (interval == "quater")
            {
                return new List<string>(new string[] { null, this.getQuarter(-3), this.getQuarter(-2), this.getQuarter(-1), this.getQuarter(0) });
            }
            else
            {
                return new List<string>(new string[] { "2 năm trước", "Năm trước", " Năm này", " Năm sau", "2 năm sau" });
            }
        }

        private string getMonth(int input = 0)
        {
            if(input == 0)
            {
                return "DASHBOARD.BAR.LABEL.THISMONTH";
            }
            int month = DateTime.Now.AddMonths(input).Month;
            
            return this.monthFactory(month);
        }

        private string monthFactory(int month)
        {
            switch (month)
            {
                case 1:
                    return "DASHBOARD.BAR.LABEL.JAN";
                case 2:
                    return "DASHBOARD.BAR.LABEL.FEB";
                case 3:
                    return "DASHBOARD.BAR.LABEL.MAR";
                case 4:
                    return "DASHBOARD.BAR.LABEL.APR";
                case 5:
                    return "DASHBOARD.BAR.LABEL.MAY";
                case 6:
                    return "DASHBOARD.BAR.LABEL.JUN";
                case 7:
                    return "DASHBOARD.BAR.LABEL.JUL";
                case 8:
                    return "DASHBOARD.BAR.LABEL.AUG";
                case 9:
                    return "DASHBOARD.BAR.LABEL.SEP";
                case 10:
                    return "DASHBOARD.BAR.LABEL.OCT";
                case 11:
                    return "DASHBOARD.BAR.LABEL.NOV";
                case 12:
                    return "DASHBOARD.BAR.LABEL.DEC";
            }
            return "";
        }

        private string getQuarter(int input = 0)
        {
            if (input == 0)
            {
                return "DASHBOARD.BAR.LABEL.THISQUARTER";
            }
            int quarter = (int)Math.Ceiling(DateTime.Now.AddMonths(input * 3).Month / 3.0);

            return this.quarterFactory(quarter);
        }

        private string quarterFactory(int quarter)
        {
            switch (quarter)
            {
                case 1:
                    return "Q1";
                case 2:
                    return "Q2";
                case 3:
                    return "Q3";
                case 4:
                    return "Q4";
            }
            return "";
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
