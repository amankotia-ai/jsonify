# JSON Canvas

A modern JSON visualization tool with an elegant monotone interface that transforms structured data into interactive node diagrams and includes a powerful API testing interface.

![JSON Canvas Screenshot](https://i.ibb.co/gLy0GTRP/JSONcanvas.png)

## Features

- **Interactive Visualization:** View your data as an interactive node diagram
- **Real-time Sync:** See your changes reflected instantly in the visualization
- **Code Editor:** Feature-rich editor with syntax highlighting
- **Example Data:** Generate example data with one click
- **API Testing:** Built-in API request interface with support for various HTTP methods
- **Authorization Support:** Multiple auth types including Bearer Token, Basic Auth, API Key, and OAuth 2.0
- **API Response Visualization:** Automatically visualize API responses as interactive diagrams
- **Import/Export:** Import API configurations from files and export results
- **Responsive Design:** Works on both desktop and mobile devices
- **Keyboard Shortcuts:** Format data using Cmd+Shift+F (Mac) or Ctrl+Shift+F (Windows/Linux)
- **Elegant Monotone Interface:** Clean, focused design with a cohesive color palette

## Color Palette

JSON Canvas uses a carefully selected monotone color palette:

- Primary: `#364CD5` - Primary accent color for important elements
- Secondary: `#FFFBF5` - Background color for a clean, distraction-free experience
- Accent1: `#5067F5` - Complementary shade for creating contrast with primary elements
- Accent2: `#879AF8` - Light accent color for subtle highlights and interactive elements

## Use Cases

- Visualize complex data structures
- Debug JSON configurations
- Test and explore API endpoints
- Analyze API responses
- Teaching data structures and API interactions
- Documentation of data models
- Presentation of hierarchical data

## Technologies Used

- React
- TypeScript
- ReactFlow for visualizations
- CodeMirror for the editor
- TailwindCSS for styling
- Zustand for state management
- Framer Motion for animations
- Vite for development and building

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/amankotia-ai/json-canvas.git
cd json-canvas

# Install dependencies
npm install

# Start the development server
npm run dev
```

## Usage

1. Enter or paste your JSON data in the editor panel
2. Format your code with the format button or using keyboard shortcuts
3. Explore the visualization by panning and zooming
4. Toggle the editor panel on mobile by clicking the side menu button

### API Testing

1. Click on the API Request button to open the API panel
2. Enter your API endpoint URL and select the HTTP method
3. Configure headers, authorization, and request body as needed
4. Send the request and view the response as formatted JSON
5. The response will automatically be visualized in the node diagram

## Design Principles

JSON Canvas follows these design principles:

- **Minimalism:** Clean interface that focuses attention on your data
- **Coherence:** Consistent monotone color scheme across all elements
- **Clarity:** Clear visual hierarchy with thoughtful use of contrast
- **Focus:** Reduced visual noise to help you concentrate on what matters

## Future Enhancements

- Export visualizations as images
- Custom themes beyond the monotone palette
- Save and share visualizations
- Advanced layout options
- Search functionality
- Webhooks testing
- GraphQL support
- API collection management

## License

MIT

## Author

Abhishek Mankotia 
