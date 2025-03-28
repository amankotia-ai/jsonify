export const SPACING = {
  VERTICAL: 160,      // Increased vertical spacing between nodes
  HORIZONTAL: 600,    // Increased horizontal spacing for wider multi-column nodes
  NODE_PADDING: 16,   // Internal node padding
  NODE_WIDTH: 320,    // Base node width (single column)
  MULTI_COLUMN_WIDTH: {
    TWO_COLUMNS: 600, // Width for two-column nodes
    THREE_COLUMNS: 880, // Width for three-column nodes
  },
  LEVEL_INDENT: 100,  // Indentation for nested levels
  MIN_NODE_HEIGHT: 80, // Reduced minimum height for a node
  VERTICAL_GAP: 60,   // Increased gap between sibling nodes
  NODE_MARGIN: 30,    // Increased margin around nodes
} as const;

export const COLORS = {
  BACKGROUND: 'rgb(243, 244, 246)',  // gray-100
  NODE: {
    BG: 'rgb(255, 255, 255)',       // white
    BORDER: 'rgb(229, 231, 235)',   // gray-200
    HOVER: 'rgb(243, 244, 246)',    // gray-100
  },
  TEXT: {
    PRIMARY: 'rgb(31, 41, 55)',     // gray-800
    SECONDARY: 'rgb(107, 114, 128)', // gray-500
    ACCENT: 'rgb(59, 130, 246)',    // blue-500
  },
  EDGE: {
    LINE: 'rgb(148, 163, 184)',     // gray-400
  }
} as const;