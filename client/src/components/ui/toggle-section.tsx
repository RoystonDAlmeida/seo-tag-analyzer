import { FC, useState, ReactNode } from 'react';

interface ToggleSectionProps {
  title: string;
  children: ReactNode;
  id?: string;
}

const ToggleSection: FC<ToggleSectionProps> = ({ title, children, id }) => {
  const [isOpen, setIsOpen] = useState(false);
  const toggleId = id || `toggle-${Math.random().toString(36).substr(2, 9)}`;

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="mt-3">
      <button 
        className="text-primary text-sm font-medium hover:underline flex items-center focus:outline-none focus:ring-2 focus:ring-primary/30 focus:ring-offset-1 rounded-sm py-1 px-1 -ml-1 w-full justify-between sm:w-auto sm:justify-start" 
        onClick={handleToggle}
        aria-expanded={isOpen}
        aria-controls={toggleId}
      >
        <span>{title}</span>
        <i className={`fas fa-chevron-${isOpen ? 'up' : 'down'} ml-2 text-primary/70`}></i>
      </button>
      <div 
        id={toggleId}
        className={`mt-3 text-sm bg-blue-50 p-3 rounded-md transition-all ${isOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0 hidden'}`}
      >
        {children}
      </div>
    </div>
  );
};

export default ToggleSection;
