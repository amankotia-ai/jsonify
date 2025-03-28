import { SPACING } from '../../utils/layout/constants';

export const nodeStyles = {
  base: `
    rounded-lg shadow-sm border
    transition-all duration-200
    min-w-[${SPACING.NODE_WIDTH}px]
  `,
  root: {
    wrapper: `
      bg-[#F4F6FF]
      border-accent2/30
      p-${SPACING.NODE_PADDING}px
    `,
    item: `
      flex items-center justify-between
      py-1 px-2 rounded
      hover:bg-primary/5
    `,
    count: 'text-accent1 text-sm',
  },
  object: {
    wrapper: (isArray: boolean) => `
      bg-[#F4F6FF] border-accent2/30
      p-${SPACING.NODE_PADDING}px
    `,
    header: 'flex items-center gap-2 mb-2',
    title: (isArray: boolean) => `
      font-medium
      text-primary
    `,
  },
  property: {
    wrapper: 'py-1',
    key: 'text-primary font-medium',
    value: 'text-accent1',
  },
  handle: {
    base: 'w-2 h-2 bg-primary/70 rounded-full',
    left: '-left-1',
    right: '-right-1',
  },
} as const;

export const edgeStyles = {
  path: {
    stroke: '#879AF8',
    strokeWidth: 1.5,
    strokeDasharray: '5,5',
  },
};