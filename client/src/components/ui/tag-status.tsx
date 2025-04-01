import { FC } from 'react';
import { MetaTagStatus } from '@shared/schema';
import { getStatusColorClass, getStatusIcon } from '@/lib/seoHelper';

interface TagStatusProps {
  status: MetaTagStatus;
  statusText: string;
}

const TagStatus: FC<TagStatusProps> = ({ status, statusText }) => {
  const colorClass = getStatusColorClass(status);
  const icon = getStatusIcon(status);

  return (
    <span className={`${colorClass} flex items-center px-2 py-1 rounded-full text-sm whitespace-nowrap bg-white shadow-sm`}>
      <i className={`fas fa-${icon} mr-1.5`}></i>
      <span>{statusText}</span>
    </span>
  );
};

export default TagStatus;
