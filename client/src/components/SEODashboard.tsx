import { FC, useState } from 'react';
import { SeoAnalysisResult, SeoAnalysisSection } from '@shared/schema';
import CategorySummary from './CategorySummary';
import BasicSEOTags from './BasicSEOTags';
import SocialMediaTags from './SocialMediaTags';
import TechnicalSEOTags from './TechnicalSEOTags';

interface SEODashboardProps {
  result: SeoAnalysisResult;
}

const SEODashboard: FC<SEODashboardProps> = ({ result }) => {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  
  // Get sections by category
  const getSection = (category: string): SeoAnalysisSection | undefined => {
    return result.sections.find(section => section.category === category);
  };
  
  const basicSection = getSection('basic');
  const socialMediaSection = getSection('socialMedia');
  const technicalSection = getSection('technical');
  
  const handleCategoryClick = (category: string) => {
    setActiveCategory(prev => prev === category ? null : category);
  };
  
  // Calculate total score color
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-success';
    if (score >= 50) return 'text-warning';
    return 'text-danger';
  };
  
  return (
    <div className="space-y-6">
      {/* Score overview card */}
      <div className="bg-primary/5 rounded-lg shadow-sm p-6 border border-primary/20">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">SEO Health Score</h2>
            <p className="text-slate-600 mt-1">
              Based on {result.sections.reduce((sum, section) => sum + section.tags.length, 0)} SEO factors
            </p>
          </div>
          <div className="mt-4 md:mt-0 flex flex-col items-center">
            <div className="w-32 h-32 relative">
              {/* Circular progress visualization */}
              <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                <path
                  d="M18 2.0845
                    a 15.9155 15.9155 0 0 1 0 31.831
                    a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#eee"
                  strokeWidth="3"
                  strokeDasharray="100, 100"
                />
                <path
                  d="M18 2.0845
                    a 15.9155 15.9155 0 0 1 0 31.831
                    a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke={
                    result.score >= 80 ? '#10b981' : 
                    result.score >= 50 ? '#f59e0b' : 
                    '#ef4444'
                  }
                  strokeWidth="3"
                  strokeDasharray={`${result.score}, 100`}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <span className={`text-4xl font-bold ${getScoreColor(result.score)}`}>{result.score}</span>
                  <span className="block text-xs text-slate-500">out of 100</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
          <div className="bg-white p-4 rounded-lg flex items-center justify-between">
            <div>
              <div className="text-sm text-slate-500">Present</div>
              <div className="text-2xl font-bold text-success">{result.presentCount}</div>
            </div>
            <div className="bg-success/10 p-3 rounded-full">
              <i className="fas fa-check text-success text-xl"></i>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg flex items-center justify-between">
            <div>
              <div className="text-sm text-slate-500">Need Improvement</div>
              <div className="text-2xl font-bold text-warning">{result.improveCount}</div>
            </div>
            <div className="bg-warning/10 p-3 rounded-full">
              <i className="fas fa-exclamation text-warning text-xl"></i>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg flex items-center justify-between">
            <div>
              <div className="text-sm text-slate-500">Missing</div>
              <div className="text-2xl font-bold text-danger">{result.missingCount}</div>
            </div>
            <div className="bg-danger/10 p-3 rounded-full">
              <i className="fas fa-times text-danger text-xl"></i>
            </div>
          </div>
        </div>
      </div>
      
      {/* Category summaries grid */}
      <h2 className="text-xl font-semibold mt-8 mb-4">SEO Categories Breakdown</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
        {basicSection && (
          <CategorySummary 
            section={basicSection} 
            onClick={() => handleCategoryClick('basic')} 
          />
        )}
        {socialMediaSection && (
          <CategorySummary 
            section={socialMediaSection} 
            onClick={() => handleCategoryClick('socialMedia')} 
          />
        )}
        {technicalSection && (
          <CategorySummary 
            section={technicalSection} 
            onClick={() => handleCategoryClick('technical')} 
          />
        )}
      </div>
      
      {/* Expanded category detail */}
      {activeCategory === 'basic' && basicSection && (
        <div className="mt-6 transition-all duration-300 ease-in-out">
          <BasicSEOTags section={basicSection} />
        </div>
      )}
      
      {activeCategory === 'socialMedia' && socialMediaSection && (
        <div className="mt-6 transition-all duration-300 ease-in-out">
          <SocialMediaTags section={socialMediaSection} />
        </div>
      )}
      
      {activeCategory === 'technical' && technicalSection && (
        <div className="mt-6 transition-all duration-300 ease-in-out">
          <TechnicalSEOTags section={technicalSection} />
        </div>
      )}
    </div>
  );
};

export default SEODashboard;