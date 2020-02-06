namespace CoreApp.Infrastructure.SharedKernels
{
    public abstract class DomainEntity<T>
    {
        public T Id { get; set; }

        // If True Then Domain Entity Has Identity
        public bool IsTransient()
        {
            return Id.Equals(default(T));
        }
    }
}