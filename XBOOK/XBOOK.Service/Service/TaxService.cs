using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;
using XBOOK.Data.Base;
using XBOOK.Data.Entities;
using XBOOK.Data.Interfaces;
using XBOOK.Data.Model;
using XBOOK.Data.ViewModels;
using XBOOK.Service.Interfaces;

namespace XBOOK.Service.Service
{
    public class TaxService : ITaxService
    {
        private readonly IRepository<Tax> _taxUowRepository;
        private readonly IUnitOfWork _uow;
        private readonly ITaxRepository _iTaxRepository;
        public TaxService(IRepository<Tax> taxUowRepository, IUnitOfWork uow, ITaxRepository iTaxRepository)
        {
            _taxUowRepository = taxUowRepository;
            _uow = uow;
            _iTaxRepository = iTaxRepository;
        }

        public async Task CreateTax(List<TaxViewModel> request)
        {
            var taxCreate = Mapper.Map<List<TaxViewModel>, List<Tax>>(request);
            await _taxUowRepository.Add(taxCreate);
        }

        public bool DeleteProduct(List<requestDeleted> id)
        {
            throw new System.NotImplementedException();
        }

        public bool DeleteTax(List<requestDeleted> request)
        {
            var deleteTax = _iTaxRepository.DeleteTax(request);
            _uow.SaveChanges();
            return deleteTax;
        }

        public async Task<IEnumerable<TaxViewModel>> GetAllTax()
        {
            var listTax = await _taxUowRepository.GetAll().ProjectTo<TaxViewModel>().ToListAsync();
            return listTax;
        }

    }
}
