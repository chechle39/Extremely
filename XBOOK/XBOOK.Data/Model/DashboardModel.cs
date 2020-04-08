using System;
using System.Collections.Generic;
using System.Text;

namespace XBOOK.Data.Model
{
    public class DashboardRequest
    {
        public string interval { get; set; }
    }

    public class AllChartViewModel
    {
        public SaleChartViewModel chart1;
        public PurchaseChartViewModel chart2;
        public BalanceChartViewModel chart3;
        public SaleInvoiceReportViewModel chart4;
    }

    public class SaleChartViewModel
    {
        public List<ChartSingleBar> chart;
        public int ammountOfItemOutstanding;
        public int outstanding;
        public int ammountOfItemOverduce;
        public int overduce;
    }
    public class PurchaseChartViewModel
    {
        public List<ChartSingleBar> chart;
        public int ammountOfItemOutstanding;
        public int outstanding;
        public int ammountOfItemOverduce;
        public int overduce;
    }
    public class BalanceChartViewModel
    {
        public List<ChartMultiBar> chart;
        public int cashBalance;
    }
    public class SaleInvoiceReportViewModel
    {
        public List<ChartSingleBar> chart;
    }
    public class DashboardRawDataViewModel
    {
        public decimal value1;
        public decimal value2;
        public decimal value3;
        public decimal value4;
        public decimal value5;
        public decimal value6;
        public decimal value7;
        public decimal value8;
        public decimal value9;
    }

    public class ChartSingleBar
    {
        public string label;
        public int value;
    }

    public class ChartMultiBar
    {
        public string label;
        public List<ChartSingleBar> bars;
    }
}
