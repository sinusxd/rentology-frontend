import React from 'react';
import cl from './LoginButton.module.css';

interface LoginButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

const LoginButton: React.FC<LoginButtonProps> = ({
                                                     children,
                                                     type = 'button',
                                                     className,
                                                     ...rest
                                                 }) => {
    return (
        <button
            type={type}
            className={`${cl.loginButton} ${className ?? ''}`}
            {...rest}
        >
            {children}
        </button>
    );
};

export default LoginButton;
