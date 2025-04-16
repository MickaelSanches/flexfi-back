📦 **FlexFi Backend — flexfi-back**

This repository contains the backend API and service logic for the FlexFi Protocol. Built with Node.js, Express, and TypeScript, it connects the frontend, smart contracts (Solana), and data storage layers.

⚠️ Note: This repository is open source under MIT for hackathon visibility purposes. However, sensitive logic (e.g., scoring engine, financial models, smart contract trigger patterns) remains protected under contributor NDA and may be redacted or obfuscated.

For usage beyond the hackathon, please request written permission at contact@flex-fi.io.

🚀 **Project Setup**

1. Clone the repo

`git clone https://github.com/flexfi-protocol/flexfi-back.git`

`cd flexfi-back`

2. Install dependencies

`npm install`

3. Set up environment variables
Create a .env file based on the provided .env.example:

`cp .env.example .env`

4. Run the development server

`npm run dev`

📁 **Project Structure**
```
/src
 ┣ 📁 controllers       # API endpoints
 ┣ 📁 services          # Business logic
 ┣ 📁 routes            # Route definitions
 ┣ 📁 repositories      # DB access layer
 ┣ 📁 middlewares       # Auth, logging, validation
 ┣ 📁 utils             # Helpers & formatters
 ┗ 📜 app.ts            # Main app entry point
```
🛡 **License**

This project is released under the MIT License. See LICENSE for more information.

🙌 **Contributing**

We welcome contributions from everyone. Please read our CONTRIBUTING.md to get started.

📫 **Contact**

Lead Maintainer: MickaelSanches

Email: contact@flex-fi.io

Website: https://www.flex-fi.io/

Built with 💜 for the Solana Breakout Hackathon 2025
