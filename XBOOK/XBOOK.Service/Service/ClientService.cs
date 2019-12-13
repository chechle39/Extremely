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
    public class ClientService : IClientService
    {
        private readonly IRepository<Client> _clientUowRepository;
        private readonly IUnitOfWork _uow;
        private readonly IClientRepository _iClientRepository;
        private readonly XBookContext _context;

        public ClientService(IUnitOfWork uow, XBookContext context, IClientRepository iClientRepository)
        {
            _uow = uow;
            _clientUowRepository = _uow.GetRepository<IRepository<Client>>();
            _context = context;
            _iClientRepository = iClientRepository;
        }
        public Client CreateClient(ClientCreateRequet request)
        {
            var clientCreate = Mapper.Map<ClientCreateRequet, Client>(request);
            var client = new Client()
            {
                clientID = 0,
                address = request.Address,
                clientName = request.ClientName,
                contactName = request.ContactName,
                email = request.Email,
                note = request.Note,
                Tag = request.Tag,
                taxCode = request.TaxCode,
                bankAccount = request.bankAccount
            };
            _clientUowRepository.AddData(client);
            _uow.SaveChanges();
            return client;
        }

        public bool DeletedClient(List<requestDeleted> request)
        {
            foreach(var item in request)
            {
                _iClientRepository.remiveClient(item.id);
            }
            _uow.SaveChanges();

            return true;
        }

        public async Task<IEnumerable<ClientViewModel>> GetAllClient(ClientSerchRequest request)
        {
            //if (!string.IsNullOrEmpty(request.ClientKeyword) && request.isGrid == true)
            //{
            //    var listData = await _clientUowRepository.GetAll().ProjectTo<ClientViewModel>().Take(200).ToListAsync();
            //    try
            //    {
            //        var query = listData.Where(x => x.ClientName.ToLowerInvariant().Contains(request.ClientKeyword) || x.Address.ToLowerInvariant().Contains(request.ClientKeyword) || x.Email.ToLowerInvariant().Contains(request.ClientKeyword) || x.TaxCode.ToLowerInvariant().Contains(request.ClientKeyword)).ToList();
            //        return query;
            //    }
            //    catch (Exception ex)
            //    {

            //    }
            //    return listData;
            //}
            //else 
            //if(string.IsNullOrEmpty(request.ClientKeyword) && request.isGrid == true)
            //{
            //    var listData = await _clientUowRepository.GetAll().ProjectTo<ClientViewModel>().Take(200).ToListAsync();
            //    return listData;
            //}
            //if (!string.IsNullOrEmpty(request.ClientKeyword))
            //{
            //    var listData = await _clientUowRepository.GetAll().Where(x=>x.clientName.ToLowerInvariant().Contains(request.ClientKeyword) || x.address.ToLowerInvariant().Contains(request.ClientKeyword) || x.email.ToLowerInvariant().Contains(request.ClientKeyword) || x.taxCode.ToLowerInvariant().Contains(request.ClientKeyword)).ProjectTo<ClientViewModel>().Take(20).ToListAsync();
            //    return listData;
            //}else if (string.IsNullOrEmpty(request.ClientKeyword))
            //{
            //    var listData = await _clientUowRepository.GetAll().ProjectTo<ClientViewModel>().Take(20).ToListAsync();
            //    return listData;
            //}else
            //{
            //    var listData = await _clientUowRepository.GetAll().ProjectTo<ClientViewModel>().Take(200).ToListAsync();
            //    return listData;
            //}
            var data = await _iClientRepository.GetAllClientAsync(request);
            return data;
        }

        public async Task<ClientViewModel> GetClientById(int id)
        {
            var dataList = await _clientUowRepository.GetAll().ProjectTo<ClientViewModel>().Where(x => x.ClientId == id).ToListAsync();
            return dataList[0];
        }

        public async Task<IEnumerable<ClientViewModel>> SerchClient(string keyword)
        {
            var lisClient = await _clientUowRepository.GetAll().ProjectTo<ClientViewModel>().ToListAsync();
            var listWhere = lisClient.Where(x => x.ClientName == keyword).ToList();
            return listWhere;
        }

        public async Task<bool> UpdateClient(ClientCreateRequet request)
        {
            var clientCreate = Mapper.Map<ClientCreateRequet, Client>(request);
            await _clientUowRepository.Update(clientCreate);
            return true;
        }
    }
}
