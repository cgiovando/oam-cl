# OpenAerialMap Browser

A modern, responsive web application for browsing and discovering open aerial imagery from [OpenAerialMap](https://openaerialmap.org). Built with React, MapLibre GL, and Tailwind CSS.

**Live Demo:** [https://cgiovando.github.io/oam-cl/](https://cgiovando.github.io/oam-cl/)

## Features

- **Interactive Map Browser** - Pan and zoom to explore aerial imagery worldwide
- **Image Grid** - Browse the most recent 50 images with thumbnails and metadata
- **Bounding Box Search** - Automatically fetches images within the current map view
- **Filters** - Filter by platform (UAV, Satellite, Aircraft), date range, and license
- **Image Details** - View metadata including provider, sensor, resolution (GSD), and file size
- **Direct Downloads** - Download GeoTIFF files directly from the interface
- **Show on Map** - Click to fly to any image's location on the map
- **Layer Modes** - Toggle between footprints only and live image previews
- **Basemap Switcher** - Switch between different basemap styles
- **Mini Map** - Overview map showing current viewport location
- **Location Search** - Search for places to quickly navigate the map
- **Responsive Design** - Works on desktop and tablet devices

## Tech Stack

- **React 19** - UI framework
- **Vite** - Build tool and dev server
- **MapLibre GL JS** - Map rendering
- **Tailwind CSS** - Styling
- **Turf.js** - Geospatial analysis

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/cgiovando/oam-cl.git
cd oam-cl

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`

### Development

```bash
# Run development server with hot reload
npm run dev

# Run linting
npm run lint

# Build for production
npm run build

# Preview production build locally
npm run preview
```

### Deployment

The app is configured for GitHub Pages deployment:

```bash
# Build and deploy to GitHub Pages
npm run deploy
```

This runs `vite build` and pushes the `dist/` folder to the `gh-pages` branch.

## Configuration

### API Proxy

The app uses the OpenAerialMap API (`api.openaerialmap.org`).

- **Development:** Vite proxies API requests to avoid CORS issues
- **Production:** Uses `corsproxy.io` as a CORS proxy

The proxy configuration is in `vite.config.js`:

```javascript
server: {
  proxy: {
    '/api': {
      target: 'https://api.openaerialmap.org',
      changeOrigin: true,
      rewrite: (path) => path.replace(/^\/api/, '')
    }
  }
}
```

### Result Limit

The number of images fetched per request is controlled by `RESULT_LIMIT` in `src/App.jsx`. Currently set to 50 to stay within the CORS proxy's response size limits.

## Project Structure

```
src/
├── App.jsx              # Main app component, state management, API calls
├── main.jsx             # Entry point
└── components/
    ├── Sidebar.jsx      # Image list sidebar
    ├── Map.jsx          # MapLibre map component
    ├── ImageCard.jsx    # Individual image card in sidebar
    ├── MapFilterBar.jsx # Filter controls (platform, date, license)
    ├── Toolbar.jsx      # Map controls (search, basemap, zoom)
    ├── MiniMap.jsx      # Overview mini map
    ├── SearchBar.jsx    # Location search
    ├── BasemapSwitcher.jsx # Basemap style switcher
    ├── FilterPanel.jsx  # Filter panel component
    └── BurgerMenu.jsx   # Navigation menu
```

## API Reference

This app uses the [OpenAerialMap API](https://api.openaerialmap.org):

- `GET /meta` - Fetch image metadata
  - `limit` - Number of results (default: 50)
  - `bbox` - Bounding box filter (minLon,minLat,maxLon,maxLat)
  - `order_by` - Sort field (e.g., `acquisition_end`)
  - `sort` - Sort direction (`asc` or `desc`)
  - `acquisition_from` / `acquisition_to` - Date filters
  - `platform` - Platform filter (satellite, uav, aircraft)

## Known Limitations

- **CORS Proxy Limits:** The production build uses `corsproxy.io` which has a 1MB response limit on the free tier. Large API responses may fail.
- **Result Limit:** Currently limited to 50 images per request to avoid hitting proxy limits.
- **No Pagination UI:** While the API supports pagination, the UI doesn't yet have "Load More" functionality.

## Contributing

Contributions are welcome! Please feel free to submit issues and pull requests.

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is open source. See the OpenAerialMap project for data licensing information.

## Acknowledgments

- [OpenAerialMap](https://openaerialmap.org) - Open imagery platform
- [Humanitarian OpenStreetMap Team (HOT)](https://www.hotosm.org/) - OAM maintainers
- [MapLibre](https://maplibre.org/) - Open-source map rendering
- [CARTO](https://carto.com/) - Basemap tiles
