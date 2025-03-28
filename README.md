# Jsonify

A modern JSON and YAML visualization tool that transforms structured data into interactive node diagrams and includes a powerful API testing interface.

![Jsonify Screenshot](https://i.ibb.co/gLy0GTRP/JSONcanvas.png)

## Features

- **Dual Format Support:** Edit and visualize both JSON and YAML data formats
- **Interactive Visualization:** View your data as an interactive node diagram
- **Real-time Sync:** See your changes reflected instantly in the visualization
- **Code Editor:** Feature-rich editor with syntax highlighting
- **Format Conversion:** Easily switch between JSON and YAML formats
- **Example Data:** Generate example data with one click
- **API Testing:** Built-in API request interface with support for various HTTP methods
- **Authorization Support:** Multiple auth types including Bearer Token, Basic Auth, API Key, and OAuth 2.0
- **API Response Visualization:** Automatically visualize API responses as interactive diagrams
- **Import/Export:** Import API configurations from files and export results
- **Responsive Design:** Works on both desktop and mobile devices
- **Keyboard Shortcuts:** Format data using Cmd+Shift+F (Mac) or Ctrl+Shift+F (Windows/Linux)

## Use Cases

- Visualize complex data structures
- Debug JSON/YAML configurations
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
git clone https://github.com/amankotia-ai/jsonify.git
cd jsonify

# Install dependencies
npm install

# Start the development server
npm run dev
```

## Usage

1. Enter or paste your JSON/YAML data in the editor panel
2. Switch between formats using the dropdown
3. Format your code with the format button or using keyboard shortcuts
4. Explore the visualization by panning and zooming
5. Toggle the editor panel on mobile by clicking the side menu button

### API Testing

1. Click on the API Request button to open the API panel
2. Enter your API endpoint URL and select the HTTP method
3. Configure headers, authorization, and request body as needed
4. Send the request and view the response as formatted JSON
5. The response will automatically be visualized in the node diagram

## Future Enhancements

- Export visualizations as images
- Custom themes
- Save and share visualizations
- Additional data format support
- Advanced layout options
- Search functionality
- Webhooks testing
- GraphQL support
- API collection management

## License

MIT

## Author

Abhishek Mankotia 
