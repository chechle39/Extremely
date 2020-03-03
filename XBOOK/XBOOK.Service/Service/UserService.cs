using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using XBOOK.Data.Identity;
using XBOOK.Data.Interfaces;
using XBOOK.Data.Model;
using XBOOK.Data.ViewModels;
using XBOOK.Service.Interfaces;

namespace XBOOK.Service.Service
{
    public class UserService : IUserService
    {
        private readonly IUserRepository _userRepository;
        private readonly UserManager<AppUser> _userManager;
        public UserService(IUserRepository userRepository, UserManager<AppUser> userManager)
        {
            _userRepository = userRepository;
            _userManager = userManager;
        }

        public async Task<bool> AddAsync(ApplicationUserViewModel userVm)
        {
            var user = new AppUser()
            {
                UserName = userVm.Email,
                Avatar = userVm.Avatar,
                Email = userVm.Email,
                FullName = userVm.FullName,
                DateCreated = DateTime.Now,
                PhoneNumber = userVm.PhoneNumber,
                BirthDay = userVm.BirthDay,
                Gender = userVm.Gender,
                Status = userVm.Status,
                Address = userVm.Address
            };

            var result = await _userManager.CreateAsync(user, userVm.Password);
            if (result.Succeeded && userVm.Roles.Count > 0)
            {
               var appUser = await _userManager.FindByNameAsync(user.UserName);
               if (appUser != null)
                   await _userManager.AddToRolesAsync(appUser, userVm.Roles);
            }

            
            return await Task.FromResult(true);
        }

        public async Task<bool> checkUserAcount()
        {
           return  await _userRepository.checkUserAcount();
        }

        public async Task DeleteAsync(List<Deleted> rq)
        {
            foreach (var item in rq)
            {
                var user = await _userManager.FindByIdAsync(item.id.ToString());
                await _userManager.DeleteAsync(user);
            }
           
        }

        public async Task<List<ApplicationUserViewModel>> GetAllAsync(UserRequest rq)
        {
            if(rq.KeyWord == "")
            {
                var data = await _userManager.Users.ProjectTo<ApplicationUserViewModel>().ToListAsync();
                return data;
            } else
            {
                var data = await _userManager.Users.ProjectTo<ApplicationUserViewModel>().Where(x=>x.FullName.Contains(rq.KeyWord) || x.UserName.Contains(rq.KeyWord) || x.Address.Contains(rq.KeyWord)).ToListAsync();
                return data;
            }
       
            
        }

        public async Task UpdateAsync(ApplicationUserViewModel userVm)
        {
            var user = await _userManager.FindByIdAsync(userVm.Id.ToString());
            var currentRoles = await _userManager.GetRolesAsync(user);
            var result = await _userManager.AddToRolesAsync(user,
            userVm.Roles.Except(currentRoles).ToArray());
            if (result.Succeeded)
            {
                string[] needRemoveRoles = currentRoles.Except(userVm.Roles).ToArray();
                await _userManager.RemoveFromRolesAsync(user, needRemoveRoles);

                //Update user detail
                user.FullName = userVm.FullName;
                user.Status = userVm.Status;
                user.Email = userVm.Email;
                user.UserName = userVm.Email;
                user.PhoneNumber = userVm.PhoneNumber;
                user.Gender = userVm.Gender;
                user.BirthDay = userVm.BirthDay;
                user.Address = userVm.Address;
                await _userManager.UpdateAsync(user);
            }
        }

        public async Task<ApplicationUserViewModel> GetById(int id)
        {
            var user = await _userManager.FindByIdAsync(id.ToString());
            var roles = await _userManager.GetRolesAsync(user);
            var userVm = Mapper.Map<AppUser, ApplicationUserViewModel>(user);
            userVm.Roles = roles.ToList();
            return userVm;
        }
    }
}
