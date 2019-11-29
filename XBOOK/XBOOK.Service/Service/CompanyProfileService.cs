using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using XBOOK.Data.Base;
using XBOOK.Data.Entities;
using XBOOK.Data.Interfaces;
using XBOOK.Data.ViewModels;
using XBOOK.Service.Interfaces;

namespace XBOOK.Service.Service
{
    public class CompanyProfileService : ICompanyProfileService
    {
        private readonly IRepository<CompanyProfile> _conpanyProfileUowRepository;
        private readonly IUnitOfWork _uow;
        ICompanyProfileReponsitory _iCompanyProfileReponsitory;
        public CompanyProfileService(IRepository<CompanyProfile> conpanyProfileUowRepository, IUnitOfWork uow, ICompanyProfileReponsitory iCompanyProfileReponsitory)
        {
            _conpanyProfileUowRepository = conpanyProfileUowRepository;
            _uow = uow;
            _iCompanyProfileReponsitory = iCompanyProfileReponsitory;
        }
        public async Task<CompanyProfileViewModel> GetInFoProfile()
        {
            var company = await _conpanyProfileUowRepository.GetAll().ProjectTo<CompanyProfileViewModel>().ToListAsync();
            return company[0];
        }

        public bool UpdateCompany(string request)
        {
            
            try
            {
                var company = _conpanyProfileUowRepository.GetAll().ProjectTo<CompanyProfileViewModel>().ToList();
                company[0].logoFilePath = request;
                var updatecompany = Mapper.Map<CompanyProfileViewModel, CompanyProfile>(company[0]);
                _iCompanyProfileReponsitory.UpdateProfile(updatecompany);
                _uow.SaveChanges();
            }
            catch (Exception ex)
            {

            }

            return true;
        }

    }
}
