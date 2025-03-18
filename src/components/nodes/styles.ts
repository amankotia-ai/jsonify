import { COLORS, SPACING } from '../../utils/layout/constants';

export const nodeStyles = {
  base: `
    rounded-lg shadow-sm border
    transition-all duration-200
    min-w-[${SPACING.NODE_WIDTH}px]
  `,
  root: {
    wrapper: `
      bg-${COLORS.ROOT.BG}
      border-${COLORS.ROOT.BORDER}
      p-${SPACING.NODE_PADDING}px
    `,
    item: `
      flex items-center justify-between
      py-1 px-2 rounded
      hover:bg-gray-100
    `,
    count: 'text-gray-500 text-sm',
  },
  object: {
    wrapper: (isArray: boolean) => `
      ${isArray ? `bg-${COLORS.ARRAY.BG} border-${COLORS.ARRAY.BORDER}` 
                : `bg-${COLORS.OBJECT.BG} border-${COLORS.OBJECT.BORDER}`}
      p-${SPACING.NODE_PADDING}px
    `,
    header: 'flex items-center gap-2 mb-2',
    title: (isArray: boolean) => `
      font-medium
      ${isArray ? `text-${COLORS.ARRAY.TITLE}` : `text-${COLORS.OBJECT.TITLE}`}
    `,
  },
  property: {
    wrapper: 'py-1',
    key: `text-${COLORS.PROPERTY.KEY} font-medium`,
    value: `text-${COLORS.PROPERTY.VALUE}`,
  },
  handle: {
    base: 'w-2 h-2 bg-gray-400 rounded-full',
    left: '-left-1',
    right: '-right-1',
  },
} as const;

export const edgeStyles = {
  path: {
    stroke: COLORS.EDGE.LINE,
    strokeWidth: 1.5,
    strokeDasharray: '5,5',
  },
};