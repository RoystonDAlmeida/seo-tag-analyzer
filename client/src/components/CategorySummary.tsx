import { FC } from 'react';
import { SeoAnalysisSection } from '@shared/schema';
import { getStatusBgClass, getStatusIcon } from '@/lib/seoHelper';

interface CategorySummaryProps {
  section: SeoAnalysisSection;
  onClick?: () => void;
}

const CategorySummary: FC<CategorySummaryProps> = ({ section, onClick }) => {
  // Calculate stats for this category
  const optimalCount = section.tags.filter(tag => tag.status === 'optimal' || tag.status === 'good').length;
  const improveCount = section.tags.filter(tag => tag.status === 'improve').length;
  const missingCount = section.tags.filter(tag => tag.status === 'missing').length;
  const totalTags = section.tags.length;
  
  // Calculate percentage for the circular progress
  const scorePercentage = Math.round((optimalCount / totalTags) * 100);
  
  return (
    <div 
      className="bg-white rounded-lg shadow-sm border border-slate-100 p-4 transition-all duration-200 hover:shadow-md cursor-pointer"
      onClick={onClick}
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-medium text-lg flex items-center">
            <i className={`fas fa-${section.icon} text-primary mr-2`}></i>
            {section.title}
          </h3>
          <span className={`text-xs mt-1 px-2 py-0.5 inline-block ${getStatusBgClass(section.status)} rounded-full`}>
            {section.statusText}
          </span>
        </div>
        <div className="w-16 h-16 relative">
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
                scorePercentage >= 80 ? '#10b981' : 
                scorePercentage >= 50 ? '#f59e0b' : 
                '#ef4444'
              }
              strokeWidth="3"
              strokeDasharray={`${scorePercentage}, 100`}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-lg font-bold">{scorePercentage}%</span>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-2 text-center text-sm">
        <div className="bg-success/10 rounded-md p-2">
          <div className="font-bold text-success">{optimalCount}</div>
          <div className="text-xs text-slate-600">Optimal</div>
        </div>
        <div className="bg-warning/10 rounded-md p-2">
          <div className="font-bold text-warning">{improveCount}</div>
          <div className="text-xs text-slate-600">Improve</div>
        </div>
        <div className="bg-danger/10 rounded-md p-2">
          <div className="font-bold text-danger">{missingCount}</div>
          <div className="text-xs text-slate-600">Missing</div>
        </div>
      </div>
    </div>
  );
};

export default CategorySummary;