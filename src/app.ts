import express, { Request, Response } from 'express';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Create Express app
const app = express();
const port = process.env.PORT || 3000;

// Basic route
app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Welcome to FlexFi API' });
});

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
}); 