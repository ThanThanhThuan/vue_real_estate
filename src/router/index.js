import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/LoginView.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/',
    component: () => import('@/components/layout/MainLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        name: 'Dashboard',
        component: () => import('@/views/DashboardView.vue')
      },
      {
        path: 'inventory',
        name: 'Inventory',
        component: () => import('@/views/InventoryView.vue'),
        meta: { roles: ['admin', 'management', 'sales'] }
      },
      {
        path: 'inventory/:id',
        name: 'PropertyDetail',
        component: () => import('@/views/PropertyDetailView.vue'),
        meta: { roles: ['admin', 'management', 'sales'] }
      },
      {
        path: 'customers',
        name: 'Customers',
        component: () => import('@/views/CustomersView.vue'),
        meta: { roles: ['admin', 'management', 'sales'] }
      },
      {
        path: 'customers/:id',
        name: 'CustomerDetail',
        component: () => import('@/views/CustomerDetailView.vue'),
        meta: { roles: ['admin', 'management', 'sales'] }
      },
      {
        path: 'transactions',
        name: 'Transactions',
        component: () => import('@/views/TransactionsView.vue'),
        meta: { roles: ['admin', 'management', 'sales'] }
      },
      {
        path: 'transactions/:id',
        name: 'TransactionDetail',
        component: () => import('@/views/TransactionDetailView.vue'),
        meta: { roles: ['admin', 'management', 'sales'] }
      },
      {
        path: 'employees',
        name: 'Employees',
        component: () => import('@/views/EmployeesView.vue'),
        meta: { roles: ['admin', 'management'] }
      },
      {
        path: 'employees/:id',
        name: 'EmployeeDetail',
        component: () => import('@/views/EmployeeDetailView.vue'),
        meta: { roles: ['admin', 'management'] }
      },
      {
        path: 'contracts/new',
        name: 'NewContract',
        component: () => import('@/views/ContractView.vue'),
        meta: { roles: ['admin', 'management', 'sales'] }
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from) => {
  const authStore = useAuthStore()
  
  if (to.meta.requiresAuth !== false && !authStore.isAuthenticated) {
    return '/login'
  }
  
  if (to.path === '/login' && authStore.isAuthenticated) {
    return '/'
  }
  
  if (to.meta.roles && !to.meta.roles.includes(authStore.user?.role)) {
    return '/'
  }
  
  return true
})

export default router
