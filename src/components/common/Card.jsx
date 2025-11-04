const Card = ({ children, className = '', ...props }) => {
  return (
    <div
      {...props}
      className={`bg-white rounded-lg shadow-md p-6 ${className}`}
    >
      {children}
    </div>
  );
};

export default Card;