// Define color constants for the application
export const COLORS = {
  ROOT: {
    BG: 'rgb(249, 250, 251)',
    BORDER: 'rgb(229, 231, 235)',
  },
  OBJECT: {
    BG: 'rgb(240, 253, 244)',    // Light green
    BORDER: 'rgb(220, 252, 231)', // Green border
    TITLE: 'rgb(22, 163, 74)',    // Green text
  },
  ARRAY: {
    BG: 'rgb(254, 242, 242)',    // Light red
    BORDER: 'rgb(254, 226, 226)', // Red border
    TITLE: 'rgb(220, 38, 38)',    // Red text
  },
  PROPERTY: {
    KEY: 'rgb(37, 99, 235)',     // Blue for property keys
    VALUE: 'rgb(55, 65, 81)',    // Gray for values
  },
  EDGE: {
    LINE: 'rgb(203, 213, 225)',  // Light gray for connections
  },
} as const;