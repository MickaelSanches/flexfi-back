# Letter of Intent (LOI) API

This API allows partners to submit a Letter of Intent form, which generates a PDF document with their information and signature, stores it in the system, and sends it via email.

## API Endpoints

### Submit LOI - `POST /api/loi`

Receives form data and creates a Letter of Intent PDF.

#### Request Body

```json
{
  "fullName": "John Doe",
  "company": "Acme Corp",
  "email": "john.doe@example.com",
  "country": "United States",
  "sector": "Technology",
  "comments": "Looking forward to our partnership", // Optional
  "signature": "data:image/png;base64,..." // Base64 encoded PNG image
}
```

#### Response (Success - 201)

```json
{
  "success": true,
  "message": "Letter of Intent submitted successfully",
  "data": {
    "id": "60a1b2c3d4e5f6g7h8i9j0k1",
    "pdfUrl": "/uploads/loi/LOI_FlexFi_Acme_Corp_2023-05-02T14-30-00.pdf"
  }
}
```

#### Response (Error - 400, 500)

```json
{
  "success": false,
  "message": "Error message here",
  "errors": [] // Validation errors if applicable
}
```

### Get All LOIs - `GET /api/loi`

Retrieves a list of all submitted LOIs.

#### Response (Success - 200)

```json
{
  "success": true,
  "data": [
    {
      "id": "60a1b2c3d4e5f6g7h8i9j0k1",
      "fullName": "John Doe",
      "company": "Acme Corp",
      "email": "john.doe@example.com",
      "country": "United States",
      "sector": "Technology",
      "pdfUrl": "/uploads/loi/LOI_FlexFi_Acme_Corp_2023-05-02T14-30-00.pdf",
      "createdAt": "2023-05-02T14:30:00.000Z"
    },
    // ...more LOIs
  ]
}
```

### Get LOI by ID - `GET /api/loi/:id`

Retrieves a specific LOI by its ID.

#### Response (Success - 200)

```json
{
  "success": true,
  "data": {
    "id": "60a1b2c3d4e5f6g7h8i9j0k1",
    "fullName": "John Doe",
    "company": "Acme Corp",
    "email": "john.doe@example.com",
    "country": "United States",
    "sector": "Technology",
    "comments": "Looking forward to our partnership",
    "pdfUrl": "/uploads/loi/LOI_FlexFi_Acme_Corp_2023-05-02T14-30-00.pdf",
    "createdAt": "2023-05-02T14:30:00.000Z"
  }
}
```

### Download LOI PDF - `GET /api/loi/:id/download`

Downloads the generated PDF for a specific LOI.

#### Response

The API returns the PDF file directly for download.

## PDF Generation

The system generates a PDF document with:

1. FlexFi header
2. Form information (name, company, email, etc.)
3. Optional comments
4. Agreement text
5. User signature (inserted as an image)

The PDF is named with a unique identifier: `LOI_FlexFi_[CompanyName]_[Timestamp].pdf`

## Email Sending

The system automatically sends an email with the generated PDF:

- **To**: The email provided in the form
- **CC**: contact@flex-fi.io
- **Subject**: Your FlexFi Letter of Intent
- **Attachment**: The generated PDF

## Configuration

SMTP email settings can be configured in the `.env` file:

```
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=user@example.com
SMTP_PASS=your_password
```

## Storage

LOI data is stored in two places:

1. MongoDB database - Stores form information, including the signature
2. File system - Stores the generated PDF at `/uploads/loi/`

The PDF files are accessible via the `/uploads/loi/` URL path.

## Security Considerations

- Signatures are stored as base64 encoded PNG images
- Request size limit increased to 10MB to accommodate base64 images
- CORS and helmet middleware provide security for API endpoints 