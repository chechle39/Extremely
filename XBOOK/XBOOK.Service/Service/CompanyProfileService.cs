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
using XBOOK.Data.Model;
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
        public async Task<IEnumerable<CompanyProfileViewModel>> GetInFoProfile1()
        {
            var company = await _conpanyProfileUowRepository.GetAll().ProjectTo<CompanyProfileViewModel>().ToListAsync();
            return company;
        }
        public async Task<CompanyProfileViewModel> GetInFoProfile()
        {
            var company = await _conpanyProfileUowRepository.GetAll().ProjectTo<CompanyProfileViewModel>().ToListAsync();
            return company[0];
        }
        public CompanyProfile CreateCompanyProfile(CompanyProfileViewModel request)
        {
            var clientCreate = Mapper.Map<CompanyProfileViewModel, CompanyProfile>(request);
            var companyprofile = new CompanyProfile()
            {
                Id = 0,
                companyName = request.companyName,
                address = request.address,
                city = request.city,
                country = request.country,
                zipCode = request.zipCode,
                currency = request.currency,
                bankAccount = request.bankAccount,
                dateFormat = request.dateFormat,
                bizPhone = request.bizPhone,
                mobilePhone = request.mobilePhone,
                directorName = request.directorName,
                logoFilePath = request.logoFilePath,
                code = request.code,
                taxCode = request.taxCode,
            };
            _conpanyProfileUowRepository.AddData(companyprofile);
            _uow.SaveChanges();
            return companyprofile;
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
        public async Task<bool> UpdateCompanyProfile(CompanyProfileViewModel request)
        {
            var companyCreate = Mapper.Map<CompanyProfileViewModel, CompanyProfile>(request);
            await _conpanyProfileUowRepository.Update(companyCreate);
            return true;
        }
        public async Task<CompanyProfileViewModel> GetCompanyById(int id)
        {
            var dataList = await _conpanyProfileUowRepository.GetAll().ProjectTo<CompanyProfileViewModel>().Where(x => x.Id == id).ToListAsync();
            return dataList[0];
        }
    }
}
