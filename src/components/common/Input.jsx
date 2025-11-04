const Input = ({ label, error, icon: Icon, className = '', ...props }) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon className="h-5 w-5 text-gray-400" />
          </div>
        )}
        <input
          {...props}
          className={`
            w-full rounded-lg border border-gray-300 
            ${Icon ? 'pl-10' : 'pl-3'} pr-3 py-2.5
            focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
            ${error ? 'border-red-500' : ''}
            disabled:bg-gray-100 disabled:cursor-not-allowed
            ${className}
          `}
        />
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

export default Input;