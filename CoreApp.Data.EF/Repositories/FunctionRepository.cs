﻿using CoreApp.Data.Entities;
using CoreApp.Data.IRepositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;

namespace CoreApp.Data.EF.Repositories
{
    public class FunctionRepository : EFRepository<Function, string>, IFunctionRepository
    {
        AppDbContext _context;
        public FunctionRepository(AppDbContext context) : base(context)
        {
            _context = context;
        }

      
    }
}
