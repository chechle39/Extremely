using System;
using DevExpress.XtraReports.UI;

namespace XBOOK.Web.Reports
{
    public partial class XtraReport1: DevExpress.XtraReports.UI.XtraReport
    {
        public XtraReport1()
        {
            InitializeComponent();
        }
        XtraReport CreateReport()
        {
            XtraReport1 report1 = new XtraReport1();
            report1.richText1.Name = "x";
            return report1;
        }


        private void lonmem(object sender, System.Drawing.Printing.PrintEventArgs e)
        {
            this.richText1.Visible = false;
        }
    }
}
 