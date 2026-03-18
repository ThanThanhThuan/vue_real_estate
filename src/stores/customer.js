import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { customers as mockCustomers } from '@/data/mockData'
import { useAuthStore } from './auth'

export const useCustomerStore = defineStore('customer', () => {
  const customers = ref([...mockCustomers])

  const active = computed(() => customers.value.filter(c => c.status === 'active'))
  const leads = computed(() => customers.value.filter(c => c.status === 'lead'))
  const closed = computed(() => customers.value.filter(c => c.status === 'closed'))

  const totalCustomers = computed(() => customers.value.length)

  function getCustomerById(id) {
    return customers.value.find(c => c.id === parseInt(id))
  }

  function getCustomersBySalesPerson(salesPersonId) {
    const authStore = useAuthStore()
    if (authStore.isAdmin || authStore.isManagement) {
      return customers.value.filter(c => c.assignedTo === salesPersonId)
    }
    return customers.value.filter(c => c.assignedTo === authStore.user?.id)
  }

  function addCustomer(customer) {
    const newId = Math.max(...customers.value.map(c => c.id)) + 1
    customers.value.push({
      ...customer,
      id: newId,
      createdAt: new Date().toISOString().split('T')[0]
    })
    return newId
  }

  function updateCustomer(id, updates) {
    const index = customers.value.findIndex(c => c.id === parseInt(id))
    if (index !== -1) {
      customers.value[index] = { ...customers.value[index], ...updates }
      return true
    }
    return false
  }

  function deleteCustomer(id) {
    const index = customers.value.findIndex(c => c.id === parseInt(id))
    if (index !== -1) {
      customers.value.splice(index, 1)
      return true
    }
    return false
  }

  return {
    customers,
    active,
    leads,
    closed,
    totalCustomers,
    getCustomerById,
    getCustomersBySalesPerson,
    addCustomer,
    updateCustomer,
    deleteCustomer
  }
})
