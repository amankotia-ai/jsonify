export const exportFlowAsSvg = () => {
  // Get the flow container
  const flowElement = document.querySelector('.react-flow') as HTMLElement;
  if (!flowElement) return;

  // Get the viewport and nodes
  const viewport = flowElement.querySelector('.react-flow__viewport') as HTMLElement;
  const nodesElement = flowElement.querySelector('.react-flow__nodes') as HTMLElement;
  if (!viewport || !nodesElement) return;

  // Create a new SVG element
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  
  // Get the bounding box of all nodes
  const nodeElements = Array.from(nodesElement.children);
  const bounds = nodeElements.reduce((acc, node) => {
    const rect = node.getBoundingClientRect();
    return {
      left: Math.min(acc.left, rect.left),
      top: Math.min(acc.top, rect.top),
      right: Math.max(acc.right, rect.right),
      bottom: Math.max(acc.bottom, rect.bottom),
    };
  }, {
    left: Infinity,
    top: Infinity,
    right: -Infinity,
    bottom: -Infinity,
  });

  // Add padding
  const padding = 40;
  const width = bounds.right - bounds.left + (padding * 2);
  const height = bounds.bottom - bounds.top + (padding * 2);

  // Set SVG attributes
  svg.setAttribute('width', String(width));
  svg.setAttribute('height', String(height));
  svg.setAttribute('viewBox', `0 0 ${width} ${height}`);

  // Clone the viewport content
  const viewportClone = viewport.cloneNode(true) as HTMLElement;
  
  // Remove background and controls
  const elementsToRemove = viewportClone.querySelectorAll(
    '.react-flow__background, .react-flow__controls, .react-flow__minimap'
  );
  elementsToRemove.forEach(el => el.remove());

  // Adjust transform to center content
  const transform = viewportClone.style.transform;
  const matches = transform.match(/translate\((.*?)\) scale\((.*?)\)/);
  if (matches) {
    const [, translate, scale] = matches;
    const [tx, ty] = translate.split(',').map(Number);
    
    // Calculate new transform to center the content
    const newTx = -bounds.left + padding;
    const newTy = -bounds.top + padding;
    viewportClone.style.transform = `translate(${newTx}px, ${newTy}px) scale(${scale})`;
  }

  // Convert the viewport clone to SVG string
  const foreignObject = document.createElementNS('http://www.w3.org/2000/svg', 'foreignObject');
  foreignObject.setAttribute('width', String(width));
  foreignObject.setAttribute('height', String(height));
  foreignObject.appendChild(viewportClone);
  svg.appendChild(foreignObject);

  // Convert to string with proper XML declaration
  const svgString = '<?xml version="1.0" encoding="UTF-8"?>\n' +
    new XMLSerializer().serializeToString(svg);

  // Create and trigger download
  const blob = new Blob([svgString], { type: 'image/svg+xml' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'flow-diagram.svg';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};