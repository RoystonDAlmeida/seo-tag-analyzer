import { FC } from 'react';

const Header: FC = () => {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-10">
      <div className="container mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-center justify-between">
        <div className="flex items-center mb-2 sm:mb-0">
          <i className="fas fa-search-plus text-primary text-xl sm:text-2xl mr-2"></i>
          <h1 className="text-lg sm:text-xl font-semibold text-primary bg-gradient-to-r from-primary to-blue-500 text-transparent bg-clip-text">SEO Tag Analyzer</h1>
        </div>
        <div className="text-xs sm:text-sm text-slate-500">
          Visualize and optimize your website's meta tags
        </div>
      </div>
    </header>
  );
};

export default Header;