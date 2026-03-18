<template>
  <div class="app-layout">
    <aside class="sidebar" :class="{ collapsed: sidebarCollapsed }">
      <div class="sidebar-header">
        <div class="logo">
          <span class="logo-icon">🏠</span>
          <span v-if="!sidebarCollapsed" class="logo-text">RealEstate THUAN</span>
        </div>
      </div>

      <nav class="sidebar-nav">
        <router-link 
          v-for="item in menuItems" 
          :key="item.path"
          :to="item.path"
          class="nav-item"
          :class="{ active: isActive(item.path) }"
          v-show="canAccess(item.roles)"
        >
          <span class="nav-icon">{{ item.icon }}</span>
          <span v-if="!sidebarCollapsed" class="nav-label">{{ t(item.label) }}</span>
        </router-link>
      </nav>

      <div class="sidebar-footer">
        <button class="collapse-btn" @click="sidebarCollapsed = !sidebarCollapsed">
          {{ sidebarCollapsed ? '→' : '←' }}
        </button>
      </div>
    </aside>

    <main class="main-content">
      <header class="top-header">
        <div class="header-left">
          <h2 class="page-title">{{ currentPageTitle }}</h2>
        </div>
        <div class="header-right">
          <LanguageSwitcher />
          <div class="user-info">
            <span class="user-name">{{ authStore.user?.name }}</span>
            <span class="user-role badge" :class="getRoleBadgeClass(authStore.user?.role)">
              {{ t(`roles.${authStore.user?.role}`) }}
            </span>
          </div>
          <button class="logout-btn" @click="handleLogout">
            {{ t('common.logout') }}
          </button>
        </div>
      </header>

      <div class="page-content">
        <router-view />
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '@/stores/auth'
import LanguageSwitcher from '@/components/common/LanguageSwitcher.vue'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const sidebarCollapsed = ref(false)

const menuItems = [
  { path: '/', label: 'menu.dashboard', icon: '📊', roles: ['admin', 'management', 'sales'] },
  { path: '/inventory', label: 'menu.inventory', icon: '🏠', roles: ['admin', 'management', 'sales'] },
  { path: '/customers', label: 'menu.customers', icon: '👥', roles: ['admin', 'management', 'sales'] },
  { path: '/transactions', label: 'menu.transactions', icon: '💰', roles: ['admin', 'management', 'sales'] },
  { path: '/employees', label: 'menu.employees', icon: '👔', roles: ['admin', 'management'] },
  { path: '/contracts/new', label: 'menu.contracts', icon: '📄', roles: ['admin', 'management', 'sales'] }
]

const currentPageTitle = computed(() => {
  const item = menuItems.find(m => m.path === route.path)
  if (item) return t(item.label)
  if (route.path.includes('/inventory/')) return t('inventory.propertyDetails')
  if (route.path.includes('/customers/')) return t('customers.customerDetails')
  if (route.path.includes('/transactions/')) return t('transactions.transactionDetails')
  if (route.path.includes('/employees/')) return t('employees.employeeDetails')
  return t('menu.dashboard')
})

const isActive = (path) => {
  if (path === '/') return route.path === '/'
  return route.path.startsWith(path)
}

const canAccess = (roles) => {
  if (!roles) return true
  return roles.includes(authStore.user?.role)
}

const getRoleBadgeClass = (role) => {
  const classes = {
    admin: 'badge-danger',
    management: 'badge-warning',
    sales: 'badge-success'
  }
  return classes[role] || 'badge-info'
}

const handleLogout = () => {
  authStore.logout()
  router.push('/login')
}
</script>

<style scoped>
.sidebar {
  width: 280px;
  background: var(--primary);
  border-right: 1px solid var(--border);
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  display: flex;
  flex-direction: column;
  transition: width 0.3s ease;
  z-index: 100;
}

.sidebar.collapsed {
  width: 80px;
}

.sidebar-header {
  padding: 20px;
  border-bottom: 1px solid var(--border);
}

.logo {
  display: flex;
  align-items: center;
  gap: 12px;
}

.logo-icon {
  font-size: 28px;
}

.logo-text {
  font-family: 'Outfit', sans-serif;
  font-size: 20px;
  font-weight: 700;
  color: var(--text-primary);
}

.sidebar-nav {
  flex: 1;
  padding: 16px 12px;
  overflow-y: auto;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border-radius: var(--radius-md);
  color: var(--text-secondary);
  margin-bottom: 4px;
  transition: all 0.3s ease;
  text-decoration: none;
}

.nav-item:hover {
  background: rgba(233, 69, 96, 0.1);
  color: var(--text-primary);
}

.nav-item.active {
  background: rgba(233, 69, 96, 0.15);
  color: var(--accent);
  border-left: 3px solid var(--accent);
}

.nav-icon {
  font-size: 20px;
  width: 24px;
  text-align: center;
}

.nav-label {
  font-weight: 500;
}

.sidebar-footer {
  padding: 16px;
  border-top: 1px solid var(--border);
}

.collapse-btn {
  width: 100%;
  padding: 10px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  color: var(--text-secondary);
  cursor: pointer;
}

.collapse-btn:hover {
  background: var(--secondary);
}

.top-header {
  position: fixed;
  top: 0;
  left: 280px;
  right: 0;
  height: 64px;
  background: var(--primary);
  border-bottom: 1px solid var(--border);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  z-index: 50;
  transition: left 0.3s ease;
}

.sidebar.collapsed + .main-content .top-header {
  left: 80px;
}

.header-left {
  display: flex;
  align-items: center;
}

.page-title {
  font-size: 20px;
  font-weight: 600;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 20px;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.user-name {
  font-weight: 500;
}

.user-role {
  text-transform: capitalize;
}

.logout-btn {
  padding: 8px 16px;
  background: transparent;
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.3s ease;
}

.logout-btn:hover {
  border-color: var(--danger);
  color: var(--danger);
}

.page-content {
  padding: 24px;
  padding-top: 88px;
}

@media (max-width: 1199px) {
  .sidebar {
    width: 80px;
  }
  
  .sidebar .logo-text,
  .sidebar .nav-label {
    display: none;
  }
  
  .top-header {
    left: 80px;
  }
}

@media (max-width: 768px) {
  .sidebar {
    transform: translateX(-100%);
  }
  
  .top-header {
    left: 0;
  }
}
</style>
