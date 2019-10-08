using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using XBOOK.Data.Base;
using XBOOK.Data.Entities;
using XBOOK.Data.ViewModels;
using XBOOK.Service.Interfaces;

namespace XBOOK.Service.Service
{
    public class CategoryService : ICategoryService
    {
        private readonly IRepository<Category> _categoryUowRepository;
        private readonly IUnitOfWork _uow;
        public CategoryService(IRepository<Category> categoryUowRepository, IUnitOfWork uow)
        {
            _uow = uow;
            _categoryUowRepository = categoryUowRepository;
        }

        public async Task<IEnumerable<CategoryViewModel>> GetAllCategory()
        {
            return await _categoryUowRepository.GetAll().ProjectTo<CategoryViewModel>().ToListAsync();
        }

        public async Task<IEnumerable<CategoryViewModel>> GetCategoryById(int id)
        {
            return await _categoryUowRepository.GetAll().ProjectTo<CategoryViewModel>().Where(x => x.CategoryID == id).ToListAsync();
        }
    }   
}
