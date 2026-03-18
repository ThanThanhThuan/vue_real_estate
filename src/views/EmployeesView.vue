<template>
  <div class="employees-page">
    <div class="page-header">
      <h1 class="page-title">{{ t('employees.title') }}</h1>
      <button class="btn btn-primary" @click="showAddModal = true" v-if="authStore.isAdmin">
        + {{ t('employees.addEmployee') }}
      </button>
    </div>

    <div class="stats-grid mb-3">
      <div class="stat-card">
        <div class="stat-icon primary">
          <span>👔</span>
        </div>
        <div class="stat-content">
          <h4>{{ t('employees.totalEmployees') }}</h4>
          <div class="stat-value">{{ employeeStore.employees.length }}</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon success">
          <span>✓</span>
        </div>
        <div class="stat-content">
          <h4>{{ t('employees.active') }}</h4>
          <div class="stat-value">{{ employeeStore.activeEmployees.length }}</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon warning">
          <span>💼</span>
        </div>
        <div class="stat-content">
          <h4>{{ t('employees.salesStaff') }}</h4>
          <div class="stat-value">{{ employeeStore.salesStaff.length }}</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon info">
          <span>💰</span>
        </div>
        <div class="stat-content">
          <h4>{{ t('employees.totalRevenue') }}</h4>
          <div class="stat-value">${{ formatNumber(totalRevenue) }}</div>
        </div>
      </div>
    </div>

    <div class="filters">
      <select v-model="roleFilter" class="filter-select">
        <option value="">{{ t('employees.allRoles') }}</option>
        <option value="admin">{{ t('employees.admin') }}</option>
        <option value="management">{{ t('employees.management') }}</option>
        <option value="sales">{{ t('employees.sales') }}</option>
      </select>
      <select v-model="statusFilter" class="filter-select">
        <option value="">{{ t('employees.allStatus') }}</option>
        <option value="active">{{ t('employees.active') }}</option>
        <option value="inactive">{{ t('employees.inactive') }}</option>
      </select>
    </div>

    <div class="card">
      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th>{{ t('common.name') }}</th>
              <th>{{ t('common.email') }}</th>
              <th>{{ t('employees.role') }}</th>
              <th>{{ t('employees.status') }}</th>
              <th>{{ t('employees.sales') }}</th>
              <th>{{ t('employees.revenue') }}</th>
              <th>{{ t('employees.commission') }}</th>
              <th>{{ t('common.actions') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="emp in filteredEmployees" :key="emp.id">
              <td>
                <router-link :to="`/employees/${emp.id}`" class="employee-name">
                  {{ emp.name }}
                </router-link>
              </td>
              <td>{{ emp.email }}</td>
              <td>
                <span class="badge" :class="getRoleClass(emp.role)">{{ t(`roles.${emp.role}`) }}</span>
              </td>
              <td>
                <span class="badge" :class="emp.status === 'active' ? 'badge-success' : 'badge-danger'">
                  {{ t(`employees.${emp.status}`) }}
                </span>
              </td>
              <td>{{ emp.salesCount }}</td>
              <td>${{ formatNumber(emp.totalRevenue) }}</td>
              <td>${{ formatNumber(emp.commission) }}</td>
              <td>
                <div class="action-buttons">
                  <router-link :to="`/employees/${emp.id}`" class="action-btn">{{ t('common.view') }}</router-link>
                  <button v-if="authStore.isAdmin" class="action-btn" @click="editEmployee(emp)">{{ t('common.edit') }}</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Add/Edit Employee Modal -->
    <div v-if="showAddModal" class="modal-overlay" @click.self="closeModal">
      <div class="modal">
        <div class="modal-header">
          <h3 class="modal-title">{{ editingEmployee ? t('employees.editEmployee') : t('employees.addNewEmployee') }}</h3>
          <button class="modal-close" @click="closeModal">×</button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label class="form-label">{{ t('common.name') }}</label>
            <input type="text" v-model="employeeForm.name" class="form-input" required>
          </div>
          <div class="grid-2">
            <div class="form-group">
              <label class="form-label">{{ t('common.email') }}</label>
              <input type="email" v-model="employeeForm.email" class="form-input" required>
            </div>
            <div class="form-group">
              <label class="form-label">{{ t('common.phone') }}</label>
              <input type="tel" v-model="employeeForm.phone" class="form-input">
            </div>
          </div>
          <div class="grid-2">
            <div class="form-group">
              <label class="form-label">{{ t('employees.role') }}</label>
              <select v-model="employeeForm.role" class="form-input">
                <option value="admin">{{ t('employees.admin') }}</option>
                <option value="management">{{ t('employees.management') }}</option>
                <option value="sales">{{ t('employees.sales') }}</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">{{ t('employees.status') }}</label>
              <select v-model="employeeForm.status" class="form-input">
                <option value="active">{{ t('employees.active') }}</option>
                <option value="inactive">{{ t('employees.inactive') }}</option>
              </select>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" @click="closeModal">Cancel</button>
          <button class="btn btn-primary" @click="saveEmployee">
            {{ editingEmployee ? 'Update' : 'Add' }} Employee
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useEmployeeStore } from '@/stores/employee'
import { useAuthStore } from '@/stores/auth'

const { t } = useI18n()
const employeeStore = useEmployeeStore()
const authStore = useAuthStore()

const roleFilter = ref('')
const statusFilter = ref('')
const showAddModal = ref(false)
const editingEmployee = ref(null)

const employeeForm = ref({
  name: '',
  email: '',
  phone: '',
  role: 'sales',
  status: 'active'
})

const totalRevenue = computed(() => {
  return employeeStore.employees.reduce((sum, e) => sum + e.totalRevenue, 0)
})

const filteredEmployees = computed(() => {
  let result = [...employeeStore.employees]
  if (roleFilter.value) result = result.filter(e => e.role === roleFilter.value)
  if (statusFilter.value) result = result.filter(e => e.status === statusFilter.value)
  return result
})

const formatNumber = (num) => num ? num.toLocaleString() : '0'

const getRoleClass = (role) => ({
  admin: 'badge-danger',
  management: 'badge-warning',
  sales: 'badge-success'
})[role] || 'badge-info'

const editEmployee = (emp) => {
  editingEmployee.value = emp
  employeeForm.value = { ...emp }
  showAddModal.value = true
}

const closeModal = () => {
  showAddModal.value = false
  editingEmployee.value = null
  employeeForm.value = { name: '', email: '', phone: '', role: 'sales', status: 'active' }
}

const saveEmployee = () => {
  if (editingEmployee.value) {
    employeeStore.updateEmployee(editingEmployee.value.id, employeeForm.value)
  } else {
    employeeStore.addEmployee(employeeForm.value)
  }
  closeModal()
}
</script>

<style scoped>
.employee-name {
  font-weight: 600;
  color: var(--accent);
}
</style>
