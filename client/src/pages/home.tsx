import { FC, useState } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import URLInput from '@/components/URLInput';
import SEODashboard from '@/components/SEODashboard';
import VisualRecommendations from '@/components/VisualRecommendations';
import { SeoAnalysisResult } from '@shared/schema';

const Home: FC = () => {
  const [analysisResult, setAnalysisResult] = useState<SeoAnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [activeView, setActiveView] = useState<'dashboard' | 'recommendations'>('dashboard');

  const handleAnalysisComplete = (result: SeoAnalysisResult) => {
    setAnalysisResult(result);
    setActiveView('dashboard'); // Switch to dashboard when new analysis is complete
  };

  return (
    <div className="bg-slate-50 text-slate-800 font-sans min-h-screen">
      <Header />
      
      <main className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <URLInput onAnalysisComplete={handleAnalysisComplete} setIsLoading={setIsLoading} />
        
        {isLoading && (
          <div className="flex justify-center my-12 sm:my-16">
            <div className="flex flex-col items-center">
              <div className="text-primary animate-spin mb-4">
                <i className="fas fa-circle-notch text-4xl"></i>
              </div>
              <p className="text-slate-600">Analyzing SEO tags...</p>
            </div>
          </div>
        )}
        
        {!isLoading && analysisResult && (
          <div className="mt-8">
            {/* Simple tab navigation instead of using Radix UI Tabs */}
            <div className="mb-6 border-b border-slate-200">
              <div className="flex">
                <button
                  onClick={() => setActiveView('dashboard')}
                  className={`px-4 py-2 font-medium ${
                    activeView === 'dashboard'
                      ? 'border-b-2 border-primary text-primary'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <i className="fas fa-chart-pie mr-2"></i>
                  Dashboard
                </button>
                <button
                  onClick={() => setActiveView('recommendations')}
                  className={`px-4 py-2 font-medium ${
                    activeView === 'recommendations'
                      ? 'border-b-2 border-primary text-primary'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <i className="fas fa-lightbulb mr-2"></i>
                  Recommendations
                  {analysisResult.recommendations.length > 0 && (
                    <span className="ml-2 bg-primary/20 text-primary rounded-full text-xs px-2 py-0.5">
                      {analysisResult.recommendations.length}
                    </span>
                  )}
                </button>
              </div>
            </div>
            
            {/* Content based on active view */}
            {activeView === 'dashboard' && (
              <SEODashboard result={analysisResult} />
            )}
            
            {activeView === 'recommendations' && (
              <VisualRecommendations recommendations={analysisResult.recommendations} />
            )}
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default Home;
