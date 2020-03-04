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
        public ProductController(IProductService productService)
        {
            _productService = productService;
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

        public IActionResult GetAllPaging(int? categoryId, string keyword, int pageNo, int pageSize)
        {
            var model = _productService.GetAllPaging(categoryId, keyword, pageNo, pageSize);
            return new OkObjectResult(model);
        }
        #endregion
    }
}