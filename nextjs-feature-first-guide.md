# Hướng Dẫn Kiến Trúc Feature-First Next.js 14

## Mục Lục
1. [Giới thiệu](#1-giới-thiệu)
   - [1.1 Feature-First Architecture Là Gì](#11-feature-first-architecture-là-gì)
   - [1.2 Tại Sao Chọn Feature-First](#12-tại-sao-chọn-feature-first)
   - [1.3 Khi Nào Nên Sử Dụng](#13-khi-nào-nên-sử-dụng)

2. [Cấu Trúc Dự Án](#2-cấu-trúc-dự-án)
   - [2.1 Cấu Trúc Thư Mục Gốc](#21-cấu-trúc-thư-mục-gốc)
   - [2.2 Cấu Trúc Feature Module](#22-cấu-trúc-feature-module)
   - [2.3 Cấu Trúc Shared Resources](#23-cấu-trúc-shared-resources)

3. [Quy Ước Đặt Tên](#3-quy-ước-đặt-tên)
   - [3.1 Quy Tắc Chung](#31-quy-tắc-chung)
   - [3.2 Ví Dụ Cụ Thể](#32-ví-dụ-cụ-thể)

4. [Tổ Chức Features](#4-tổ-chức-features)
   - [4.1 Tính Năng Xác Thực](#41-tính-năng-xác-thực)
   - [4.2 Tổ Chức State Management](#42-tổ-chức-state-management)
     - [4.2.1 Global State](#421-global-state)
     - [4.2.2 Feature State](#422-feature-state)
     - [4.2.3 Server State](#423-server-state)

5. [Mô Hình Luồng Dữ Liệu](#5-mô-hình-luồng-dữ-liệu)
   - [5.1 Luồng Xử Lý Dữ Liệu Chuẩn](#51-luồng-xử-lý-dữ-liệu-chuẩn)
   - [5.2 Xử Lý Mutations](#52-xử-lý-mutations)

6. [Triển Khai Chi Tiết](#6-triển-khai-chi-tiết)
   - [6.1 Data Table Với TanStack Table](#61-data-table-với-tanstack-table)
   - [6.2 Form Handling Với React Hook Form](#62-form-handling-với-react-hook-form)

7. [Xử Lý Lỗi và Loading States](#7-xử-lý-lỗi-và-loading-states)
   - [7.1 Error Handling](#71-error-handling)
   - [7.2 Loading States](#72-loading-states)

8. [Tối Ưu Hiệu Suất](#8-tối-ưu-hiệu-suất)
   - [8.1 React Query Optimization](#81-react-query-optimization)
   - [8.2 Component Optimization](#82-component-optimization)
   - [8.3 Code Splitting và Dynamic Imports](#83-code-splitting-và-dynamic-imports)

9. [Testing Strategy](#9-testing-strategy)
   - [9.1 Unit Testing Components](#91-unit-testing-components)
   - [9.2 Integration Testing](#92-integration-testing)
   - [9.3 API Mocking](#93-api-mocking)

10. [Deployment và Configuration](#10-deployment-và-configuration)
    - [10.1 Environment Variables](#101-environment-variables)
    - [10.2 Next.js Config](#102-nextjs-config)
    - [10.3 CI/CD Workflow](#103-cicd-workflow)

11. [Best Practices](#11-best-practices)
    - [11.1 Code Organization](#111-code-organization)
    - [11.2 State Management](#112-state-management)
    - [11.3 Performance](#113-performance)
    - [11.4 Testing](#114-testing)
    - [11.5 Error Handling](#115-error-handling)

## 1. Giới thiệu

### 1.1 Feature-First Architecture Là Gì
Feature-First Architecture là một phương pháp tổ chức code trong đó code được nhóm theo các tính năng nghiệp vụ thay vì các loại kỹ thuật. Mỗi feature là một module độc lập, tự chứa tất cả các thành phần cần thiết.

```
features/
├── auth/          # Authentication feature
├── products/      # Product management
└── users/         # User management
```

### 1.2 Tại Sao Chọn Feature-First

#### Lợi ích chính:
- **Modularity**: Mỗi feature độc lập và có thể maintain riêng
- **Scalability**: Dễ dàng thêm/xóa features
- **Team Organization**: Teams có thể làm việc song song
- **Code Locality**: Related code ở gần nhau
- **Better Testing**: Dễ dàng test từng feature

#### Developer Experience:
- Structure rõ ràng, dễ hiểu
- Onboarding dev mới dễ dàng
- Giảm conflicts khi làm việc nhóm
- Có thể reuse code hiệu quả

#### Type Safety:
- Type definitions nằm gần code
- Dễ dàng maintain types
- Auto-completion tốt hơn
- Catch errors sớm hơn

### 1.3 Khi Nào Nên Sử Dụng

#### Phù hợp cho:
- Large-scale applications
- Multiple development teams
- Complex business domains
- Long-term maintainability

#### Một số bất lợi
##### Complexity:
- Setup ban đầu phức tạp
- Nhiều boilerplate code
- Learning curve cao hơn
- Cần thống nhất conventions

##### Overhead:
- Nhiều files và folders
- Duplicate code có thể xảy ra
- Bundle size có thể lớn hơn
- Build time có thể lâu hơn

## 2. Cấu Trúc Dự Án

### 2.1 Cấu Trúc Thư Mục Gốc
```typescript
src/
├── app/                     # Next.js App Router
│   ├── (auth)/             # Nhóm route xác thực
│   │   ├── login/
│   │   ├── register/
│   │   └── forgot-password/
│   │
│   ├── (dashboard)/        # Nhóm route dashboard
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── loading.tsx
│   │
│   └── api/                # Routes API
│       ├── auth/
│       └── users/
│
├── features/               # Các module tính năng
│   ├── auth/
│   ├── users/
│   └── products/
│
├── shared/                # Tài nguyên dùng chung
│   ├── components/
│   ├── hooks/
│   └── utils/
│
├── types/                 # Types toàn cục
└── lib/                  # Cấu hình thư viện bên ngoài
```

### 2.2 Cấu Trúc Feature Module
```typescript
features/auth/              # Module xác thực
├── api/                   # Tích hợp API
│   ├── queries/          # React Query hooks
│   │   ├── use-auth-user.ts
│   │   └── use-auth-session.ts
│   └── mutations/        # Mutation hooks
│       ├── use-login.ts
│       └── use-register.ts
│
├── components/           # Components UI
│   ├── forms/           # Form components
│   │   ├── login-form/
│   │   │   ├── login-form.tsx
│   │   │   ├── use-login-form.ts
│   │   │   └── types.ts
│   │   └── register-form/
│   └── shared/          # Components dùng chung trong feature
│
├── hooks/               # Custom hooks
│   ├── use-auth.ts
│   └── use-permissions.ts
│
├── stores/             # Quản lý state
│   └── auth-store.ts
│
├── utils/              # Tiện ích
│   ├── token.ts
│   └── validation.ts
│
└── types/              # Định nghĩa types
    ├── auth.types.ts
    └── api.types.ts
```

### 2.3 Cấu Trúc Shared Resources
```typescript
shared/
├── components/
│   ├── ui/            # Components UI cơ bản
│   │   ├── button/
│   │   │   ├── button.tsx
│   │   │   ├── button.test.tsx
│   │   │   └── types.ts
│   │   └── input/
│   │
│   ├── layout/       # Components layout
│   │   ├── header/
│   │   └── sidebar/
│   │
│   └── data/         # Components hiển thị dữ liệu
│       └── data-table/
│
├── hooks/
│   ├── data/         # Hooks xử lý dữ liệu
│   │   ├── use-query-wrapper.ts
│   │   └── use-mutation-wrapper.ts
│   │
│   ├── ui/          # Hooks UI
│   │   ├── use-modal.ts
│   │   └── use-toast.ts
│   │
│   └── form/        # Hooks form
│       └── use-form.ts
│
└── utils/
    ├── api/         # Tiện ích API
    │   ├── api-client.ts
    │   └── error-handler.ts
    │
    ├── form/        # Tiện ích form
    │   └── validators.ts
    │
    └── date/        # Tiện ích xử lý ngày tháng
        └── formatters.ts
```

## 3. Quy Ước Đặt Tên

### 3.1 Quy Tắc Chung
- Thư mục: kebab-case
- Files: kebab-case
- Components: PascalCase
- Hooks: camelCase (prefix use)
- Types/Interfaces: PascalCase

### 3.2 Ví Dụ Cụ Thể
```typescript
// Tên thư mục
features/
├── user-management/
├── product-catalog/
└── order-processing/

// Tên file
components/
├── user-table.tsx       # Component file
├── user-table.test.tsx  # Test file
└── use-user-table.ts    # Hook file

// Trong code
// Components
export const UserTable = () => {}

// Hooks
export const useUserTable = () => {}

// Types
interface UserTableProps {}
type UserTableData = {}

// Constants
const DEFAULT_PAGE_SIZE = 10
const API_ENDPOINTS = {}
```

## 4. Tổ Chức Features

### 4.1 Tính Năng Xác Thực
```typescript
// features/auth/stores/auth-store.ts
interface AuthState {
  user: User | null
  isLoading: boolean
  error: Error | null
}

export const useAuthStore = create<AuthState>()((set) => ({
  user: null,
  isLoading: false,
  error: null,

  login: async (credentials: LoginCredentials) => {
    set({ isLoading: true })
    try {
      const user = await loginApi(credentials)
      set({ user, error: null })
    } catch (error) {
      set({ error })
    } finally {
      set({ isLoading: false })
    }
  },

  logout: () => {
    set({ user: null })
  }
}))

// features/auth/hooks/use-auth.ts
export const useAuth = () => {
  const store = useAuthStore()
  const { data: session } = useSession()

  const handleLogin = async (credentials: LoginCredentials) => {
    try {
      await store.login(credentials)
    } catch (error) {
      handleError(error)
    }
  }

  return {
    user: store.user,
    isLoading: store.isLoading,
    handleLogin,
    handleLogout: store.logout
  }
}
```

### 4.2 Tổ Chức State Management

#### 4.2.1 Global State
```typescript
// store/global/index.ts
export const useGlobalStore = create<GlobalStore>()((set) => ({
  theme: 'light',
  language: 'en',
  setTheme: (theme) => set({ theme }),
  setLanguage: (language) => set({ language })
}))
```

#### 4.2.2 Feature State
```typescript
// features/users/stores/user-store.ts
interface UserState {
  filters: UserFilters
  sorting: SortingState
  selection: RowSelectionState
  pagination: PaginationState
}

export const useUserStore = create<UserState>()((set) => ({
  filters: initialFilters,
  sorting: [],
  selection: {},
  pagination: {
    pageIndex: 0,
    pageSize: 10
  },
  
  setFilters: (filters) => set({ filters }),
  setSorting: (sorting) => set({ sorting }),
  setSelection: (selection) => set({ selection }),
  setPagination: (pagination) => set({ pagination }),
  
  reset: () => set({
    filters: initialFilters,
    sorting: [],
    selection: {},
    pagination: { pageIndex: 0, pageSize: 10 }
  })
}))
```

#### 4.2.3 Server State
```typescript
// features/users/api/queries/use-users.ts
export const useUsers = () => {
  const filters = useUserStore(state => state.filters)
  const sorting = useUserStore(state => state.sorting)
  const pagination = useUserStore(state => state.pagination)

  return useQuery({
    queryKey: ['users', filters, sorting, pagination],
    queryFn: () => fetchUsers({ filters, sorting, pagination }),
    keepPreviousData: true
  })
}

// features/users/api/mutations/use-create-user.ts
export const useCreateUser = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
      toast.success('User created successfully')
    }
  })
}
```

## 5. Mô Hình Luồng Dữ Liệu

### 5.1 Luồng Xử Lý Dữ Liệu Chuẩn
```typescript
// 1. API Layer (React Query)
const useUserData = () => {
  return useQuery({
    queryKey: ['users'],
    queryFn: () => fetchUsers()
  })
}

// 2. Store Layer (Zustand)
const useUserStore = create((set) => ({
  filters: initialFilters,
  setFilters: (filters) => set({ filters })
}))

// 3. Business Logic Layer (Custom Hooks)
const useUserManagement = () => {
  const { data, isLoading } = useUserData()
  const { filters, setFilters } = useUserStore()
  const { mutate: createUser } = useCreateUserMutation()

  const handleCreateUser = async (userData: UserInput) => {
    try {
      await createUser(userData)
    } catch (error) {
      handleError(error)
    }
  }

  return {
    users: data,
    isLoading,
    filters,
    setFilters,
    handleCreateUser
  }
}

// 4. UI Layer (Components)
const UserTable = () => {
  const {
    users,
    isLoading,
    filters,
    handleCreateUser
  } = useUserManagement()

  return (
    <div>
      <TableFilters filters={filters} />
      <DataTable 
        data={users} 
        loading={isLoading} 
      />
    </div>
  )
}
```

### 5.2 Xử Lý Mutations
```typescript
// features/users/api/mutations/use-create-user.ts
export const useCreateUser = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: UserInput) => createUserApi(data),
    onSuccess: () => {
      // Invalidate và refetch
      queryClient.invalidateQueries({ queryKey: ['users'] })
      // Hiển thị thông báo thành công
      toast.success('Người dùng đã được tạo')
    },
    onError: (error) => {
      // Xử lý lỗi
      handleError(error)
      // Hiển thị thông báo lỗi
      toast.error('Không thể tạo người dùng')
    }
  })
}
```

## 6. Triển Khai Chi Tiết

### 6.1 Data Table Với TanStack Table
```typescript
// features/users/components/user-table/user-table.tsx
export const UserTable = () => {
  const {
    data,
    isLoading,
    pageCount,
    filters,
    sorting,
    pagination,
    onPaginationChange,
    onSortingChange,
    onFiltersChange
  } = useUserTable()

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      pagination,
      columnFilters: filters
    },
    onSortingChange,
    onPaginationChange,
    onColumnFiltersChange: onFiltersChange,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    pageCount
  })

  return (
    <div>
      <TableToolbar 
        table={table}
        filters={filters}
        onFiltersChange={onFiltersChange}
      />
      
      <DataTable
        table={table}
        loading={isLoading}
      />
      
      <TablePagination
        table={table}
        pageCount={pageCount}
      />
    </div>
  )
}

// features/users/components/user-table/hooks/use-user-table.ts
export const useUserTable = () => {
  const [sorting, setSorting] = useState<SortingState>([])
  const [filters, setFilters] = useState<ColumnFiltersState>([])
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10
  })

  const { data, isLoading } = useQuery({
    queryKey: ['users', sorting, filters, pagination],
    queryFn: () => fetchUsers({
      sorting,
      filters, 
      pagination
    }),
    keepPreviousData: true
  })

  return {
    data: data?.users ?? [],
    pageCount: data?.pageCount ?? 0,
    isLoading,
    sorting,
    filters,
    pagination,
    onSortingChange: setSorting,
    onFiltersChange: setFilters,
    onPaginationChange: setPagination
  }
}
```

### 6.2 Form Handling Với React Hook Form
```typescript
// shared/hooks/use-form.ts
export const useAppForm = <TFormData extends Record<string, any>>({
  schema,
  defaultValues,
  onSubmit
}: UseFormProps<TFormData>) => {
  const form = useForm<TFormData>({
    resolver: zodResolver(schema),
    defaultValues
  })

  const handleSubmit = form.handleSubmit(async (data) => {
    try {
      await onSubmit(data)
      form.reset()
    } catch (error) {
      // Xử lý lỗi form
      if (error instanceof ValidationError) {
        error.errors.forEach(({ path, message }) => {
          form.setError(path as any, { message })
        })
      } else {
        form.setError('root', { message: error.message })
      }
    }
  })

  return {
    form,
    handleSubmit,
    isLoading: form.formState.isSubmitting,
    errors: form.formState.errors
  }
}
```

## 7. Xử Lý Lỗi và Loading States

### 7.1 Error Handling
```typescript
// shared/utils/error-handling.ts
export class ApiError extends Error {
  constructor(
    message: string,
    public code: string,
    public status: number
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

export const handleError = (error: unknown) => {
  if (error instanceof ApiError) {
    switch (error.code) {
      case 'VALIDATION_ERROR':
        toast.error('Dữ liệu không hợp lệ')
        break
      case 'UNAUTHORIZED':
        toast.error('Vui lòng đăng nhập lại')
        // Redirect to login
        break
      default:
        toast.error('Đã có lỗi xảy ra')
    }
  } else {
    toast.error('Đã có lỗi không xác định')
  }
  
  // Log error
  logger.error(error)
}
```

### 7.2 Loading States
```typescript
// shared/components/ui/loading/loading-state.tsx
interface LoadingStateProps {
  loading: boolean
  children: React.ReactNode
  fallback?: React.ReactNode
}

export const LoadingState = ({
  loading,
  children,
  fallback = <Spinner />
}: LoadingStateProps) => {
  if (loading) return fallback
  return children
}

// Usage
<LoadingState loading={isLoading}>
  <UserTable data={users} />
</LoadingState>
```

## 8. Tối Ưu Hiệu Suất

### 8.1 React Query Optimization
```typescript
// lib/react-query/query-client.ts
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 phút
      cacheTime: 1000 * 60 * 30, // 30 phút
      refetchOnWindowFocus: false,
      retry: 1,
      keepPreviousData: true
    }
  }
})

// Prefetching
const prefetchUsers = async () => {
  await queryClient.prefetchQuery({
    queryKey: ['users'],
    queryFn: fetchUsers
  })
}

// Infinite Queries
const useInfiniteUsers = () => {
  return useInfiniteQuery({
    queryKey: ['users'],
    queryFn: ({ pageParam = 0 }) => fetchUsers({ page: pageParam }),
    getNextPageParam: (lastPage) => lastPage.nextCursor
  })
}
```

### 8.2 Component Optimization
```typescript
// Memo Component
const UserRow = memo(({ user }: UserRowProps) => {
  return (
    <tr>
      <td>{user.name}</td>
      <td>{user.email}</td>
    </tr>
  )
})

// Virtualization
import { useVirtualizer } from '@tanstack/react-virtual'

export const UserList = ({ users }: UserListProps) => {
  const parentRef = useRef<HTMLDivElement>(null)

  const rowVirtualizer = useVirtualizer({
    count: users.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 50,
    overscan: 5
  })

  return (
    <div ref={parentRef} className="h-screen overflow-auto">
      <div
        style={{
          height: `${rowVirtualizer.getTotalSize()}px`,
          position: 'relative'
        }}
      >
        {rowVirtualizer.getVirtualItems().map((virtualRow) => (
          <UserRow
            key={virtualRow.index}
            user={users[virtualRow.index]}
            style={{
              position: 'absolute',
              transform: `translateY(${virtualRow.start}px)`
            }}
          />
        ))}
      </div>
    </div>
  )
}
```

### 8.3 Code Splitting và Dynamic Imports
```typescript
// Dynamic Component Import
const UserAnalytics = dynamic(() => import('./user-analytics'), {
  loading: () => <LoadingSpinner />,
  ssr: false
})

// Route-based Code Splitting
export default async function AnalyticsPage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <UserAnalytics />
    </Suspense>
  )
}
```

## 9. Testing Strategy

### 9.1 Unit Testing Components
```typescript
// features/users/components/user-table/user-table.test.tsx
describe('UserTable', () => {
  const mockUsers = [
    { id: 1, name: 'User 1', email: 'user1@example.com' },
    { id: 2, name: 'User 2', email: 'user2@example.com' }
  ]

  it('hiển thị danh sách người dùng', () => {
    render(<UserTable users={mockUsers} />)
    expect(screen.getByText('User 1')).toBeInTheDocument()
    expect(screen.getByText('User 2')).toBeInTheDocument()
  })

  it('xử lý phân trang', () => {
    const onPageChange = jest.fn()
    render(
      <UserTable 
        users={mockUsers}
        onPageChange={onPageChange}
      />
    )
    
    fireEvent.click(screen.getByText('Next'))
    expect(onPageChange).toHaveBeenCalled()
  })
})
```

### 9.2 Integration Testing
```typescript
describe('Auth Flow', () => {
  it('xử lý luồng đăng nhập', async () => {
    render(
      <AuthProvider>
        <LoginForm />
      </AuthProvider>
    )

    fireEvent.change(
      screen.getByLabelText('Email'),
      { target: { value: 'test@example.com' }}
    )
    
    fireEvent.change(
      screen.getByLabelText('Password'),
      { target: { value: 'password123' }}
    )

    fireEvent.click(screen.getByText('Đăng nhập'))

    await waitFor(() => {
      expect(screen.getByText('Đăng nhập thành công')).toBeInTheDocument()
    })
  })
})
```

### 9.3 API Mocking
```typescript
// shared/test/mocks/handlers.ts
export const handlers = [
  rest.post('/api/auth/login', (req, res, ctx) => {
    return res(
      ctx.json({
        user: {
          id: 1,
          name: 'Test User'
        },
        token: 'fake-token'
      })
    )
  }),

  rest.get('/api/users', (req, res, ctx) => {
    return res(
      ctx.json({
        users: [
          { id: 1, name: 'User 1' },
          { id: 2, name: 'User 2' }
        ],
        total: 2
      })
    )
  })
]

// Test Setup
export const server = setupServer(...handlers)

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())
```

## 10. Deployment và Configuration

### 10.1 Environment Variables
```typescript
// src/env.mjs
export const env = createEnv({
  server: {
    DATABASE_URL: z.string().url(),
    API_KEY: z.string().min(1),
    NEXTAUTH_URL: z.string().url(),
    NEXTAUTH_SECRET: z.string().min(1)
  },
  client: {
    NEXT_PUBLIC_API_URL: z.string().url(),
    NEXT_PUBLIC_WS_URL: z.string().url()
  },
  runtimeEnv: {
    DATABASE_URL: process.env.DATABASE_URL,
    API_KEY: process.env.API_KEY,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_WS_URL: process.env.NEXT_PUBLIC_WS_URL
  }
})
```

### 10.2 Next.js Config
```typescript
// next.config.mjs
import { withAxiom } from 'next-axiom'

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['assets.example.com'],
    formats: ['image/avif', 'image/webp']
  },
  experimental: {
    serverActions: true
  },
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,DELETE,PATCH,POST,PUT' }
        ]
      }
    ]
  }
}

export default withAxiom(nextConfig)
```

### 10.3 CI/CD Workflow
```yaml
# .github/workflows/main.yml
name: CI/CD

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Lint
        run: npm run lint
      
      - name: Type check
        run: npm run type-check
      
      - name: Test
        run: npm run test

  build:
    needs: validate
    runs-on: ubuntu-latest
    steps:
      - name: Build
        run: npm run build
      
      - name: Deploy
        # Các bước deploy tùy theo platform
```

## 11. Best Practices

### 11.1 Code Organization
- **Modular Structure**: Tổ chức code theo tính năng
- **Separation of Concerns**: Tách biệt UI, logic, và data layers
- **Consistent Naming**: Tuân thủ quy ước đặt tên
- **Type Safety**: Sử dụng TypeScript nghiêm ngặt
- **Clean Code**: Giữ components và functions nhỏ gọn, dễ hiểu

### 11.2 State Management
- **Server State**: Sử dụng React Query cho server state
- **Client State**: Zustand cho global và feature state
- **Form State**: React Hook Form cho form management
- **Local State**: useState cho UI state đơn giản
- **Optimistic Updates**: Implement cho UX tốt hơn

### 11.3 Performance
- **Code Splitting**: Lazy load components và routes
- **Caching**: Cấu hình React Query caching hợp lý
- **Memoization**: Sử dụng memo, useMemo, useCallback đúng cách
- **Bundle Size**: Optimizing imports và dependencies
- **Image Optimization**: Sử dụng Next.js Image component

### 11.4 Testing
- **Unit Tests**: Test individual components và functions
- **Integration Tests**: Test feature flows
- **E2E Tests**: Test critical user journeys
- **Test Coverage**: Maintain good coverage
- **Testing Best Practices**: Follow testing pyramid

### 11.5 Error Handling
- **Error Boundaries**: Catch và xử lý React errors
- **API Errors**: Proper handling và display
- **Form Validation**: Client và server validation
- **User Feedback**: Clear error messages
- **Error Logging**: Track và monitor errors

Đây là một kiến trúc toàn diện cho các ứng dụng Next.js quy mô lớn. Nó cung cấp:
- Cấu trúc rõ ràng và có thể mở rộng
- Tái sử dụng code hiệu quả
- Hiệu suất tốt
- Developer experience tốt
- Maintainability dài hạn

Tuy nhiên, cần lưu ý:
- Không phải mọi dự án đều cần structure phức tạp này
- Có thể điều chỉnh cho phù hợp với nhu cầu cụ thể
- Cần cân nhắc trade-offs giữa complexity và flexibility
- Documentation tốt là rất quan trọng
