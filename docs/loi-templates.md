# LOI Templates

This document describes the template system for the Letter of Intent (LOI) feature.

## Location

Templates are stored in the `src/templates/loi` directory.

## Current Templates

Currently, the LOI is generated dynamically using PDFKit, so no external template file is required. However, in the future, we might add template PDF files that can be used as a base for the generated LOIs.

## Usage

When adding new template files:

1. Place the template PDF file in the `src/templates/loi` directory
2. Update the `loiService.ts` file to use the template
3. Document the template's purpose and any specific requirements

## Structure

Template files should follow this naming convention:

```
loi_template_[purpose]_[version].pdf
```

For example:
- `loi_template_standard_v1.pdf`
- `loi_template_enterprise_v1.pdf`

## Integration

To use a PDF template as a base instead of generating one from scratch, you would need to modify the `generatePDF` method in `loiService.ts` to:

1. Load the template PDF
2. Add custom content (form data, signature) to specific positions
3. Save the modified PDF

This would require using additional libraries or extended functionality of PDFKit to work with existing PDF files. 