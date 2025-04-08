# TON ScoreMaster

A web application for managing and tracking sports matches with TON blockchain integration.

## Features

- Match management (create, edit, delete matches)
- Admin dashboard
- Telegram Mini App integration
- TON blockchain integration
- Real-time updates

## Tech Stack

- Frontend: React, Material-UI
- Backend: Node.js, Express
- Database: MongoDB
- Blockchain: TON
- Authentication: Telegram Mini App

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB
- TON wallet
- Telegram Bot Token

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/ton-scoremaster.git
cd ton-scoremaster
```

2. Install dependencies:
```bash
# Install frontend dependencies
cd ton-scoremaster
npm install

# Install backend dependencies
cd ton-scoremaster-backend
npm install
```

3. Create environment files:
```bash
# Frontend (.env)
REACT_APP_API_URL=http://localhost:5002
REACT_APP_BOT_USERNAME=your_bot_username

# Backend (.env)
MONGODB_URI=your_mongodb_uri
PORT=5002
BOT_TOKEN=your_telegram_bot_token
```

4. Start the development servers:
```bash
# Start backend
cd ton-scoremaster-backend
npm start

# Start frontend
cd ton-scoremaster
npm start
```

## Deployment

This project is configured for deployment on Vercel. The frontend and backend are deployed separately.

### Frontend Deployment

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Configure environment variables in Vercel dashboard
4. Deploy

### Backend Deployment

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Configure environment variables in Vercel dashboard
4. Deploy

## License

MIT

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request 