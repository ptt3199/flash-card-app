# Tech Context - Flashcard Learning App

## Technology Stack

### Frontend Framework
- **Next.js 14**: Full-stack React framework with file-based routing
- **React 19**: Latest stable version with concurrent features
- **TypeScript 5**: Type safety, better DX, future-proof

### Styling & UI
- **TailwindCSS 3**: Utility-first, responsive design, dark mode support
- **CSS Modules** (fallback): For component-specific styles
- **Lucide React**: Consistent icon system
- **Framer Motion** (optional): Smooth animations for card flips

### State Management
- **React Hooks & Context**: useState, useEffect, useReducer, useContext for global state
- **Context API**: Global state for app mode, settings
- **Custom Hooks**: Encapsulated logic for reusability

### Data Persistence
- **LocalStorage**: Primary storage, no server required
- **JSON**: Simple data serialization format
- **Browser Storage**: 5-10MB limit, sufficient for flashcards

### API Integration
- **Free Dictionary API**: Primary source, no auth required
  - Endpoint: `https://api.dictionaryapi.dev/api/v2/entries/en/{word}`
  - Rate limit: Reasonable for personal use
  - Response: JSON with definitions, phonetics, audio

- **Gemini AI API**: Fallback for missing words
  - Endpoint: `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent`
  - Requires API key (stored in environment variables)
  - Cost: Pay per request, cost-effective for occasional use

### Audio & Speech
- **Web Speech API**: Text-to-speech synthesis
  - Browser support: Modern browsers only
  - Fallback: Audio URLs from dictionary API
- **Audio API**: For playing pronunciation files

### Development Tools
- **ESLint**: Code linting with React/TypeScript rules
- **Prettier**: Code formatting consistency
- **Husky**: Git hooks for pre-commit checks
- **TypeScript**: Strict type checking enabled

### Build & Deployment
- **Next.js**: Production optimized builds
- **Vercel**: Static site hosting, CDN, automatic deployments
- **Environment Variables**: API keys, configuration

## Technical Constraints

### Browser Support
- **Modern browsers**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **Mobile browsers**: iOS Safari 14+, Chrome Mobile 90+
- **No IE support**: Relies on modern JS features

### Performance Requirements
- **Initial load**: < 3 seconds on 3G
- **Bundle size**: < 500KB gzipped
- **Runtime performance**: 60fps animations
- **Memory usage**: < 50MB for 1000 flashcards

### Storage Limitations
- **LocalStorage**: 5-10MB per domain
- **Fallback strategy**: Warn user when approaching limits
- **Data structure**: Optimized JSON, minimal overhead

### API Rate Limits
- **Dictionary API**: ~1000 requests/hour (generous)
- **Gemini API**: Pay per use, budget-conscious implementation
- **Caching strategy**: Cache successful responses locally

### Mobile Constraints
- **Touch targets**: Minimum 44px for accessibility
- **Viewport**: Support 320px+ width
- **Gestures**: Custom touch handlers for swipe
- **Performance**: Optimized for mobile CPUs

## Development Environment

### Required Tools
```bash
Node.js >= 18.0.0
npm >= 8.0.0
Git >= 2.20.0
```

### VS Code Extensions (Recommended)
- ES7+ React/Redux/React-Native snippets
- TypeScript Importer
- Tailwind CSS IntelliSense
- Prettier - Code formatter
- ESLint

### Environment Setup
```bash
# Install dependencies
npm install

# Development server
npm run dev

# Type checking
next lint

# Linting
npm run lint

# Build for production
npm run build

# Preview production build
npm run start
```

### Environment Variables
```bash
# .env.local
NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key_here
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_key
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key
```

## Dependencies

### Core Dependencies
```json
{
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "typescript": "^5.0.0"
}
```

### Build Dependencies
```json
{
  "next": "^14.2.5",
  "tailwindcss": "^3.3.0",
  "autoprefixer": "^10.4.0",
  "postcss": "^8.4.0"
}
```

### Utility Dependencies
```json
{
  "lucide-react": "^0.300.0",
  "clsx": "^2.0.0",
  "nanoid": "^5.0.0"
}
```

### Development Dependencies
```json
{
  "@types/react": "^18.2.0",
  "@types/react-dom": "^18.2.0",
  "eslint": "^8.50.0",
  "@typescript-eslint/eslint-plugin": "^6.0.0",
  "prettier": "^3.0.0",
  "husky": "^8.0.0"
}
```

## Security Considerations

### API Security
- **Environment Variables**: Sensitive keys not in source code
- **API Key Rotation**: Gemini keys can be rotated regularly
- **Rate Limiting**: Client-side throttling for API calls
- **Input Validation**: Sanitize user inputs before API calls

### XSS Prevention
- **React Built-in**: JSX escapes dangerous content
- **Input Sanitization**: Clean user inputs before storage
- **Content Security Policy**: Restrict inline scripts (future)

### Data Privacy
- **Local Storage Only**: No data sent to external servers
- **No User Tracking**: No analytics or tracking pixels
- **Minimal API Data**: Only word definitions requested

## Performance Optimization

### Bundle Optimization
- **Tree Shaking**: Remove unused code
- **Code Splitting**: Lazy load components
- **Asset Optimization**: Compress images, optimize fonts
- **Preloading**: Critical resources loaded first

### Runtime Optimization
- **React.memo**: Prevent unnecessary re-renders
- **useMemo/useCallback**: Expensive calculations cached
- **Virtual Scrolling**: For large card lists (future)
- **Debouncing/Throttling**: API calls and search

### Caching Strategy
- **API Response Cache**: Store successful dictionary lookups
- **Service Worker**: Cache static assets (future)
- **LocalStorage Optimization**: Efficient data structures

## Deployment Configuration

### Vercel Configuration
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "nextjs"
}
```

## Future Technical Considerations

### Scalability
- **IndexedDB**: For larger datasets
- **Web Workers**: Background processing
- **PWA Features**: Offline support, install prompt
- **Cloud Sync**: Optional backend integration

### Accessibility
- **ARIA Labels**: Screen reader support
- **Keyboard Navigation**: Full keyboard accessibility
- **High Contrast**: Support for vision impairments
- **Voice Commands**: Web Speech API integration

### Internationalization
- **i18n Framework**: React-i18next integration
- **Multiple Languages**: Support for various dictionary APIs
- **RTL Support**: Right-to-left language support

Cấu hình này đảm bảo ứng dụng hiện đại, performant và maintainable. 