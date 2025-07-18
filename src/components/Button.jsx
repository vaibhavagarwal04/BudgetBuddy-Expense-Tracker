const Button = ({ children, onClick, className = "" }) => {
    return (
        <button
            onClick={onClick}
            className={`md:px-5 md:py-1 
               px-10 py-3 bg-white-500 text-black rounded-2xl border-2  border-black hover:bg-black hover:text-white font-bold ${className} sm:`}
        >
            {children}
        </button>
    );
};

export default Button;
