import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { employees as mockEmployees } from '@/data/mockData'

export const useEmployeeStore = defineStore('employee', () => {
  const employees = ref([...mockEmployees])

  const activeEmployees = computed(() => employees.value.filter(e => e.status === 'active'))
  const salesStaff = computed(() => employees.value.filter(e => e.role === 'sales'))

  function getEmployeeById(id) {
    return employees.value.find(e => e.id === parseInt(id))
  }

  function addEmployee(employee) {
    const newId = Math.max(...employees.value.map(e => e.id)) + 1
    employees.value.push({
      ...employee,
      id: newId,
      hireDate: new Date().toISOString().split('T')[0],
      salesCount: 0,
      totalRevenue: 0,
      commission: 0
    })
    return newId
  }

  function updateEmployee(id, updates) {
    const index = employees.value.findIndex(e => e.id === parseInt(id))
    if (index !== -1) {
      employees.value[index] = { ...employees.value[index], ...updates }
      return true
    }
    return false
  }

  function deleteEmployee(id) {
    const index = employees.value.findIndex(e => e.id === parseInt(id))
    if (index !== -1) {
      employees.value.splice(index, 1)
      return true
    }
    return false
  }

  return {
    employees,
    activeEmployees,
    salesStaff,
    getEmployeeById,
    addEmployee,
    updateEmployee,
    deleteEmployee
  }
})
