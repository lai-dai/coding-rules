## 9. Advanced Topics

### 9.1 Micro-frontend Architecture

```typescript
// Federated Modules Configuration
// next.config.js
const NextFederationPlugin = require('@module-federation/nextjs-mf')

module.exports = {
  webpack(config, options) {
    config.plugins.push(
      new NextFederationPlugin({
        name: 'main',
        remotes: {
          auth: 'auth@http://localhost:3001/remoteEntry.js',
          shop: 'shop@http://localhost:3002/remoteEntry.js'
        },
        shared: ['react', 'react-dom']
      })
    )
    return config
  }
}
```

### 9.2 Advanced Data Patterns

```typescript
// Command Query Responsibility Segregation (CQRS)
features/products/
├── commands/           # Write operations
│   ├── createProduct.ts
│   └── updateProduct.ts
├── queries/           # Read operations
│   ├── getProduct.ts
│   └── listProducts.ts
└── events/           # Domain events
    └── productEvents.ts

// Event Sourcing
interface Event {
  id: string
  type: string
  data: any
  timestamp: number
  aggregateId: string
}

class EventStore {
  async saveEvents(events: Event[]) {
    // Save events to database
  }

  async getEvents(aggregateId: string) {
    // Get events by aggregate ID
  }
}
```

### 9.3 Internationalization

```typescript
// i18n Configuration
// next.config.js
module.exports = {
  i18n: {
    locales: ['en', 'fr', 'de'],
    defaultLocale: 'en'
  }
}

// Translations Structure
app/
├── locales/
│   ├── en/
│   │   ├── common.json
│   │   └── auth.json
│   └── fr/
│       ├── common.json
│       └── auth.json

// Translation Hook
const useTranslation = (namespace: string) => {
  const { locale } = useRouter()
  const translations = require(`@/locales/${locale}/${namespace}.json`)

  return {
    t: (key: string) => translations[key] || key
  }
}
```

### 9.4 Real-time Features

```typescript
// WebSocket Integration
features/chat/
├── api/
│   └── socket.ts
├── hooks/
│   └── useWebSocket.ts
└── components/
    └── ChatRoom.tsx

// WebSocket Hook
const useWebSocket = () => {
  const socket = useRef<WebSocket>()
  const [messages, setMessages] = useState<Message[]>([])

  useEffect(() => {
    socket.current = new WebSocket(WS_URL)
    
    socket.current.onmessage = (event) => {
      const message = JSON.parse(event.data)
      setMessages(prev => [...prev, message])
    }

    return () => socket.current?.close()
  }, [])

  const sendMessage = (message: string) => {
    socket.current?.send(JSON.stringify({ type: 'message', content: message }))
  }

  return { messages, sendMessage }
}
```

### 9.5 Advanced Security

```typescript
// Security Middleware
middleware.ts
import { rateLimit } from '@/lib/rateLimit'
import { validateCSRF } from '@/lib/csrf'

export async function middleware(req: NextRequest) {
  // Rate limiting
  const limiter = rateLimit({
    interval: 60 * 1000, // 1 minute
    uniqueTokenPerInterval: 500
  })

  try {
    await limiter.check(req, 30) // 30 requests per minute
  } catch {
    return new Response('Too Many Requests', { status: 429 })
  }

  // CSRF Protection
  if (req.method !== 'GET') {
    const isValid = await validateCSRF(req)
    if (!isValid) {
      return new Response('Invalid CSRF Token', { status: 403 })
    }
  }
}

// Authentication Guards
const withAuth = (Component: NextPage) => {
  return function AuthenticatedComponent(props: any) {
    const { user, loading } = useAuth()
    const router = useRouter()

    useEffect(() => {
      if (!loading && !user) {
        router.replace('/login')
      }
    }, [loading, user, router])

    if (loading) {
      return <LoadingSpinner />
    }

    return user ? <Component {...props} /> : null
  }
}
```

### 9.6 Performance Optimization

```typescript
// Dynamic Imports with Loading States
const DynamicComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <LoadingSpinner />,
  ssr: false
})

// Image Optimization
const OptimizedImage = ({ src, alt }: ImageProps) => {
  return (
    <Image
      src={src}
      alt={alt}
      placeholder="blur"
      blurDataURL={`data:image/svg+xml;base64,...`}
      layout="responsive"
      sizes="(max-width: 768px) 100vw, 50vw"
    />
  )
}

// React Query Configuration
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      cacheTime: 1000 * 60 * 30,
      retry: 3,
      refetchOnWindowFocus: false
    }
  }
})
```

### 9.7 CI/CD Pipeline

```yaml
# .github/workflows/main.yml
name: CI/CD Pipeline

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  quality:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Install dependencies
        run: npm ci
      - name: Lint
        run: npm run lint
      - name: Type check
        run: npm run type-check
      - name: Test
        run: npm run test
      - name: E2E tests
        run: npm run e2e

  build:
    needs: quality
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Build
        run: npm run build
      - name: Analyze bundle
        run: npm run analyze

  deploy:
    needs: build
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to production
        run: |
          # Deployment steps
```

### 9.8 Monitoring & Analytics

```typescript
// Performance Monitoring
export function reportWebVitals(metric: NextWebVitalsMetric) {
  switch (metric.name) {
    case 'FCP':
      // First Contentful Paint
      break
    case 'LCP':
      // Largest Contentful Paint
      break
    case 'CLS':
      // Cumulative Layout Shift
      break
    case 'FID':
      // First Input Delay
      break
    case 'TTFB':
      // Time to First Byte
      break
  }
}

// Error Tracking
class ErrorTracker {
  private static instance: ErrorTracker
  
  static getInstance() {
    if (!ErrorTracker.instance) {
      ErrorTracker.instance = new ErrorTracker()
    }
    return ErrorTracker.instance
  }

  captureError(error: Error, context?: any) {
    // Send to error tracking service
    console.error(error, context)
  }

  captureMessage(message: string, level: 'info' | 'warning' | 'error') {
    // Log message
    console.log(message, level)
  }
}

// Usage
try {
  // Some operation
} catch (error) {
  ErrorTracker.getInstance().captureError(error, {
    component: 'LoginForm',
    user: currentUser.id
  })
}
```

### 9.9 DevOps & Infrastructure

```typescript
// Docker Configuration
// Dockerfile
FROM node:18-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

FROM node:18-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM node:18-alpine AS runner
WORKDIR /app
ENV NODE_ENV production
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000
ENV PORT 3000
CMD ["node", "server.js"]

// docker-compose.yml
version: '3.8'
services:
  web:
    build: .
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=postgres://user:pass@db:5432/dbname
    depends_on:
      - db
  db:
    image: postgres:13
    environment:
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=pass
      - POSTGRES_DB=dbname
```

## 10. Development Best Practices

### 10.1 Code Review Checklist

1. Architecture
- Feature independence maintained
- Proper separation of concerns
- No circular dependencies
- Proper use of shared components

2. Performance
- Proper code splitting
- Image optimization
- Memoization where needed
- API response caching

3. Security
- Input validation
- XSS prevention
- CSRF protection
- Proper auth checks

4. Quality
- Type safety
- Error handling
- Unit tests
- Documentation

### 10.2 Team Collaboration

1. Git Workflow
```bash
# Feature branch workflow
git checkout -b feature/auth-improvement
git add .
git commit -m "feat: improve auth flow"
git push origin feature/auth-improvement
```

2. PR Template
```markdown
## Description
Brief description of changes

## Type of change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## How Has This Been Tested?
Describe test cases

## Checklist
- [ ] My code follows style guidelines
- [ ] I have added tests
- [ ] Documentation has been updated
```

### 10.3 Documentation Standards

```markdown
# Feature Name

## Overview
Brief description of the feature

## Architecture
Detailed architecture explanation

## Components
List and describe main components

## API
API endpoints documentation

## State Management
State management approach

## Testing
Testing strategy

## Usage Examples
Code examples

## Troubleshooting
Common issues and solutions
```
