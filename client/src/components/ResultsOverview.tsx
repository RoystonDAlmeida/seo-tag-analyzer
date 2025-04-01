import { FC } from 'react';
import { SeoAnalysisResult } from '@shared/schema';

interface ResultsOverviewProps {
  result: SeoAnalysisResult;
}

const ResultsOverview: FC<ResultsOverviewProps> = ({ result }) => {
  return (
    <section className="mb-8 bg-white rounded-lg shadow-md p-4 sm:p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h2 className="text-xl font-semibold">SEO Analysis Results</h2>
          <p className="text-slate-500 text-sm mt-1 break-all">{result.url}</p>
        </div>
        <div className="mt-4 md:mt-0 flex flex-col items-center">
          <span className="text-sm font-medium text-slate-500 mb-1">Overall Score</span>
          <div className="flex items-center justify-center">
            <div className="w-20 h-20 relative">
              {/* Circular progress visualization */}
              <svg className="w-full h-full" viewBox="0 0 36 36">
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
                  stroke="#0066cc"
                  strokeWidth="3"
                  strokeDasharray={`${result.score}, 100`}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl font-bold text-primary">{result.score}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-slate-50 p-4 rounded-lg">
          <div className="flex items-center">
            <i className="fas fa-check-circle text-success mr-2 text-lg"></i>
            <h3 className="font-medium">{result.presentCount} Tags Present</h3>
          </div>
          <p className="text-sm text-slate-500 mt-1">Basic SEO tags are implemented</p>
        </div>
        <div className="bg-slate-50 p-4 rounded-lg">
          <div className="flex items-center">
            <i className="fas fa-exclamation-circle text-warning mr-2 text-lg"></i>
            <h3 className="font-medium">{result.improveCount} Tags Need Improvement</h3>
          </div>
          <p className="text-sm text-slate-500 mt-1">Some tags could be optimized</p>
        </div>
        <div className="bg-slate-50 p-4 rounded-lg">
          <div className="flex items-center">
            <i className="fas fa-times-circle text-danger mr-2 text-lg"></i>
            <h3 className="font-medium">{result.missingCount} Tags Missing</h3>
          </div>
          <p className="text-sm text-slate-500 mt-1">Critical tags that should be added</p>
        </div>
      </div>
    </section>
  );
};

export default ResultsOverview;
