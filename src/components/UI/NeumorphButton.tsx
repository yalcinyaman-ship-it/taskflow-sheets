import React from 'react';

interface NeumorphButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
    variant?: 'primary' | 'secondary' | 'danger';
}

const NeumorphButton: React.FC<NeumorphButtonProps> = ({
    children,
    variant = 'primary',
    className = '',
    ...props
}) => {
    const variantClasses = {
        primary: 'bg-primary text-white hover:shadow-neumorph-inset',
        secondary: 'bg-surface text-text hover:shadow-neumorph',
        danger: 'bg-red-500 text-white hover:shadow-neumorph-inset'
    };

    return (
        <button
            className={`
        px-6 py-3 rounded-xl font-medium
        shadow-neumorph active:shadow-neumorph-inset
        transition-all duration-200
        ${variantClasses[variant]}
        ${className}
      `}
            {...props}
        >
            {children}
        </button>
    );
};

export default NeumorphButton;
