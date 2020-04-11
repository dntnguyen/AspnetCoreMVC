using CoreApp.Data.Entities;
using CoreApp.Data.Enums;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace CoreApp.Application.ViewModels
{
    public class BlogTagViewModel
    {
        public int BlogId { set; get; }


        public string TagId { set; get; }

    }
}
