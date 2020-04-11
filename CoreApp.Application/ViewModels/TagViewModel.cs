using CoreApp.Data.Entities;
using CoreApp.Data.Enums;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace CoreApp.Application.ViewModels
{
    public class TagViewModel
    {
        public string Id { set; get; }

        public string Name { set; get; }

        public string Type { set; get; }
    }
}
