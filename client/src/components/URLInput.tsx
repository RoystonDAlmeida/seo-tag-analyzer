import { FC, useState, useEffect, useRef } from 'react';
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { SeoAnalysisResult } from "@shared/schema";
import { isValidUrl, normalizeUrl } from "@/lib/seoHelper";

interface URLInputProps {
  onAnalysisComplete: (result: SeoAnalysisResult) => void;
  setIsLoading: (loading: boolean) => void;
}

const URLInput: FC<URLInputProps> = ({ onAnalysisComplete, setIsLoading }) => {
  const [url, setUrl] = useState<string>('https://');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    const cursorPosition = e.target.selectionStart;
    
    // Ensure the https:// prefix is always present
    if (!value.startsWith('https://')) {
      value = 'https://' + value.replace(/^https?:\/\//i, '');
    }
    
    setUrl(value);
    if (errorMessage) {
      setErrorMessage('');
    }
    
    // Restore cursor position if possible, accounting for the prefix
    if (inputRef.current && cursorPosition !== null) {
      // Make sure we don't place the cursor within the https:// prefix
      const newPosition = Math.max(8, cursorPosition);
      setTimeout(() => {
        inputRef.current?.setSelectionRange(newPosition, newPosition);
      }, 0);
    }
  };
  
  const handleInputFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    // If the value is just the prefix, place cursor at the end
    if (e.target.value === 'https://') {
      e.target.setSelectionRange(8, 8);
    }
  };
  
  const handleInputClick = (e: React.MouseEvent<HTMLInputElement>) => {
    // If the user clicks within the prefix, move the cursor after it
    const input = e.target as HTMLInputElement;
    const position = input.selectionStart;
    
    if (position !== null && position < 8) {
      e.preventDefault();
      input.setSelectionRange(8, 8);
    }
  };

  const handleAnalyze = async () => {
    // Validate URL
    if (url.trim() === 'https://') {
      setErrorMessage('Please enter a URL');
      return;
    }

    // Validate the URL
    if (!isValidUrl(url)) {
      setErrorMessage('Please enter a valid website address');
      return;
    }

    try {
      setIsLoading(true);
      const response = await apiRequest('POST', '/api/analyze', { url });
      const data = await response.json() as SeoAnalysisResult;
      onAnalysisComplete(data);
    } catch (error) {
      console.error('Error analyzing URL:', error);
      toast({
        title: "Analysis Failed",
        description: error instanceof Error ? error.message : "Failed to analyze website. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="relative mb-6 sm:mb-8">
      <div className="bg-gradient-to-r from-primary/80 to-blue-600/80 text-white rounded-lg shadow-lg p-6 sm:p-8">
        <div className="max-w-3xl mx-auto text-center mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold mb-3">SEO Meta Tag Analyzer</h1>
          <p className="text-white/90">
            Quickly analyze any website's SEO meta tags and get actionable recommendations
          </p>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-md max-w-3xl mx-auto">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-grow">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <i className="fas fa-globe text-slate-400"></i>
                </div>
                <input
                  ref={inputRef}
                  type="text"
                  id="url-input"
                  className="bg-slate-50 border border-slate-200 text-slate-800 text-base rounded-lg focus:ring-primary focus:border-primary block w-full pl-10 p-3"
                  placeholder="Just enter the domain (e.g. example.com)"
                  value={url}
                  onChange={handleUrlChange}
                  onFocus={handleInputFocus}
                  onClick={handleInputClick}
                  onKeyDown={(e) => e.key === 'Enter' && handleAnalyze()}
                />
              </div>
              {errorMessage && (
                <p className="mt-1.5 text-sm text-danger font-medium">{errorMessage}</p>
              )}
            </div>
            <button
              id="analyze-btn"
              className="bg-primary hover:bg-primary/90 text-white font-medium rounded-lg px-5 py-3 text-center flex items-center justify-center transition-colors whitespace-nowrap"
              onClick={handleAnalyze}
            >
              <i className="fas fa-search mr-2"></i>
              <span id="button-text">Analyze Now</span>
            </button>
          </div>
          
          <div className="mt-3 flex flex-wrap gap-2 justify-center text-xs text-slate-500">
            <div className="flex items-center">
              <i className="fas fa-check-circle text-success mr-1"></i>
              <span>Free to use</span>
            </div>
            <div className="flex items-center">
              <i className="fas fa-bolt text-warning mr-1"></i>
              <span>Instant results</span>
            </div>
            <div className="flex items-center">
              <i className="fas fa-lock text-slate-500 mr-1"></i>
              <span>No sign-up required</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-3 text-center text-sm">
        <div className="bg-white rounded-lg p-3 shadow-sm">
          <div className="text-primary text-lg mb-1">
            <i className="fas fa-tags"></i>
          </div>
          <div className="font-medium">Meta Tags</div>
          <div className="text-xs text-slate-500">Title, description & more</div>
        </div>
        <div className="bg-white rounded-lg p-3 shadow-sm">
          <div className="text-primary text-lg mb-1">
            <i className="fas fa-share-alt"></i>
          </div>
          <div className="font-medium">Social Media</div>
          <div className="text-xs text-slate-500">OpenGraph & Twitter Cards</div>
        </div>
        <div className="bg-white rounded-lg p-3 shadow-sm">
          <div className="text-primary text-lg mb-1">
            <i className="fas fa-cogs"></i>
          </div>
          <div className="font-medium">Technical SEO</div>
          <div className="text-xs text-slate-500">Schema, canonical & more</div>
        </div>
        <div className="bg-white rounded-lg p-3 shadow-sm">
          <div className="text-primary text-lg mb-1">
            <i className="fas fa-lightbulb"></i>
          </div>
          <div className="font-medium">Recommendations</div>
          <div className="text-xs text-slate-500">Fix issues & improve SEO</div>
        </div>
      </div>
    </section>
  );
};

export default URLInput;
