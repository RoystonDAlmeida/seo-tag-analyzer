import { FC, useState } from 'react';
import { SeoAnalysisResult } from '@shared/schema';
import { getRecommendationColorClass, getRecommendationIcon } from '@/lib/seoHelper';

interface VisualRecommendationsProps {
  recommendations: SeoAnalysisResult['recommendations'];
}

const VisualRecommendations: FC<VisualRecommendationsProps> = ({ recommendations }) => {
  const [activeTab, setActiveTab] = useState<'all' | 'critical' | 'improvement' | 'additional'>('all');
  
  // Count recommendations by type
  const criticalCount = recommendations.filter(rec => rec.type === 'critical').length;
  const improvementCount = recommendations.filter(rec => rec.type === 'improvement').length;
  const additionalCount = recommendations.filter(rec => rec.type === 'additional').length;
  
  // Filter recommendations based on active tab
  const filteredRecommendations = 
    activeTab === 'all' 
      ? recommendations 
      : recommendations.filter(rec => rec.type === activeTab);
  
  return (
    <section className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-6 flex items-center">
        <i className="fas fa-lightbulb text-primary mr-2"></i>
        SEO Recommendations
      </h2>
      
      {/* Tabs */}
      <div className="flex flex-wrap border-b border-slate-200 mb-6">
        <button 
          className={`px-4 py-2 font-medium text-sm mr-2 ${activeTab === 'all' 
            ? 'border-b-2 border-primary text-primary' 
            : 'text-slate-500 hover:text-slate-800'}`}
          onClick={() => setActiveTab('all')}
        >
          All ({recommendations.length})
        </button>
        {criticalCount > 0 && (
          <button 
            className={`px-4 py-2 font-medium text-sm mr-2 ${activeTab === 'critical' 
              ? 'border-b-2 border-danger text-danger' 
              : 'text-slate-500 hover:text-slate-800'}`}
            onClick={() => setActiveTab('critical')}
          >
            Critical ({criticalCount})
          </button>
        )}
        {improvementCount > 0 && (
          <button 
            className={`px-4 py-2 font-medium text-sm mr-2 ${activeTab === 'improvement' 
              ? 'border-b-2 border-warning text-warning' 
              : 'text-slate-500 hover:text-slate-800'}`}
            onClick={() => setActiveTab('improvement')}
          >
            Improvements ({improvementCount})
          </button>
        )}
        {additionalCount > 0 && (
          <button 
            className={`px-4 py-2 font-medium text-sm ${activeTab === 'additional' 
              ? 'border-b-2 border-primary text-primary' 
              : 'text-slate-500 hover:text-slate-800'}`}
            onClick={() => setActiveTab('additional')}
          >
            Additional ({additionalCount})
          </button>
        )}
      </div>
      
      {/* Visual recommendation cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredRecommendations.map((recommendation, index) => {
          const iconClass = getRecommendationIcon(recommendation.type);
          const colorClass = getRecommendationColorClass(recommendation.type);
          const bgColorClass = recommendation.type === 'critical' 
            ? 'bg-danger/5 border-danger/20' 
            : recommendation.type === 'improvement' 
              ? 'bg-warning/5 border-warning/20' 
              : 'bg-primary/5 border-primary/20';
          
          return (
            <div 
              key={index} 
              className={`rounded-lg border p-4 ${bgColorClass}`}
            >
              <div className="flex items-start mb-3">
                <div className={`${colorClass} p-2 rounded-full mr-3 bg-white`}>
                  <i className={`fas fa-${iconClass} text-lg`}></i>
                </div>
                <div>
                  <h3 className="font-medium">{recommendation.title}</h3>
                  <p className="text-sm text-slate-600 mt-1">{recommendation.description}</p>
                </div>
              </div>
              
              <div className="bg-white/80 rounded-md p-3 mt-2">
                <h4 className="text-sm font-medium mb-2">Action Items:</h4>
                <ul className="list-disc pl-5 space-y-2 text-sm text-slate-600">
                  {recommendation.items.map((item, i) => (
                    <li key={i} dangerouslySetInnerHTML={{ 
                      __html: item.replace(/<([^>]+)>/g, '<code class="text-xs bg-slate-100 px-1 py-0.5 rounded break-all">$1</code>') 
                    }} />
                  ))}
                </ul>
              </div>
            </div>
          );
        })}
      </div>
      
      {filteredRecommendations.length === 0 && (
        <div className="text-center p-8 text-slate-500">
          <i className="fas fa-check-circle text-success text-4xl mb-3"></i>
          <p>No {activeTab !== 'all' ? activeTab : ''} recommendations found.</p>
        </div>
      )}
    </section>
  );
};

export default VisualRecommendations;