using System;
using System.Collections.Generic;
using System.Text;

namespace CoreApp.Utilities.Dtos
{
    public class PageResult<T> : BasePageResult where T : class
    {
        public IList<T> Results { get; set; }
        public PageResult()
        {
            Results = new List<T>();
        }


    }
}
