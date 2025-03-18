import { COLORS } from './colors';
import { SPACING } from './spacing';

// Get background color based on node type
export const getNodeBackground = (isArray: boolean): string => 
  isArray ? COLORS.ARRAY.BG : COLORS.OBJECT.BG;

// Get border color based on node type
export const getNodeBorder = (isArray: boolean): string =>
  isArray ? COLORS.ARRAY.BORDER : COLORS.OBJECT.BORDER;

// Get title color based on node type
export const getNodeTitle = (isArray: boolean): string =>
  isArray ? COLORS.ARRAY.TITLE : COLORS.OBJECT.TITLE;

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
    wrapper: 'p-4',
    header: 'flex items-center gap-2 mb-2',
    title: 'font-medium',
  },
  property: {
    wrapper: 'py-1',
    key: `text-${COLORS.PROPERTY.KEY} font-medium`,
    value: `text-${COLORS.PROPERTY.VALUE}`,
    content: 'flex items-center gap-2',
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