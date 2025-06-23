# Contentstack Viewer with Visual Builder

A React application that displays Contentstack entries with multi-view support and integrated Visual Builder for live editing.

## Features

- **Multi-View Display**: Web, Mobile, Agentforce (JSON), and RAG (Natural Language) views
- **Visual Builder Integration**: Live editing capabilities with Contentstack's Visual Builder
- **Live Preview**: Real-time content updates as you edit in Contentstack
- **Modular Blocks Support**: Displays content blocks with proper edit tags
- **Hero Fragment Support**: Special handling for hero components

## Visual Builder Integration

This app includes full Visual Builder integration based on [Contentstack's documentation](https://www.contentstack.com/docs/developers/set-up-visual-builder/set-up-visual-builder-for-your-website):

### What's Included:

1. **Live Preview Utils SDK**: Enables real-time content editing
2. **Edit Tags (data-cslp)**: Makes content editable in Visual Builder
3. **Contentstack SDK**: Replaces direct API calls for better integration
4. **Live Preview Configuration**: Configured for AWS NA region

### How to Use Visual Builder:

1. **Start the Development Server**:
   ```bash
   npm start
   ```

2. **Access Visual Builder**:
   - Go to your Contentstack dashboard
   - Navigate to Visual Builder
   - Add your development URL (typically `http://localhost:3000`)

3. **Live Editing**:
   - Edit content in Visual Builder
   - See changes reflected in real-time
   - Edit button appears in top-right corner for quick editing

### Configuration Details:

- **Region**: AWS NA (`rest-preview.contentstack.com`)
- **Mode**: Client-Side Rendering (CSR)
- **Edit Button**: Enabled in top-right position
- **Live Preview**: Enabled with real-time updates

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- A Contentstack account with a configured stack

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Update the Contentstack configuration in `src/App.js`:
   ```javascript
   const stackConfig = {
     api_key: 'your-api-key',
     delivery_token: 'your-delivery-token',
     environment: 'your-environment',
     region: 'us' // or your region
   };
   ```

4. Start the development server:
   ```bash
   npm start
   ```

### Visual Builder Setup

1. **Prerequisites**: Ensure your Contentstack stack has:
   - Content type: `page`
   - Modular blocks field: `blocks`
   - Referenced content types for blocks

2. **Configure Visual Builder**:
   - In Contentstack, go to Visual Builder
   - Add your development URL
   - Configure the stack settings

3. **Edit Content**:
   - Use the edit button (top-right corner)
   - Edit content directly in Visual Builder
   - Changes appear instantly in your app

## Content Structure

The app expects the following content structure:

- **Content Type**: `page`
- **Fields**:
  - `title` (text)
  - `blocks` (modular blocks)
  - `headline` (text, for hero fragments)
  - `button_text` or `cta_text` (text)

### Supported Block Types:

- **Hero Fragments**: Special hero components with background images
- **Standard Blocks**: Text and image blocks with configurable layout
- **Custom Blocks**: Extensible for additional block types

## Views Explained

1. **Web View**: Desktop-optimized display of content blocks
2. **Mobile View**: Mobile-responsive preview with phone frame
3. **Agentforce View**: Raw JSON representation for API analysis
4. **RAG View**: Natural language interpretation of content

## Technologies Used

- React 19.1.0
- Contentstack SDK 3.25.3
- Live Preview Utils SDK 3.2.4
- Tailwind CSS 3.4.17
- PostCSS & Autoprefixer

## Development

### Available Scripts

- `npm start`: Runs the app in development mode
- `npm build`: Builds the app for production
- `npm test`: Runs the test suite
- `npm eject`: Ejects from Create React App (one-way operation)

### Visual Builder Development

When developing with Visual Builder:

1. Ensure your development server is running
2. Add edit tags to new components: `{...(entry.$?.fieldName ?? {})}`
3. Test live editing functionality
4. Use browser console to debug Live Preview events

## Troubleshooting

### Common Issues:

1. **Visual Builder not connecting**: Check your stack configuration and ensure the development URL is correct
2. **Edit tags not working**: Verify field names match your Contentstack schema
3. **Live Preview not updating**: Check console for errors and ensure proper SDK initialization

### Debug Mode:

Enable debug mode in the Live Preview configuration:
```javascript
ContentstackLivePreview.init({
  // ... other config
  debug: true
});
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is open source and available under the [MIT License](LICENSE).

## Support

For issues related to:
- **Contentstack**: Check [Contentstack Documentation](https://www.contentstack.com/docs/)
- **Visual Builder**: See [Visual Builder Setup Guide](https://www.contentstack.com/docs/developers/set-up-visual-builder/set-up-visual-builder-for-your-website)
- **Live Preview**: Review [Live Preview Documentation](https://www.contentstack.com/academy/learning-paths/contentstack-developer-certification/implementing-live-preview/live-preview-rest-delivery-sdk)
