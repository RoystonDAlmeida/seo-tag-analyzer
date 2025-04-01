import { FC } from 'react';
import { SeoAnalysisResult } from '@shared/schema';
import { getRecommendationColorClass, getRecommendationIcon } from '@/lib/seoHelper';

interface RecommendationsSummaryProps {
  recommendations: SeoAnalysisResult['recommendations'];
}

const RecommendationsSummary: FC<RecommendationsSummaryProps> = ({ recommendations }) => {
  return (
    <section className="mt-8 bg-primary/5 rounded-lg shadow-sm p-4 sm:p-6 border border-primary/20">
      <h2 className="text-lg font-semibold mb-4 text-primary">
        <i className="fas fa-lightbulb mr-2"></i>
        SEO Improvement Recommendations
      </h2>
      <div className="space-y-6">
        {recommendations.map((recommendation, index) => (
          <div key={index} className="flex items-start">
            <div className={`mt-1 mr-3 hidden sm:block ${getRecommendationColorClass(recommendation.type)}`}>
              <i className={`fas fa-${getRecommendationIcon(recommendation.type)} text-lg`}></i>
            </div>
            <div className="w-full">
              <div className="flex items-center sm:hidden mb-2">
                <i className={`fas fa-${getRecommendationIcon(recommendation.type)} ${getRecommendationColorClass(recommendation.type)} mr-2`}></i>
                <h3 className="font-medium">{recommendation.title}</h3>
              </div>
              <h3 className="font-medium hidden sm:block">{recommendation.title}</h3>
              <p className="text-sm text-slate-600 mt-1">{recommendation.description}</p>
              <ul className="list-disc ml-6 mt-2 text-sm text-slate-600 space-y-2">
                {recommendation.items.map((item, i) => (
                  <li key={i} className="break-words" dangerouslySetInnerHTML={{ 
                    __html: item.replace(/<([^>]+)>/g, '<code class="text-xs bg-slate-100 px-1 py-0.5 rounded break-all">$1</code>') 
                  }} />
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default RecommendationsSummary;
