﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using CoreApp.Application.Interfaces;
using CoreApp.Application.ViewModels;
using CoreApp.Utilities.Helpers;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ModelBinding;

namespace AspnetCoreMVC.Areas.Admin.Controllers
{
    public class ProductCategoryController : BaseController
    {

        IProductCategoryService _productCategoryService;
        public ProductCategoryController(IProductCategoryService productCategoryService)
        {

            _productCategoryService = productCategoryService;
        }

        public IActionResult Index()
        {
            return View();
        }

        #region AJAX API
        [HttpGet]
        public IActionResult GetById(int id)
        {
            var model = _productCategoryService.GetById(id);
            return new OkObjectResult(model);
        }

        [HttpPost]
        public IActionResult SaveEntity(ProductCategoryViewModel productVm)
        {
            if (ModelState.IsValid == false)
            {
                IEnumerable<ModelError> allErrors = ModelState.Values.SelectMany(v => v.Errors);
                return new BadRequestObjectResult(allErrors);
            }
            else
            {
                productVm.SeoAlias = TextHelper.ToUnsignString(productVm.Name);
                if (productVm.Id == 0)
                {
                    _productCategoryService.Add(productVm);
                }
                else
                {
                    _productCategoryService.Update(productVm);
                }

                _productCategoryService.Save();
                return new OkObjectResult(productVm);
            }
        }

        [HttpPost]
        public IActionResult Delete(int id)
        {
            if (id == 0)
            {
                return new BadRequestResult();
            }
            else
            {
              
                _productCategoryService.Delete(id);
                _productCategoryService.Save();
               
                return new OkObjectResult(id);

            }
        }

        public IActionResult GetAll()
        {
            var model = _productCategoryService.GetAll();
            return new OkObjectResult(model);
        }

        [HttpPost]
        public IActionResult UpdateParentId(int sourceId, int targetId, Dictionary<int, int> items)
        {
            if (ModelState.IsValid == false)
            {
                return new BadRequestObjectResult(ModelState);
            }
            else
            {
                if (sourceId == targetId)
                {
                    return new BadRequestResult();
                }
                else
                {
                    _productCategoryService.UpdateParentId(sourceId, targetId, items);
                    _productCategoryService.Save();
                    return new OkResult();
                }
            }
        }
        [HttpPost]
        public IActionResult ReOrder(int sourceId, int targetId)
        {
            if (ModelState.IsValid == false)
            {
                return new BadRequestObjectResult(ModelState);
            }
            else
            {
                _productCategoryService.ReOrder(sourceId, targetId);
                _productCategoryService.Save();
                return new OkResult();
            }
        }
        #endregion
    }
}