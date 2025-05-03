# LOI File Storage

This document describes the storage system for the Letter of Intent (LOI) PDF files.

## Location

Generated LOI files are stored in the `uploads/loi` directory at the project root.

## Structure

Generated LOI files follow this naming convention:

```
LOI_FlexFi_[CompanyName]_[Timestamp].pdf
```

For example:
- `LOI_FlexFi_Acme_Inc_2023-05-02T14-30-00.pdf`

## Access

These files are served statically through the `/uploads/loi` endpoint, which is configured in `src/app.ts`:

```typescript
// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
```

## Directory Creation

The directory is automatically created by the application when the first LOI is generated. This is handled by the `ensureDirectoriesExist` method in `loiService.ts`.

## Maintenance

Consider implementing a cleanup strategy for older files if storage becomes a concern. You might want to:

1. Move files to long-term storage after a certain period
2. Delete files older than X months
3. Implement a backup system before any deletion

## Security Considerations

Ensure that this directory:

1. Has appropriate file permissions
2. Is not accessible to unauthorized users (consider implementing authentication for downloads)
3. Does not expose sensitive information in filenames

## Related Files

- `src/services/loiService.ts` - Handles PDF generation and storage
- `src/controllers/loiController.ts` - Contains the `downloadLOI` endpoint
- `src/app.ts` - Configures static file serving 