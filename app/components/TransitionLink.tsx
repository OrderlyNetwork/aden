import React from 'react';
import { Link, LinkProps } from '@remix-run/react';
import { usePageTransition } from '../contexts/PageTransitionContext';

type TransitionLinkProps = Omit<LinkProps, 'onClick'> & {
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
};

/**
 * A link component that uses our page transition system
 * It uses the same API as Remix's Link component but triggers our custom transition
 */
const TransitionLink: React.FC<TransitionLinkProps> = ({ 
  to, 
  children, 
  onClick,
  ...props 
}) => {
  const { navigateTo } = usePageTransition();
  
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    
    // Call the original onClick if provided
    if (onClick) {
      onClick(e);
    }
    
    // Handle transition
    if (typeof to === 'string') {
      navigateTo(to);
    } else {
      // If to is a LocationDescriptor, get the pathname
      navigateTo(to.pathname || '/');
    }
  };
  
  return (
    <Link
      to={to}
      onClick={handleClick}
      {...props}
    >
      {children}
    </Link>
  );
};

export default TransitionLink;