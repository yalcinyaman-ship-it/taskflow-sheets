import React from 'react';

interface NeumorphCardProps {
    children: React.ReactNode;
    className?: string;
}

const NeumorphCard: React.FC<NeumorphCardProps> = ({ children, className = '' }) => {
    return (
        <div className={`bg-surface p-6 rounded-2xl shadow-neumorph ${className}`}>
            {children}
        </div>
    );
};

export default NeumorphCard;
