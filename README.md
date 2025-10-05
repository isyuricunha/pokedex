# 🎮 PokéDex - Modern Pokémon Encyclopedia

A modern, feature-rich Progressive Web App (PWA) built with Next.js 15, TypeScript, and Tailwind CSS v4. Browse, compare, and learn about all 1025+ Pokémon with an intuitive, minimalist interface.

![Next.js](https://img.shields.io/badge/Next.js-15.5.4-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-38bdf8)
![License](https://img.shields.io/badge/License-LGPL%202.1-green)

## ✨ Features

### Core Features
- 📱 **Progressive Web App** - Install and use offline
- 🔍 **Real-time Search** - Instant search across all Pokémon
- 📊 **Detailed Stats** - Base stats, abilities, moves, and more
- 🧬 **Evolution Chains** - Visual evolution paths
- 🎯 **Type Effectiveness** - Interactive type matchup chart
- 🌙 **Dark/Light Themes** - Toggle between themes

### Advanced Features
- 👥 **Team Builder** - Build and analyze teams of up to 6 Pokémon
- ⚖️ **Pokémon Comparison** - Side-by-side comparison tool
- 🏆 **Leaderboards** - Rankings by BST, type distribution, and more
- 🎲 **Random Discovery** - "I'm Feeling Lucky" feature
- 🎮 **Quiz Mode** - Test your knowledge (Silhouette, Stats, Type quizzes)
- 📈 **Data Visualization** - Radar charts, type effectiveness analysis
- ⭐ **Favorites & Collections** - Track viewed Pokémon and achievements
- 🎨 **Shiny Variants** - Toggle to view shiny sprites
- 💾 **Export/Import Progress** - Save and restore your collection
- 📱 **Mobile Gestures** - Swipe navigation, pull-to-refresh
- 🔗 **Share Functionality** - Share Pokémon via Web Share API

## 🚀 Getting Started

### Prerequisites
- Node.js 18.17 or later
- pnpm (recommended) or npm/yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/isyuricunha/pokedex.git
cd pokedex

# Install dependencies
pnpm install

# Run development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

### Build for Production

```bash
# Create optimized production build
pnpm build

# Start production server
pnpm start
```

## 📦 Tech Stack

- **Framework:** Next.js 15.5.4 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **Font:** Geist Sans
- **API:** [PokéAPI](https://pokeapi.co/)
- **State Management:** React Hooks + localStorage
- **PWA:** Service Worker + Manifest
- **Build Tool:** Turbopack

## 🎨 Design System

- **Theme:** Pure black (#000000) with dark orange accent (#FF8C00)
- **Style:** Minimalist and modern
- **Typography:** Geist Sans
- **Responsive:** Mobile-first approach

## 📁 Project Structure

```
├── app/                    # Next.js App Router pages
│   ├── pokemon/[id]/      # Dynamic Pokémon detail pages
│   ├── compare/           # Comparison page
│   ├── team/              # Team builder page
│   ├── leaderboards/      # Rankings and statistics
│   ├── quiz/              # Quiz game page
│   └── type-chart/        # Type effectiveness chart
├── components/
│   ├── pokemon/           # Pokémon-specific components
│   ├── team/              # Team builder components
│   └── ui/                # Reusable UI components
├── lib/
│   ├── api/               # PokéAPI integration
│   ├── types/             # TypeScript type definitions
│   └── utils/             # Utility functions
└── public/                # Static assets & PWA manifest
```

## 🛠️ Available Scripts

```bash
# Development
pnpm dev          # Start dev server with Turbopack
pnpm build        # Build for production
pnpm start        # Start production server
pnpm lint         # Run ESLint
```

## 🌐 PWA Features

- **Offline Support:** Service Worker caches viewed Pokémon
- **Installable:** Add to home screen on mobile devices
- **Fast Loading:** Cache-first strategy for images
- **Background Sync:** Progressive data loading

**Note:** To enable full PWA functionality, create app icons:
- `public/icon-192.png` (192x192px)
- `public/icon-512.png` (512x512px)

## 💾 Data Persistence

All user data is stored locally using:
- **localStorage:** Favorites, teams, preferences, achievements
- **Service Worker Cache:** Pokémon data and images
- **No Backend Required:** 100% client-side application

## 🎯 Performance

- **SSR + ISR:** Server-side rendering with Incremental Static Regeneration
- **Cache Strategy:** 24-hour revalidation for Pokémon data
- **Image Optimization:** Next.js Image component with lazy loading
- **Code Splitting:** Automatic route-based splitting
- **Reduced Motion:** Respects user preferences

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the **LGPL-2.1 License** - see the [LICENSE.txt](LICENSE.txt) file for details.

## 👤 Author

**Yuri Cunha**
- Website: [yuricunha.com](https://yuricunha.com)
- GitHub: [@isyuricunha](https://github.com/isyuricunha)

## 🙏 Acknowledgments

- [PokéAPI](https://pokeapi.co/) - The RESTful Pokémon API
- [Next.js](https://nextjs.org/) - The React Framework
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [Lucide Icons](https://lucide.dev/) - Beautiful icon library

---

**Built with ❤️ using Next.js, TypeScript, and PokéAPI**
