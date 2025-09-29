# Backend Server

Node.js backend server for the print system with nodemon for development.

## Getting Started

1. Navigate to the backend directory:

```bash
cd backend
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:
   Create a `.env` file with:

```
PORT=5000
NODE_ENV=development
DB_HOST=localhost
DB_PORT=5432
DB_NAME=your_database
DB_USER=your_username
DB_PASSWORD=your_password
PRINTNODE_API_KEY=your_printnode_api_key
```

4. Start the development server with nodemon:

```bash
npm run dev
```

5. The server will start on `http://localhost:5000`

## Available Scripts

- `npm run dev` - Start development server with nodemon (auto-restart on changes)
- `npm start` - Start production server
- `npm test` - Run tests (placeholder)

## API Endpoints

### Health Check

- `GET /` - Server status
- `GET /api/health` - Detailed health information

### Picklist Management

- `GET /api/picklist` - Get all picklist items
- `POST /api/picklist` - Create new picklist item
- `PUT /api/picklist/:id/pick` - Mark item as picked
- `GET /api/picklist/batch/:batchId` - Get items by batch

### Print & Preview

- `POST /api/print/preview` - Generate PDF preview (returns PDF)
- `POST /api/print/print` - Print PDF using PrintNode
- `GET /api/print/printers` - Get available PrintNode printers
- `GET /api/print/status/:jobId` - Get print job status
- `POST /api/print/batch` - Print multiple work orders for a batch

## PrintNode Integration

The backend integrates with PrintNode for silent printing:

### Features:

- **PDF Generation**: Uses Puppeteer to generate work order PDFs in memory
- **No File Storage**: PDFs are generated and sent directly to PrintNode without saving to disk
- **Batch Printing**: Print multiple work orders for the same batch
- **Preview Mode**: Generate PDF previews for testing

### PrintNode Setup:

1. Get your PrintNode API key from [PrintNode Dashboard](https://dashboard.printnode.com/)
2. Add `PRINTNODE_API_KEY` to your `.env` file
3. Install PrintNode client on your target machine
4. Use the `/api/print/printers` endpoint to get available printers

## PDF Generation

Work orders are generated as professional PDFs with:

- Order details and product information
- Warehouse location and batch information
- Product images (if available)
- Custom information and notes
- Professional styling and layout

## Features

- Express.js web framework
- CORS enabled for frontend communication
- Modular route structure
- Nodemon for development auto-restart
- PostgreSQL database support (ready for integration)
- PrintNode integration for silent printing
- PDF generation with Puppeteer
- No file storage - all PDFs generated in memory
