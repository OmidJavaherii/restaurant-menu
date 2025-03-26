# Restaurant Menu

## 🔐 Admin Login Credentials

For accessing the admin panel, use the following credentials:

```
Admin ID: AD123456
Password: admin123
```

> ⚠️ **Note**: These are demo credentials. In a production environment, please change these credentials immediately after deployment.

A modern, responsive restaurant menu website built with Next.js 14, featuring a beautiful UI, smooth animations, and PWA capabilities.

## 🌟 Features

- **Modern Design**
  - Clean and elegant layout
  - Beautiful typography with Geist font
  - Smooth animations and transitions
  - Responsive design for all devices

- **User Experience**
  - Easy navigation
  - Smooth scroll animations
  - Dark mode support
  - Custom 404 page

- **Technical Features**
  - Built with Next.js 14
  - TypeScript for type safety
  - Tailwind CSS, MUI for styling
  - PWA support with offline capabilities

## 🚀 Getting Started

### Prerequisites

- Node.js 18.17 or later
- npm or yarn package manager

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/omidjavaherii/restaurant-menu.git
   ```

2. Navigate to the project directory:
   ```bash
   cd restaurant-menu
   ```

3. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

4. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🛠️ Built With

- [Next.js](https://nextjs.org/) - React framework for production
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [Framer Motion](https://www.framer.com/motion/) - Animation library
- [React Icons](https://react-icons.github.io/react-icons/) - Icon library

## 📱 PWA Installation

### Desktop
- Click the install button in the browser's address bar
- Or use the "Install" button in the app

### Mobile
- iOS: Use the "Add to Home Screen" option in the share menu
- Android: Click "Add to Home Screen" in the browser menu

## 🎨 Customization

### Colors
The theme colors can be customized in `tailwind.config.ts`:
```typescript
colors: {
  primary: {
    DEFAULT: '#046D8B',
    dark: '#035A73',
  },
  // ... other colors
}
```

### Content
- Update menu items in `src/data/menu.ts`
- Modify categories in `src/data/categories.ts`
- Edit contact information in `src/data/contact.ts`

## 📦 Project Structure

```
restaurant-menu/
├── public/
│   ├── icons/          # PWA icons
│   └── images/         # Static images
├── src/
│   ├── app/           # Next.js app router
│   ├── components/    # React components
│   │   ├── layout/    # Layout components
│   │   └── ui/        # UI components
│   ├── data/         # Content data
│   ├── hooks/        # Custom hooks
│   └── styles/       # Global styles
└── package.json
```

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

## 🤝 Contact

Project Link: [https://github.com/omidjavaherii/restaurant-menu](https://github.com/omidjavaherii/restaurant-menu)
