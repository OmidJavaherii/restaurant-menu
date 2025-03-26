# Restaurant Menu Application

A modern restaurant menu application built with Next.js, TypeScript, and MongoDB. Manage your menu items, orders, and admin accounts through a user-friendly interface.

## Features

- 🍽️ Menu Management (Add, Edit, Delete items)
- 👥 Admin Dashboard
- 🛍️ Order Management
- 🎨 Modern UI with Dark/Light mode
- 📱 Mobile Responsive Design

## Tech Stack

- Next.js 14
- TypeScript
- Tailwind CSS
- MongoDB Atlas
- GraphQL
- Apollo Client

## Getting Started

### Prerequisites

- Node.js 18.x or later
- MongoDB Atlas account
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/restaurant-menu.git
cd restaurant-menu
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env.local` file:
```env
MONGODB_URI=your_mongodb_connection_string
NEXT_PUBLIC_GRAPHQL_URL=http://localhost:3000/api/graphql
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000)

### Default Admin Login

```
Admin ID: AD123456
Password: admin123
```

## Deployment

1. Push to GitHub
2. Connect to Vercel
3. Add environment variables in Vercel:
   - `MONGODB_URI`
   - `NEXT_PUBLIC_GRAPHQL_URL`
   - `NEXT_PUBLIC_API_URL`

4. Deploy:
```bash
vercel --prod
```

## Project Structure

```
restaurant-menu/
├── src/
│   ├── app/              # Next.js app directory
│   ├── components/       # React components
│   ├── lib/             # Utilities
│   ├── scripts/         # Database scripts
│   └── types/           # TypeScript types
├── public/              # Static files
└── vercel.json          # Vercel config
```

## License

MIT License
