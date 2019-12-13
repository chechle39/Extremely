using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using XBOOK.Data.Base;
using XBOOK.Data.Entities;
using XBOOK.Data.Interfaces;
using XBOOK.Data.Model;

namespace XBOOK.Data.Repositories
{
    public class TaxRepository : Repository<Tax>, ITaxRepository
    {
        public TaxRepository(DbContext context) : base(context)
        {
        }
        public bool DeleteTax(List<requestDeleted> request)
        {
            foreach (var item in request)
            {
                var listTax = Entities.Where(x=>x.ID == item.id).ToList();
                Entities.Remove(listTax[0]);
            }
            return true;
        }

    }
}
