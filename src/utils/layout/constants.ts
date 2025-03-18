export const SPACING = {
  VERTICAL: 180,      // Reduced vertical spacing between nodes
  HORIZONTAL: 380,    // Reduced horizontal spacing
  NODE_PADDING: 16,   // Internal node padding
  NODE_WIDTH: 320,    // Fixed node width
  LEVEL_INDENT: 100,  // Indentation for nested levels
  MIN_NODE_HEIGHT: 100, // Minimum height for a node
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