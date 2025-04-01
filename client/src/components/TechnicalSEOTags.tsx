import { FC } from 'react';
import { SeoAnalysisSection } from '@shared/schema';
import { getStatusBgClass } from '@/lib/seoHelper';
import TagStatus from './ui/tag-status';
import ToggleSection from './ui/toggle-section';

interface TechnicalSEOTagsProps {
  section: SeoAnalysisSection;
}

const TechnicalSEOTags: FC<TechnicalSEOTagsProps> = ({ section }) => {
  // Create pairs of tags for side-by-side display
  const createPairs = () => {
    const result = [];
    for (let i = 0; i < section.tags.length; i += 2) {
      result.push(section.tags.slice(i, i + 2));
    }
    return result;
  };

  const tagPairs = createPairs();

  return (
    <section className="mt-6 sm:mt-8 bg-white rounded-lg shadow-md p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6">
        <h2 className="text-lg font-semibold mb-2 sm:mb-0">
          <i className={`fas fa-${section.icon} text-primary mr-2`}></i>
          {section.title}
        </h2>
        <span className={`text-sm px-3 py-1 ${getStatusBgClass(section.status)} rounded-full self-start sm:self-auto`}>
          {section.statusText}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {section.tags.map((tag, index) => (
          <div 
            key={tag.type} 
            className={`pb-6 ${index < section.tags.length - 1 ? 'border-b border-slate-100' : ''} ${index % 2 === 0 && index < section.tags.length - 1 ? 'lg:border-b-0 lg:border-r lg:pr-6' : ''}`}
          >
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-2">
              <div className="mb-2 sm:mb-0">
                <h3 className="font-medium">{tag.name}</h3>
                <p className="text-sm text-slate-500">{tag.description}</p>
              </div>
              <TagStatus status={tag.status} statusText={tag.statusText} />
            </div>
            
            {tag.content ? (
              <div className="bg-slate-50 p-3 rounded-md font-mono text-sm mt-3 overflow-x-auto code-scrollbar">
                <code className="break-words">{tag.content}</code>
              </div>
            ) : (
              <div className="bg-slate-50 p-3 rounded-md text-sm mt-3 text-slate-500 italic">
                {tag.status === 'notApplicable' 
                  ? `No ${tag.name} found (may not be needed for single-language sites)`
                  : `No ${tag.name} found`
                }
              </div>
            )}
            
            {tag.bestPractices && tag.status !== 'optimal' && tag.status !== 'notApplicable' && (
              <ToggleSection 
                title={tag.type === 'schema' ? 'View improvement suggestions' : (tag.type === 'openSearch' ? 'View implementation guide' : 'View best practices')} 
                id={`${tag.type}-details`}
              >
                {tag.type === 'openSearch' ? (
                  <>
                    <p className="mb-2">Implementation steps:</p>
                    <ol className="list-decimal pl-5 space-y-1">
                      <li>Create an XML file with search parameters</li>
                      <li>Link to it from your HTML</li>
                    </ol>
                  </>
                ) : tag.type === 'schema' ? (
                  <>
                    <p className="mb-2">Consider adding these additional properties:</p>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>description</li>
                      <li>applicationCategory</li>
                      <li>offers</li>
                      <li>screenshot</li>
                      <li>author/creator</li>
                    </ul>
                  </>
                ) : (
                  <>
                    <h4 className="font-medium mb-2">Best Practices:</h4>
                    <ul className="list-disc pl-5 space-y-1">
                      {tag.bestPractices.map((practice, i) => (
                        <li key={i}>{practice}</li>
                      ))}
                    </ul>
                  </>
                )}
                
                {tag.recommendation && (
                  <div className="mt-2 p-3 bg-white rounded-md border border-primary/30">
                    <h5 className="font-medium text-primary mb-1">
                      {tag.status === 'missing' ? 'Suggested Implementation:' : 'Suggested Improvement:'}
                    </h5>
                    <code className="text-slate-700 break-words">{tag.recommendation}</code>
                  </div>
                )}
              </ToggleSection>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default TechnicalSEOTags;
