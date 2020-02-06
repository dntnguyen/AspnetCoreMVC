using System;
using System.Collections.Generic;
using System.Text;

namespace CoreApp.Data.Interfaces
{
    public interface IDateTracking
    {
        public DateTime CreatedDate{ get; set; }
        public DateTime? ModifiedDate { get; set; }
    }
}
