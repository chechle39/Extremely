﻿using AutoMapper.QueryableExtensions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using XBOOK.Common.Helpers;
using XBOOK.Data.Base;
using XBOOK.Data.Entities;
using XBOOK.Data.Interfaces;
using XBOOK.Data.Model;
using XBOOK.Data.ViewModels;

namespace XBOOK.Data.Repositories
{
    public class FunctionsRepository : Repository<Functions>, IFunctionsRepository
    {
        private readonly IAuthorizationService _authorizationService;
        public FunctionsRepository(DbContext context, IAuthorizationService authorizationService) : base(context)
        {
            _authorizationService = authorizationService;
        }

        public async Task<List<FunctionViewModel>> GetAllFunction()
        {
            var data = await Entities.ProjectTo<FunctionViewModel>().ToListAsync();
            return data;
        }

        public async Task<List<MenuModel>> GetMenu(ClaimsPrincipal user)
        {
            var data = await Entities.ToListAsync();
            var dataMenuList = new List<MenuModel>();
            
            foreach (var item in data.Where(x=>x.ParentId == null))
            {
                var children = new List<children>();
                foreach (var item2 in data.Where(x=>x.ParentId == item.Id))
                {
                    var result = await _authorizationService.AuthorizeAsync(user, item2.Name, Operations.Read);
                    if (result.Succeeded == true)
                    {
                        var child = new children()
                        {
                            link = item2.URL,
                            title = item2.Name,
                        };
                        children.Add(child);
                    }
                  
                }
                var menuModel = new MenuModel()
                {
                    icon = item.IconCss,
                    title = item.Name,
                    children = children
                };
                dataMenuList.Add(menuModel);
            }
            try
            {
                foreach (var item in dataMenuList.ToList())
                {
                    if (item.children.Count() == 0)
                    {
                        dataMenuList.Remove(item);
                    }
                }
            } catch (Exception ex)
            {

            }
            
            return dataMenuList;
        }
    }
}