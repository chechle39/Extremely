using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Diagnostics;
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
    public class AccountChartSerVice : IAcountChartService
    {
        private readonly IRepository<AccountChart> _accountUowRepository;
        private readonly IUnitOfWork _uow;
        public AccountChartSerVice(IRepository<AccountChart> accountUowRepository, IUnitOfWork uow)
        {
            _accountUowRepository = accountUowRepository;
            _uow = uow;
        }

        public async Task<List<AccountChartViewModel>> GetAllAccount()
        {
            var listData = await _accountUowRepository.GetAll().ProjectTo<AccountChartViewModel>().Where(x => x.isParent == false).ToListAsync();
            return listData.ToList();
        }

        public async Task<List<TreeNode>> GetAllTreeAccountAsync()
        {
            var listData = await _accountUowRepository.GetAll().ProjectTo<TreeNode>().ToListAsync();
        //    var tree = TreeBuilder.BuildTree(listData);
            //foreach (var item in listData)
            //{
            //    li
            //}
            return listData;
        }
    }
    public static class TreeBuilder
    {
        public static Tree BuildTree(IEnumerable<TreeNode> nodes)
        {
            if (nodes == null) return new Tree();
            var nodeList = nodes.ToList();
            var tree = FindTreeRoot(nodeList);
            BuildTree(tree, nodeList);
            return tree;
        }

        private static void BuildTree(Tree tree, IList<TreeNode> descendants)
        {
            var children = descendants.Where(node => node.parentAccount == tree.accountNumber).ToList();
            foreach (var child in children)
            {
                var branch = Map(child);
                tree.Add(branch);
                descendants.Remove(child);
            }
            foreach (var branch in tree.Children)
            {
                BuildTree(branch, descendants);
            }
        }

        private static Tree FindTreeRoot(IList<TreeNode> nodes)
        {
            var rootNodes = nodes.Where(node => node.parentAccount == null);
            if (rootNodes.Count() != 1) return new Tree();
            var rootNode = rootNodes.Single();
            nodes.Remove(rootNode);
            return Map(rootNode);
        }

        private static Tree Map(TreeNode node)
        {
            return new Tree
            {
                accountNumber = node.accountNumber,
                accountName = node.accountName,
                accountType = node.accountType,
                closingBalance = node.closingBalance,
                isParent = node.isParent,
                openingBalance = node.openingBalance,
                parentAccount = node.parentAccount,
            };
        }
    }
    public static class TreeExtensions
    {
        public static IEnumerable<Tree> Descendants(this Tree value)
        {
            // a descendant is the node self and any descendant of the children
            if (value == null) yield break;
            yield return value;
            // depth-first pre-order tree walker
            foreach (var child in value.Children)
                foreach (var descendantOfChild in child.Descendants())
                {
                    yield return descendantOfChild;
                }
        }

        public static IEnumerable<Tree> Ancestors(this Tree value)
        {
            // an ancestor is the node self and any ancestor of the parent
            var ancestor = value;
            // post-order tree walker
            while (ancestor != null)
            {
                yield return ancestor;
                ancestor = ancestor.Parent;
            }
        }
    }

    public class Tree
    {
        public string accountNumber { get; set; }
        public string accountName { get; set; }
        public string accountType { get; set; }
        public bool isParent { get; set; }
        public string parentAccount { get; set; } // parent
        public Nullable<decimal> openingBalance { get; set; }
        public Nullable<decimal> closingBalance { get; set; }  
        public List<Tree> _children;
        public Tree _parent;

        public Tree()
        {
            accountName = string.Empty;
        }

        public Tree Parent { get { return _parent; } }
        public Tree Root { get { return _parent == null ? this : _parent.Root; } }
        public int Depth { get { return this.Ancestors().Count() - 1; } }

        public IEnumerable<Tree> Children
        {
            get { return _children == null ? Enumerable.Empty<Tree>() : _children.ToList(); }
        }

        public override string ToString()
        {
            return accountName;
        }

        public void Add(Tree child)
        {
            if (child == null)
                throw new ArgumentNullException();
            if (child._parent != null)
                throw new InvalidOperationException("A tree node must be removed from its parent before adding as child.");
            if (this.Ancestors().Contains(child))
                throw new InvalidOperationException("A tree cannot be a cyclic graph.");
            if (_children == null)
            {
                _children = new List<Tree>();
            }
            Debug.Assert(!_children.Contains(child), "At this point, the node is definately not a child");
            child._parent = this;
            _children.Add(child);
        }

        public bool Remove(Tree child)
        {
            if (child == null)
                throw new ArgumentNullException();
            if (child._parent != this)
                return false;
            Debug.Assert(_children.Contains(child), "At this point, the node is definately a child");
            child._parent = null;
            _children.Remove(child);
            if (!_children.Any())
                _children = null;
            return true;
        }
    }
}
