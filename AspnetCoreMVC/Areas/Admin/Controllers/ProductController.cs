using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using CoreApp.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace AspnetCoreMVC.Areas.Admin.Controllers
{
    public class ProductController : BaseController
    {
        IProductService _productService;
        IProductCategoryService _productCategoryService;
        public ProductController(IProductService productService, IProductCategoryService productCategoryService)
        {
            _productService = productService;
            _productCategoryService = productCategoryService;
        }

        public IActionResult Index()
        {
            return View();
        }

        #region AJAX API
        public IActionResult GetAll()
        {
            var model = _productService.GetAll();
            return new OkObjectResult(model);
        }

        public IActionResult GetAllCategories()
        {
            var model = _productCategoryService.GetAll();
            return new OkObjectResult(model);
        }

        public IActionResult GetAllPaging(int? categoryId, string keyword, int pageNo, int pageSize)
        {
            var model = _productService.GetAllPaging(categoryId, keyword, pageNo, pageSize);
            return new OkObjectResult(model);
        }
        #endregion
    }
}