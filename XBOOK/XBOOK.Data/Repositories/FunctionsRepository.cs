using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using XBOOK.Data.Base;
using XBOOK.Data.Entities;
using XBOOK.Data.Interfaces;
using XBOOK.Data.Model;

namespace XBOOK.Data.Repositories
{
    public class FunctionsRepository : Repository<Functions>, IFunctionsRepository
    {
        public FunctionsRepository(DbContext context) : base(context)
        {
        }
        public async Task<List<MenuModel>> GetMenu()
        {
            var data = await Entities.ToListAsync();
            var dataMenuList = new List<MenuModel>();
            foreach(var item in data.Where(x=>x.ParentId == null))
            {
                var children = new List<children>();
                foreach (var item2 in data.Where(x=>x.ParentId == item.Id))
                {
                    var child = new children()
                    {
                        link = item2.URL,
                        title = item2.Name,
                    };
                    children.Add(child);
                }
                var menuModel = new MenuModel()
                {
                    icon = item.IconCss,
                    title = item.Name,
                    children = children
                };
                dataMenuList.Add(menuModel);
            }
            return dataMenuList;
        }
    }
}
