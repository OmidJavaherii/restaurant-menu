# Restaurant Menu Management System

A modern web application for managing restaurant menus, built with Next.js, TypeScript, and Material-UI. This system allows restaurant administrators to manage their menu items and provides a beautiful interface for customers to view the menu.

## Features

- 🎨 Modern and responsive UI with dark/light mode support
- 🔐 Secure admin authentication system
- 📱 Mobile-friendly design
- 🍽️ Easy menu item management
- 🖼️ Image upload support for menu items
- 🌙 Dark/Light theme toggle
- 🔍 Search and filter functionality

## Tech Stack

- **Frontend Framework:** Next.js 14
- **Language:** TypeScript
- **UI Library:** Material-UI (MUI)
- **State Management:** Zustand
- **Form Handling:** React Hook Form
- **Styling:** Tailwind CSS
- **Authentication:** Custom implementation

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn package manager

## Getting Started

1. Clone the repository:
```bash
git clone [your-repository-url]
cd restaurant-menu
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Create a `.env.local` file in the root directory and add your environment variables:
```env
NEXT_PUBLIC_API_URL=your_api_url
```

4. Run the development server:
```bash
npm run dev
# or
yarn dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Admin Access

To access the admin dashboard, use the following credentials:

- **Admin ID:** AD123456
- **Password:** admin123

## Project Structure

```
restaurant-menu/
├── src/
│   ├── app/                 # Next.js app directory
│   ├── components/          # Reusable components
│   ├── hooks/              # Custom hooks
│   ├── store/              # Zustand store
│   └── types/              # TypeScript types
├── public/                 # Static assets
└── package.json           # Project dependencies
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, please open an issue in the repository or contact the development team.
