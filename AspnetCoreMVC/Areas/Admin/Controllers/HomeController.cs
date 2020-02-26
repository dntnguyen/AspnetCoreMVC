using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AspnetCoreMVC.Extensions;
using CoreApp.Data.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace AspnetCoreMVC.Areas.Admin.Controllers
{
    public class HomeController : BaseController
    {
        private readonly UserManager<AppUser> _userManager;

        public HomeController(UserManager<AppUser> userManager)
        {
            _userManager = userManager;
           
        }

        public IActionResult Index()
        {

            var email = User.GetSpecificClaim("Email");
            return View();
        }

    }
}