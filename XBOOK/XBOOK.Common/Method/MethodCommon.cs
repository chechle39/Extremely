using Newtonsoft.Json;
using System;
using System.IO;

namespace XBOOK.Common.Method
{
    public class MethodCommon
    {
        public static string InputString(string value)
        {
            int carry = 1;
            string res = "";
            for (int i = value.Length - 1; i > 0; i--)
            {
                int chars = 0;
                chars += ((int)value[i]);
                chars += carry;
                if (chars > 90)
                {
                    chars = 65;
                    carry = 1;
                }
                else
                {
                    carry = 0;
                }

                if (chars > 57 && chars < 65)
                {
                    carry = 1;
                }

                res = Convert.ToChar(chars) + res;

                if (carry != 1)
                {
                    res = value.Substring(0, i) + res;
                    break;
                }
            }
            if (carry == 1)
            {
                res = 'A' + res;
            }
            string resStr = res.Replace(":", "0");
            return resStr;
        }
    }
}
