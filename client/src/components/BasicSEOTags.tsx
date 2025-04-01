import { FC } from 'react';
import { MetaTag, SeoAnalysisSection } from '@shared/schema';
import { getStatusBgClass } from '@/lib/seoHelper';
import TagStatus from './ui/tag-status';
import ToggleSection from './ui/toggle-section';

interface BasicSEOTagsProps {
  section: SeoAnalysisSection;
}

const BasicSEOTags: FC<BasicSEOTagsProps> = ({ section }) => {
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

      {section.tags.map((tag, index) => (
        <div key={tag.type} className={`mb-6 ${index < section.tags.length - 1 ? 'border-b border-slate-100 pb-6' : ''}`}>
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
              No {tag.name} found
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
              {tag.recommendation && (
                <p className={`mt-2 ${tag.status === 'missing' ? 'text-danger' : 'text-warning'} font-medium`}>
                  Recommendation: {tag.recommendation}
                </p>
              )}
              {tag.status === 'missing' && tag.recommendation && (
                <div className="mt-2 p-3 bg-white rounded-md border border-primary/30">
                  <h5 className="font-medium text-primary mb-1">Suggested Implementation:</h5>
                  <code className="text-slate-700 break-words">{tag.recommendation}</code>
                </div>
              )}
            </ToggleSection>
          )}
        </div>
      ))}
    </section>
  );
};

export default BasicSEOTags;
