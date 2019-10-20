using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;
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
            };
            _clientUowRepository.AddData(client);
            _uow.SaveChanges();
            return client;
        }

        public bool DeletedClient(long id)
        {
            _iClientRepository.remiveClient(id);
            _uow.SaveChanges();
            return true;
        }

        public async Task<IEnumerable<ClientViewModel>> GetAllClient(ClientSerchRequest request)
        {
            if (!string.IsNullOrEmpty(request.ClientKeyword))
            {
                var listData = await _clientUowRepository.GetAll().ProjectTo<ClientViewModel>().ToListAsync();
                var query = listData.Where(x => x.ClientName.Contains(request.ClientKeyword) || x.Address.Contains(request.ClientKeyword)|| x.Email.Contains(request.ClientKeyword)).ToList();
                return query;
            }
            else
            {
                return await _clientUowRepository.GetAll().ProjectTo<ClientViewModel>().ToListAsync();
            }
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
