import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(JSON.parse(localStorage.getItem('user') || 'null'))
  
  const isAuthenticated = computed(() => !!user.value)
  
  const role = computed(() => user.value?.role || null)
  const isAdmin = computed(() => role.value === 'admin')
  const isManagement = computed(() => role.value === 'management')
  const isSales = computed(() => role.value === 'sales')

  function login(username, password) {
    const users = {
      'admin': { id: 1, username: 'admin', password: 'admin123', name: 'Admin User', role: 'admin', email: 'admin@realestate.com' },
      'manager': { id: 2, username: 'manager', password: 'manager123', name: 'Sarah Johnson', role: 'management', email: 'sarah@realestate.com' },
      'sales': { id: 3, username: 'sales', password: 'sales123', name: 'Mike Chen', role: 'sales', email: 'mike@realestate.com' }
    }
    
    const foundUser = Object.values(users).find(u => u.username === username && u.password === password)
    
    if (foundUser) {
      user.value = foundUser
      localStorage.setItem('user', JSON.stringify(foundUser))
      return { success: true, user: foundUser }
    }
    
    return { success: false, message: 'Invalid credentials' }
  }

  function logout() {
    user.value = null
    localStorage.removeItem('user')
  }

  return {
    user,
    isAuthenticated,
    role,
    isAdmin,
    isManagement,
    isSales,
    login,
    logout
  }
})
