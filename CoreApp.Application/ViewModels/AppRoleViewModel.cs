﻿using CoreApp.Data.Entities;
using CoreApp.Data.Enums;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace CoreApp.Application.ViewModels
{
    public class AppRoleViewModel
    {
        public string Id { set; get; }

        public string Name { set; get; }

        public string Description { set; get; }
    }
}
