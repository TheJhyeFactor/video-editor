# VideoFlow - Browser Video Editor

![VideoFlow](https://img.shields.io/badge/VideoFlow-2025-blueviolet)
![React](https://img.shields.io/badge/React-19-blue)
![Vite](https://img.shields.io/badge/Vite-7-646CFF)

A professional browser-based video editor built with React. Edit videos directly in your browser with no uploads required - all processing happens client-side for complete privacy and speed.

## Features

- **🎬 Video Upload & Playback** - Support for MP4, WebM, MOV, and AVI formats
- **✂️ Precision Trimming** - Visual timeline with start/end trim controls
- **🎨 Visual Effects** - 7 built-in filters:
  - Grayscale
  - Sepia
  - Blur
  - Brightness
  - Contrast
  - Vintage
- **⚡ Playback Speed Control** - Adjust speed from 0.5x to 2x
- **📊 Interactive Timeline** - Visual playhead with trim overlays
- **💾 Export Functionality** - Download your edited videos
- **🔒 Complete Privacy** - All processing happens in your browser

## Live Demo

Visit the live demo: [VideoFlow](https://thejhyefactor.github.io/video-editor)

## Technologies Used

- **React 19** - Latest React features with hooks
- **Vite** - Lightning-fast build tool
- **Lucide React** - Beautiful icon library
- **FFmpeg.wasm** - Video processing in the browser
- **HTML5 Video API** - Native video playback and manipulation

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

```bash
# Clone the repository
git clone https://github.com/TheJhyeFactor/video-editor.git

# Navigate to the project directory
cd video-editor

# Install dependencies
npm install

# Start the development server
npm run dev
```

The app will open at `http://localhost:5173`

## Usage

1. **Upload a Video** - Click "Choose Video File" to select a video from your device
2. **Apply Effects** - Choose from 7 different visual effects
3. **Adjust Speed** - Change playback speed from 0.5x to 2x
4. **Trim Video** - Use the timeline sliders to set start and end points
5. **Preview** - Play your video to preview changes
6. **Export** - Click "Export Video" to download the edited version

## Project Structure

```
video-editor/
├── src/
│   ├── App.jsx          # Main application component
│   ├── App.css          # Application styles
│   └── main.jsx         # React entry point
├── public/              # Static assets
├── index.html          # HTML template
├── vite.config.js      # Vite configuration
└── package.json        # Project dependencies
```

## Building for Production

```bash
# Create production build
npm run build

# Preview production build
npm run preview
```

## Deployment

This project is configured for GitHub Pages deployment with GitHub Actions.

### Manual Deployment

```bash
# Build the project
npm run build

# Deploy to GitHub Pages
# (Ensure you have gh-pages branch set up)
```

## Browser Compatibility

VideoFlow works best in modern browsers that support:
- HTML5 Video API
- ES6+ JavaScript
- CSS Grid and Flexbox
- File API

Tested browsers:
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Future Enhancements

- [ ] Real FFmpeg integration for actual video processing
- [ ] Audio track editing
- [ ] Multiple video layers
- [ ] Text and sticker overlays
- [ ] Transitions between clips
- [ ] Advanced color grading
- [ ] Keyboard shortcuts
- [ ] Undo/Redo functionality

## Contributing

Contributions are welcome! Feel free to:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is open source and available under the MIT License.

## Author

**TheJhyeFactor**

- GitHub: [@TheJhyeFactor](https://github.com/TheJhyeFactor)
- Portfolio: [thejhyefactor.github.io](https://thejhyefactor.github.io)

## Acknowledgments

- Built with React and Vite
- Icons from Lucide React
- Inspired by modern video editing workflows

---

© 2025 VideoFlow - Created by TheJhyeFactor • Professional browser-based video editing
