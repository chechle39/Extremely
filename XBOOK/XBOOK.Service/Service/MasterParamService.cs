using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using XBOOK.Data.Base;
using XBOOK.Data.Entities;
using XBOOK.Data.Interfaces;
using XBOOK.Data.Model;
using XBOOK.Data.ViewModels;
using XBOOK.Service.Interfaces;

namespace XBOOK.Service.Service
{
    public class MasterParamService : IMasterParamService
    {
        private readonly IRepository<MasterParam> _masterparamUowRepository;
        private readonly IUnitOfWork _uow;
        private readonly IMasterParamRepository _iMasterParamRepository;
        public MasterParamService(IRepository<MasterParam> masterparamUowRepository, IUnitOfWork uow, IMasterParamRepository iMasterParamRepository)
        {
            _masterparamUowRepository = masterparamUowRepository;
            _uow = uow;
            _iMasterParamRepository = iMasterParamRepository;
        }

        public async Task CreateMasterParam(List<MasterParamViewModel> request)
        {
            var masterparamCreate = Mapper.Map<List<MasterParamViewModel>, List<MasterParam>>(request);
            await _masterparamUowRepository.Add(masterparamCreate);
        }

        public async Task UpdateMaster(List<MasterParamViewModel> request)
        {
            var masterparamCreate = Mapper.Map<List<MasterParamViewModel>, List<MasterParam>>(request);
            await _masterparamUowRepository.Update(masterparamCreate);

        }

        public async Task<IEnumerable<MasterParamViewModel>> GetAllMaster()
        {
        
            var listTax = await _masterparamUowRepository.GetAll().ProjectTo<MasterParamViewModel>().ToListAsync();          

            return listTax;
        }

        public async Task<IEnumerable<MasterParamViewModel>> GetMasterById(string id)
        {
            var dataList = await _masterparamUowRepository.GetAll().ProjectTo<MasterParamViewModel>().Where(x => x.paramType == id).ToListAsync();
            return dataList;
        }

        public bool DeleteMaster(List<requestDeletedMaster> requestdelete)
        {
            var deleteTax = _iMasterParamRepository.DeleteMaster(requestdelete);
            _uow.SaveChanges();
            return deleteTax;
        }

       
    }
}
