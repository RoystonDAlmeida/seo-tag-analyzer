import { FC } from 'react';
import { SeoAnalysisSection } from '@shared/schema';
import { getStatusBgClass } from '@/lib/seoHelper';
import TagStatus from './ui/tag-status';
import ToggleSection from './ui/toggle-section';

interface SocialMediaTagsProps {
  section: SeoAnalysisSection;
}

const SocialMediaTags: FC<SocialMediaTagsProps> = ({ section }) => {
  // Group tags by platform (Facebook/Open Graph and Twitter)
  const openGraphTags = section.tags.filter(tag => 
    tag.type.toString().startsWith('og') || 
    ['ogTitle', 'ogDescription', 'ogImage', 'ogUrl', 'ogType', 'ogSiteName'].includes(tag.type.toString())
  );
  
  const twitterTags = section.tags.filter(tag => 
    tag.type.toString().startsWith('twitter') || 
    ['twitterCard', 'twitterTitle', 'twitterDescription', 'twitterImage', 'twitterSite', 'twitterCreator'].includes(tag.type.toString())
  );

  return (
    <section className="bg-white rounded-lg shadow-md p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <h2 className="text-lg font-semibold mb-2 sm:mb-0">
          <i className={`fas fa-${section.icon} text-primary mr-2`}></i>
          {section.title}
        </h2>
        <span className={`text-sm px-3 py-1 ${getStatusBgClass(section.status)} rounded-full self-start sm:self-auto`}>
          {section.statusText}
        </span>
      </div>

      {/* OpenGraph Section */}
      <div className="mb-8">
        <div className="flex items-center mb-4">
          <i className="fab fa-facebook text-[#3b5998] mr-2"></i>
          <h3 className="font-medium">OpenGraph Tags (Facebook, LinkedIn)</h3>
        </div>

        {openGraphTags.map((tag, index) => (
          <div key={tag.type} className={`mb-6 ${index < openGraphTags.length - 1 ? 'border-b border-slate-100 pb-6' : ''}`}>
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-2">
              <div className="mb-2 sm:mb-0">
                <h4 className="font-medium">{tag.name}</h4>
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
                No {tag.name} tag found
              </div>
            )}
            
            {tag.bestPractices && tag.status !== 'optimal' && (
              <ToggleSection title="View best practices" id={`${tag.type}-details`}>
                <h4 className="font-medium mb-2">Best Practices:</h4>
                <ul className="list-disc pl-5 space-y-1">
                  {tag.bestPractices.map((practice, i) => (
                    <li key={i}>{practice}</li>
                  ))}
                </ul>
                {tag.recommendation && (
                  <div className="mt-2 p-3 bg-white rounded-md border border-primary/30">
                    <h5 className="font-medium text-primary mb-1">Suggested Implementation:</h5>
                    <code className="text-slate-700 break-words">{tag.recommendation}</code>
                  </div>
                )}
              </ToggleSection>
            )}
          </div>
        ))}
      </div>

      {/* Twitter Card Section */}
      <div>
        <div className="flex items-center mb-4">
          <i className="fab fa-twitter text-[#1da1f2] mr-2"></i>
          <h3 className="font-medium">Twitter Card Tags</h3>
        </div>

        {twitterTags.map((tag, index) => (
          <div key={tag.type} className={`mb-6 ${index < twitterTags.length - 1 ? 'border-b border-slate-100 pb-6' : ''}`}>
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-2">
              <div className="mb-2 sm:mb-0">
                <h4 className="font-medium">{tag.name}</h4>
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
                No {tag.name} tag found
              </div>
            )}
            
            {tag.bestPractices && (
              <ToggleSection title="View best practices" id={`${tag.type}-details`}>
                <h4 className="font-medium mb-2">Best Practices:</h4>
                <ul className="list-disc pl-5 space-y-1">
                  {tag.bestPractices.map((practice, i) => (
                    <li key={i}>{practice}</li>
                  ))}
                </ul>
                {tag.status === 'missing' && tag.type === 'twitterImage' && (
                  <div className="mt-3 p-3 bg-danger/10 rounded-md">
                    <p className="text-sm text-danger/80">
                      <i className="fas fa-exclamation-triangle mr-1"></i>
                      <strong>Critical:</strong> Twitter cards require an image to display properly.
                    </p>
                  </div>
                )}
                {tag.recommendation && (
                  <div className="mt-2 p-3 bg-white rounded-md border border-primary/30">
                    <h5 className="font-medium text-primary mb-1">
                      {tag.status === 'improve' ? 'Suggested Improvement:' : 'Suggested Implementation:'}
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

export default SocialMediaTags;
