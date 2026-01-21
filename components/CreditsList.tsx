import React from 'react';
import { PortfolioItem } from '../constants';

interface CreditsListProps {
  items: PortfolioItem[];
  showLabels?: boolean;
}

export const CreditsList: React.FC<CreditsListProps> = ({ items, showLabels = true }) => {
  return (
    <div className="flex flex-col gap-y-4 w-full text-xs md:text-sm leading-snug tracking-tight">
      {items.map((item, index) => (
        <div key={index} className="flex flex-col">
          {/* Label Row */}
          {showLabels && (
            <div className="mb-1">
              <span className="opacity-60">{item.label}</span>
            </div>
          )}
          
          {/* Value Row */}
          <div>
            <span className="opacity-90">{item.value}</span>
          </div>
        </div>
      ))}
    </div>
  );
};