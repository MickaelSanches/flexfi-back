# FlexFi Image Assets

This directory contains image assets used in the application, including:

- Logo files
- PDF template images
- Email template assets

## Logo Files

- `flexfi-logo.png` - Main FlexFi logo, used in PDF generation
- `flexfi-logo-dark.png` - Dark version of the logo
- `flexfi-logo-light.png` - Light version of the logo

## Usage

When using these assets in the application, import them using:

```typescript
import path from 'path';

// Get the path to the logo for PDFs
const logoPath = path.join(__dirname, '../../assets/images/flexfi-logo.png');
```

## Adding New Images

When adding new image assets:

1. Use appropriate naming conventions
2. Optimize images for size (compress when possible)
3. Update this README with the new asset information
4. Document the usage in the relevant code files 