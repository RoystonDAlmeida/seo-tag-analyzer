import { FC } from 'react';

const Footer: FC = () => {
  return (
    <footer className="bg-slate-800 text-slate-300 py-6 sm:py-8 mt-8 sm:mt-12">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row justify-between items-center">
          <div className="mb-6 sm:mb-0 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start">
              <i className="fas fa-search-plus text-primary text-lg sm:text-xl mr-2"></i>
              <h2 className="text-lg font-semibold text-white bg-gradient-to-r from-primary to-blue-500 text-transparent bg-clip-text">SEO Tag Analyzer</h2>
            </div>
            <p className="text-xs sm:text-sm mt-1">Visualize and optimize your website's meta tags</p>
          </div>
          <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
            <a href="#" className="text-slate-300 hover:text-white transition-colors text-sm">
              <i className="fas fa-book mr-1"></i>
              Documentation
            </a>
            <a href="#" className="text-slate-300 hover:text-white transition-colors text-sm">
              <i className="fas fa-question-circle mr-1"></i>
              Help
            </a>
            <a href="#" className="text-slate-300 hover:text-white transition-colors text-sm">
              <i className="fas fa-code mr-1"></i>
              API
            </a>
          </div>
        </div>
        <div className="mt-6 pt-4 sm:pt-6 border-t border-slate-700 text-center text-xs sm:text-sm">
          <p>&copy; {new Date().getFullYear()} SEO Tag Analyzer. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;