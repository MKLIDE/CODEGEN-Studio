# Icons Directory

This directory contains SVG icons for the application.

## Icon Requirements:
- SVG format
- Optimized (no unnecessary metadata)
- Proper viewBox attribute
- Consistent styling

## Usage:
```tsx
import ReactIcon from './react.svg';

const IconComponent = () => (
  <img src={ReactIcon} alt="React" />
);
```

## Adding New Icons:
1. Optimize SVG using SVGO
2. Place in appropriate subdirectory
3. Update icon registry if needed
