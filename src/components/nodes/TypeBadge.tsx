import React from 'react';

type BadgeType = 'string' | 'number' | 'boolean' | 'array' | 'object' | 'null' | 'undefined';

interface TypeBadgeProps {
    type: string;
}

export const TypeBadge: React.FC<TypeBadgeProps> = ({ type }) => {
    const getBadgeConfig = (type: string) => {
        switch (type) {
            case 'string':
                return { label: 'TXT', className: 'bg-emerald-100 text-emerald-700 border-emerald-200' };
            case 'number':
                return { label: 'NUM', className: 'bg-amber-100 text-amber-700 border-amber-200' };
            case 'boolean':
                return { label: 'BOOL', className: 'bg-violet-100 text-violet-700 border-violet-200' };
            case 'array':
                return { label: 'ARR', className: 'bg-blue-100 text-blue-700 border-blue-200' };
            case 'object':
                return { label: 'OBJ', className: 'bg-indigo-100 text-indigo-700 border-indigo-200' };
            case 'null':
                return { label: 'NULL', className: 'bg-gray-100 text-gray-600 border-gray-200' };
            default:
                return { label: 'UNK', className: 'bg-gray-100 text-gray-600 border-gray-200' };
        }
    };

    const config = getBadgeConfig(type);

    return (
        <span className={`
      text-[9px] font-bold px-1 py-0.5 rounded border 
      tracking-wider uppercase select-none mr-2
      ${config.className}
    `}>
            {config.label}
        </span>
    );
};
