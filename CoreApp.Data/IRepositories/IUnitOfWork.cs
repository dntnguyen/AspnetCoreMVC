using System;
using System.Collections.Generic;
using System.Text;

namespace CoreApp.Data.IRepositories
{
    public interface IUnitOfWork : IDisposable
    {
        // Call Save Changes In Database
        void Commit();
    }
}
