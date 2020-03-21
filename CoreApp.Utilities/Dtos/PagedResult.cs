using System;
using System.Collections.Generic;
using System.Text;

namespace CoreApp.Utilities.Dtos
{
    public class PagedResult<T> : BasePageResult where T : class
    {
        public IList<T> Results { get; set; }
        public PagedResult()
        {
            Results = new List<T>();
        }


    }
}
