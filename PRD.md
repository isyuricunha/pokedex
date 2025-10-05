PRD - PokéDex/PokéPedia Web
1. Product Overview
1.1 Objective

Create a modern and minimalist web application for querying Pokémon information, using PokéAPI as the data source.
1.2 Target Audience

Pokémon fans seeking quick information
Casual and competitive players
Developers interested in Pokémon-related projects
1.3 Value Proposition

Minimalist and aesthetic interface that facilitates quick and intuitive search and visualization of Pokémon data.

2. Tech Stack
2.1 Core

Framework: Next.js 15.5.4 (App Router)
Language: TypeScript
Package Manager: PNPM
API: PokéAPI
2.2 Styling

CSS Framework: Tailwind CSS (recommended for custom theme)
Theme:

Background: Pure Black (#000000)
Accent Color: Dark Orange (#FF8C00 or similar)
Typography: Modern and readable font (e.g., Inter, Geist)

3. Features
3.1 MVP (Initial Version)
3.1.1 Pokémon Listing

Grid/list of Pokémon with pagination
Minimalist card showing:

Official sprite
Name
Pokédex number
Types (with corresponding colors)
3.1.2 Search

Search bar by name or number
Filters by:

Type (Fire, Water, Grass, etc.)
Generation (Gen 1-9)
3.1.3 Details Page

Information displayed:

Basic: Name, number, sprite (normal and shiny), types
Base Stats: HP, Attack, Defense, Sp. Atk, Sp. Def, Speed (bar chart)
Physical: Height, weight
Abilities: List of abilities (normal and hidden)
Evolution Chain: Visual of evolution line
Moves: List of learned moves (by level-up, TM, etc.)
3.1.4 Performance

Server-Side Rendering (SSR) for SEO
Image optimization with next/image
API request caching
Elegant loading states
3.2 Future Features (Post-MVP)

Comparison between two Pokémon
Damage calculator
Location information
Favorites system (localStorage)
Dark/light mode toggle
Competitive game data (tiers, usage stats)

4. Design System
4.1 Color Palette
Primary Background: #000000 (Pure Black)
Secondary Background: #0A0A0A (Subtle variation)
Accent: #FF8C00 (Dark Orange)
Accent Hover: #FFA500 (Lighter Orange)
Text Primary: #FFFFFF
Text Secondary: #A0A0A0
Borders: #1A1A1A

4.2 Main Components

PokemonCard: Compact card for listing
PokemonDetail: Complete details layout
SearchBar: Search input with autocomplete
FilterPanel: Sidebar/modal with filters
StatBar: Visual bar for stats
TypeBadge: Badge for Pokémon types
EvolutionChain: Visual evolution component
4.3 Design Principles

Generous spacing (breathing room)
Subtle animations on hover/transitions
Clear visual hierarchy
Mobile-first responsive design
Accessibility (ARIA labels, keyboard navigation)

5. Data Structure (PokéAPI)
5.1 Main Endpoints
GET /pokemon/{id or name}          # Basic Pokémon data
GET /pokemon-species/{id}          # Species, flavor text, evolution chain
GET /evolution-chain/{id}          # Evolution chain
GET /type/{id or name}             # Type information
GET /move/{id or name}             # Move details

5.2 Caching Strategy

Next.js ISR (Incremental Static Regeneration)
In-memory cache for frequent data
Revalidation: 1 day (data rarely changes)

6. Folder Architecture (Suggestion)
/app
  /(routes)
    /page.tsx                    # Home with listing
    /pokemon/[id]/page.tsx       # Details page
    /search/page.tsx             # Advanced search page
  /api
    /pokemon/route.ts            # API routes if needed
/components
  /ui                            # Base components
  /pokemon                       # Specific components
/lib
  /api                           # PokéAPI call functions
  /utils                         # Helpers and utilities
  /types                         # TypeScript types/interfaces
/styles
  /globals.css                   # Global styles + Tailwind
/public
  /images                        # Static assets


7. Success Metrics
7.1 Performance

Lighthouse Score > 90 in all categories
First Contentful Paint < 1.5s
Time to Interactive < 3s
7.2 UX

Bounce rate < 40%
Average time on page > 2min
Mobile usability without errors

8. Roadmap
Phase 1: Foundation (Week 1-2)

Project setup (Next.js + TypeScript + PNPM)
Tailwind configuration with custom theme
Basic PokéAPI integration
Design system base components
Phase 2: MVP (Week 3-4)

Pokémon listing with pagination
Search and basic filters
Complete details page
Mobile responsiveness
Phase 3: Polish (Week 5)

Animations and transitions
Performance optimization
Usability testing
SEO and meta tags
Phase 4: Launch

Deploy on Vercel
Analytics monitoring
Feedback collection

9. Technical Considerations
9.1 PokéAPI Limitations

Rate limit: Without authentication, respect fair use
Data in English (manual translation if needed)
Sprites of different qualities
9.2 Accessibility

Adequate contrast (WCAG AA)
Alt text on all images
Functional keyboard navigation
Screen reader friendly
9.3 SEO

Dynamic meta tags per Pokémon
Automatically generated sitemap.xml
Open Graph images
Schema.org markup

10. Design References

Minimalist inspirations:

Pokémon Database (data structure)
Dribbble (minimalist visual concepts)
Vercel's design system (clean aesthetic)


🚀 I have started the Project
Prerequisites

Node.js 18+ and PNPM:


Already created Next.js Project
During Installation, I choose:

✅ TypeScript: Yes
✅ ESLint: Yes
✅ Tailwind CSS: Yes
✅ src/ directory: No (optional, but PRD structure assumes no src/)
✅ App Router: Yes
✅ Turbopack: Yes (for faster dev builds)
✅ Import alias: Yes (@/*)

---

## 📊 IMPLEMENTATION STATUS

### ✅ Phase 1-2: MVP - COMPLETED

#### Core Features
- ✅ **Project Setup**: Next.js 15.5.4 + TypeScript + PNPM
- ✅ **Design System**: Custom Tailwind theme with pure black (#000000) + dark orange (#FF8C00)
- ✅ **PokéAPI Integration**: Full integration with caching (1 day revalidation)
- ✅ **Pokémon Listing**: Grid layout with 20 items per page pagination
- ✅ **Search System**: Real-time search by name or number
- ✅ **Details Page**: Complete information including:
  - Base stats with visual bars
  - Abilities (normal and hidden)
  - Evolution chain with images
  - Height, weight, types
  - Legendary/Mythical badges
- ✅ **Performance**: SSR + ISR, image optimization with next/image
- ✅ **Loading States**: Skeleton cards during data fetch
- ✅ **Mobile Responsive**: Mobile-first design
- ✅ **SEO**: Dynamic metadata per Pokémon
- ✅ **404 Page**: Custom not found page

#### Components Created
**Pokemon Components**
- ✅ `PokemonCard` - Minimalist card with favorite & compare buttons
- ✅ `PokemonList` - Main listing with advanced filtering (global search)
- ✅ `TypeBadge` - Color-coded type badges
- ✅ `StatBar` - Animated stat visualization
- ✅ `EvolutionChain` - Visual evolution display
- ✅ `TypeMatchup` - Type effectiveness display (weaknesses/resistances/immunities)
- ✅ `BreedingInfo` - Complete breeding information
- ✅ `DamageCalculator` - Interactive damage calculator with STAB

**UI Components**
- ✅ `SearchBar` - Real-time search input
- ✅ `Pagination` - Page navigation
- ✅ `LoadingCard` - Skeleton loading state
- ✅ `FilterPanel` - Advanced filtering (types, generations, favorites)
- ✅ `FavoriteButton` - Heart icon for favorites
- ✅ `CompareButton` - Scale icon for comparisons
- ✅ `CompareBar` - Floating comparison selection bar
- ✅ `ThemeToggle` - Dark/Light mode switcher

### ✅ Phase 3: Post-MVP Features - COMPLETED

#### Advanced Filtering (December 2024)
- ✅ **FilterPanel Component**: Modal-based filter system
- ✅ **Type Filters**: Filter by 18 Pokémon types
- ✅ **Generation Filters**: Filter by Gen I-IX (1025 Pokémon)
- ✅ **Filter UI**: Responsive filter button with active count
- ✅ **Clear Filters**: One-click clear all functionality

#### Favorites System (December 2024)
- ✅ **localStorage Integration**: Persistent favorites across sessions
- ✅ **FavoriteButton Component**: Heart icon toggle on cards and details
- ✅ **Favorites Filter**: "Show Favorites Only" in FilterPanel
- ✅ **Utility Functions**: `favorites.ts` with add/remove/toggle/check

#### Theme System (December 2024)
- ✅ **Dark/Light Mode Toggle**: Sun/Moon icon button
- ✅ **Theme Persistence**: localStorage-based theme storage
- ✅ **Light Theme Colors**: Optimized palette for light mode
- ✅ **ThemeToggle Component**: Accessible theme switcher
- ✅ **CSS Variables**: Dynamic theme switching via `data-theme` attribute
- ✅ **No Flash**: Prevents theme flash on page load

#### Internationalization
- ✅ **English Translation**: All UI elements translated to English
- ✅ **Metadata**: SEO-optimized English metadata

### ✅ Phase 4: Advanced Comparison & Type Analysis - COMPLETED (December 2024)

#### Pokémon Comparison System
- ✅ **CompareButton Component**: Scale icon button on cards and details pages
- ✅ **CompareBar Component**: Floating selection bar showing selected Pokémon (max 2)
- ✅ **Comparison Page** (`/compare`): Full side-by-side comparison view
  - Visual stat comparison with bars
  - Height and weight comparison
  - Total stats calculation
  - Abilities comparison
  - Side-by-side Pokémon display with images
- ✅ **localStorage Integration**: Persistent comparison selections
- ✅ **Real-time Updates**: Event-based state synchronization across components

#### Type Effectiveness System
- ✅ **Type Effectiveness Calculator**: Complete type chart implementation
- ✅ **TypeMatchup Component**: Shows weaknesses, resistances, and immunities
- ✅ **Visual Indicators**: Multiplier badges (×4, ×2, ×½, ×¼, ×0)
- ✅ **Integrated in Details Page**: Type matchup section for each Pokémon
- ✅ **Coverage Analysis**: All 18 types + dual-type calculations

### ✅ Phase 5: Extended Data & Advanced Features - COMPLETED (January 2025)

#### Filter System Improvements
- ✅ **Fixed Global Filtering**: Filters now work across ALL Pokémon, not just current page
- ✅ **Smart Loading**: Only loads full dataset when filters are active (performance optimization)
- ✅ **Advanced Stat Filters**: Min Speed, Min Attack, Min HP sliders
- ✅ **Generation-Scoped Loading**: When filtering by generation, only loads that generation's Pokémon

#### Breeding & Competitive Information
- ✅ **BreedingInfo Component**: Complete breeding data display
  - Egg groups
  - Gender ratio with visual indicators
  - Hatch cycles and step calculations
  - Base happiness
  - Capture rate with percentage
  - Growth rate

#### Battle Utilities
- ✅ **DamageCalculator Component**: Interactive damage calculator
  - Move type and power selection
  - Physical/Special attack toggle
  - Defender stats configuration
  - STAB bonus calculation (1.5×)
  - Critical hit simulation (1.5×)
  - Type effectiveness integration
  - Damage range display (min-max)
  - KO probability analysis
  - VGC Level 50 standard

### 📋 Future Enhancements (Backlog)

#### Phase 6: Competitive Integration (Not Implemented)
- ⏳ **Competitive Data**: Integration with competitive Pokémon data
  - Usage statistics from Smogon/VGC
  - Tier rankings (OU, UU, RU, Ubers, etc.)
  - Common movesets and EV spreads
  - Meta analysis and trends

- ⏳ **Additional Features**:
  - Filter by abilities
  - Filter by egg groups
  - Filter by evolution stage
  - Complete move list with level/TM/egg moves
  - Location data from games
  - Pokédex entries from multiple games

### 🛠️ Technical Stack Summary

**Frontend**
- Next.js 15.5.4 (App Router, Turbopack)
- TypeScript (strict mode)
- Tailwind CSS v4
- Lucide React (icons)

**Data & State**
- PokéAPI (external API)
- localStorage (favorites, theme)
- React hooks (state management)

**Performance**
- SSR (Server-Side Rendering)
- ISR (Incremental Static Regeneration, 1 day)
- Image optimization (next/image)
- Code splitting (automatic)

**Tools**
- PNPM (package manager)
- ESLint (code quality)
- Git (version control)

### 📈 Metrics Achieved

- ✅ Fully responsive mobile-first design
- ✅ Accessibility features (ARIA labels, keyboard navigation)
- ✅ Fast page loads with SSR + ISR
- ✅ Clean, maintainable codebase
- ✅ Type-safe TypeScript implementation
- ✅ 1025 Pokémon covered (Gen I-IX)

---

### 🗺️ Application Routes

- ✅ `/` - Home page with Pokémon listing, search, and filters
- ✅ `/pokemon/[id]` - Detailed Pokémon information page
- ✅ `/compare?pokemon=1,2` - Side-by-side Pokémon comparison
- ✅ `/404` - Custom not found page

### 📦 Utility Libraries

**API Integration** (`/lib/api`)
- ✅ `pokeapi.ts` - PokéAPI integration functions

**Utilities** (`/lib/utils`)
- ✅ `favorites.ts` - Favorites management (localStorage)
- ✅ `theme.ts` - Theme management (localStorage)
- ✅ `comparison.ts` - Comparison selection management (localStorage)
- ✅ `type-effectiveness.ts` - Type effectiveness calculator (18 types)
- ✅ `damage-calculator.ts` - Battle damage calculation with STAB

**Types** (`/lib/types`)
- ✅ `pokemon.ts` - Complete TypeScript definitions for PokéAPI

---

**Last Updated**: January 2025  
**Status**: Full Feature Complete - Production Ready  
**Implemented Features**: 30+ components, 5+ utility libraries, complete Pokédex experience  
**Next Milestone**: Competitive Data Integration (Optional)