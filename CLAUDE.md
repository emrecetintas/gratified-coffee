# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is "Gratified Coffee" - a creative coffee shop website featuring 3D interactive drink visualizations. The project is a single-page web application that combines artistic design with WebGL-powered Three.js visualizations.

## Repository Structure

This is a static website with minimal structure:
- `index.html` - Main HTML file containing the complete website structure and styling
- `main.js` - JavaScript file containing Three.js 3D visualization logic and interactive menu functionality
- `chill.mp3` - Background music file
- `CNAME` - Domain configuration for GitHub Pages

## Development Commands

This project has no build system or package management. To develop:

- **Local Development**: Use any static file server (e.g., `python -m http.server 8000` or Live Server extension)
- **No Build Process**: Files are served directly without compilation
- **No Testing Framework**: Manual testing in browser required
- **No Linting**: No configured linting tools

## Architecture & Key Components

### HTML Structure (`index.html`)
- **CSS Variables**: Comprehensive color palette defined in `:root` with Arabic/Middle Eastern inspired colors
- **Responsive Design**: Mobile-first approach with media queries for different screen sizes
- **Menu System**: Static menu items with `data-drink` attributes for 3D visualization triggers

### JavaScript Architecture (`main.js`)

**Core 3D System:**
- `initThreeScene()` - Sets up Three.js scene, camera, renderer, and lighting
- `createCoffeeCup(drinkData)` - Generates procedural 3D coffee cup with ingredient layers
- `showDrinkVisualization(drinkKey)` - Displays 3D visualization for menu items

**Key Data Structure:**
```javascript
menuData = {
  "drink-key": {
    name: "Display Name",
    description: "Description",
    cupColor: "#hex",
    steamColor: "#hex", 
    ingredients: [
      { name: "Ingredient", volume: number, color: "#hex" }
    ]
  }
}
```

**Interactive Features:**
- Hover-based 3D visualization triggers for specialty drinks
- Mobile touch support with click toggles
- Auto-hide functionality with 300ms delay
- OrbitControls for 3D navigation

**Visual Effects:**
- Procedural paper cup texture generation
- Layered ingredient visualization based on volume ratios
- Animated steam particle effects
- Starry background with twinkling animation
- Arabic pattern-inspired sleeve textures

### Styling Philosophy
- Arabic/Islamic geometric pattern influences
- Warm color palette (burgundy, saffron, amber tones)
- Typography: Amiri serif font for Arabic aesthetic
- Decorative elements using CSS pseudo-elements

## Interactive Features

- **3D Drink Viewer**: Hover over specialty drinks to see 3D visualization
- **Background Music**: Auto-playing ambient audio (chill.mp3)
- **Navigation**: Links to related Gratified properties (gratified.com, gratified.art)
- **Responsive Viewer**: 3D container adapts to mobile (bottom overlay) vs desktop (right sidebar)

## Technical Dependencies

- **Three.js r128**: 3D graphics library loaded via CDN
- **OrbitControls**: Camera control system for 3D navigation
- **WebGL**: Required for 3D rendering capabilities
- **Canvas API**: Used for procedural texture generation

## Content Structure

- **Basic Drinks**: Coffee, Tea, Other categories with static descriptions
- **Specialty Drinks**: Interactive 3D-enabled items with complex ingredient compositions
- **Food Menu**: Simple text-based food offerings

## Mobile Considerations

- 3D viewer repositions to bottom overlay on mobile
- Touch events replace hover interactions
- Simplified navigation controls for smaller screens
- Reduced particle counts for performance
