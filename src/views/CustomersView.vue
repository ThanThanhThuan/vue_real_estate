<template>
  <div class="customers-page">
    <div class="page-header">
      <h1 class="page-title">{{ t('customers.title') }}</h1>
      <button class="btn btn-primary" @click="showAddModal = true">
        + {{ t('customers.addCustomer') }}
      </button>
    </div>

    <div class="stats-grid mb-3">
      <div class="stat-card">
        <div class="stat-icon primary">
          <span>👥</span>
        </div>
        <div class="stat-content">
          <h4>{{ t('dashboard.totalCustomers') }}</h4>
          <div class="stat-value">{{ customerStore.totalCustomers }}</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon success">
          <span>✓</span>
        </div>
        <div class="stat-content">
          <h4>{{ t('dashboard.active') }}</h4>
          <div class="stat-value">{{ customerStore.active.length }}</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon warning">
          <span>🔥</span>
        </div>
        <div class="stat-content">
          <h4>{{ t('customers.lead') }}</h4>
          <div class="stat-value">{{ customerStore.leads.length }}</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon info">
          <span>🏁</span>
        </div>
        <div class="stat-content">
          <h4>{{ t('customers.closed') }}</h4>
          <div class="stat-value">{{ customerStore.closed.length }}</div>
        </div>
      </div>
    </div>

    <div class="filters">
      <select v-model="statusFilter" class="filter-select">
        <option value="">{{ t('customers.allStatus') }}</option>
        <option value="lead">{{ t('customers.lead') }}</option>
        <option value="active">{{ t('dashboard.active') }}</option>
        <option value="closed">{{ t('customers.closed') }}</option>
      </select>
    </div>

    <div class="search-bar">
      <input 
        type="text" 
        v-model="searchQuery"
        class="search-input"
        :placeholder="t('customers.searchCustomers')"
      >
    </div>

    <div class="card">
      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th>{{ t('common.name') }}</th>
              <th>{{ t('common.email') }}</th>
              <th>{{ t('common.phone') }}</th>
              <th>{{ t('customers.interestedType') }}</th>
              <th>{{ t('customers.budget') }}</th>
              <th>{{ t('common.status') }}</th>
              <th>{{ t('customers.assignedTo') }}</th>
              <th>{{ t('common.actions') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="customer in filteredCustomers" :key="customer.id">
              <td>
                <router-link :to="`/customers/${customer.id}`" class="customer-name">
                  {{ customer.name }}
                </router-link>
              </td>
              <td>{{ customer.email }}</td>
              <td>{{ customer.phone }}</td>
              <td>{{ customer.interestedType }}</td>
              <td>${{ formatNumber(customer.budgetMin) }} - ${{ formatNumber(customer.budgetMax) }}</td>
              <td>
                <span class="badge" :class="getStatusClass(customer.status)">
                  {{ t(`customers.${customer.status}`) }}
                </span>
              </td>
              <td>{{ getEmployeeName(customer.assignedTo) }}</td>
              <td>
                <div class="action-buttons">
                  <router-link :to="`/customers/${customer.id}`" class="action-btn">
                    {{ t('common.view') }}
                  </router-link>
                  <button class="action-btn" @click="editCustomer(customer)">{{ t('common.edit') }}</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-if="filteredCustomers.length === 0" class="empty-state">
        <p>{{ t('common.noData') }}</p>
      </div>
    </div>

    <!-- Add/Edit Customer Modal -->
    <div v-if="showAddModal" class="modal-overlay" @click.self="closeModal">
      <div class="modal">
        <div class="modal-header">
          <h3 class="modal-title">{{ editingCustomer ? t('customers.editCustomer') : t('customers.addNewCustomer') }}</h3>
          <button class="modal-close" @click="closeModal">×</button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label class="form-label">{{ t('common.name') }}</label>
            <input type="text" v-model="customerForm.name" class="form-input" required>
          </div>
          <div class="grid-2">
            <div class="form-group">
              <label class="form-label">{{ t('common.email') }}</label>
              <input type="email" v-model="customerForm.email" class="form-input" required>
            </div>
            <div class="form-group">
              <label class="form-label">{{ t('common.phone') }}</label>
              <input type="tel" v-model="customerForm.phone" class="form-input" required>
            </div>
          </div>
          <div class="grid-2">
            <div class="form-group">
              <label class="form-label">{{ t('common.status') }}</label>
              <select v-model="customerForm.status" class="form-input">
                <option value="lead">{{ t('customers.lead') }}</option>
                <option value="active">{{ t('dashboard.active') }}</option>
                <option value="closed">{{ t('customers.closed') }}</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">{{ t('customers.assignedTo') }}</label>
              <select v-model="customerForm.assignedTo" class="form-input">
                <option v-for="emp in employeeStore.employees" :key="emp.id" :value="emp.id">
                  {{ emp.name }}
                </option>
              </select>
            </div>
          </div>
          <div class="grid-2">
            <div class="form-group">
              <label class="form-label">{{ t('customers.interestedType') }}</label>
              <select v-model="customerForm.interestedType" class="form-input">
                <option value="Apartment">{{ t('inventory.apartment') }}</option>
                <option value="House">{{ t('inventory.house') }}</option>
                <option value="Villa">{{ t('inventory.villa') }}</option>
                <option value="Commercial">{{ t('inventory.commercial') }}</option>
                <option value="Land">{{ t('inventory.land') }}</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">{{ t('customers.budget') }}</label>
              <div class="flex gap-1">
                <input type="number" v-model="customerForm.budgetMin" class="form-input" :placeholder="t('customers.budget') + ' Min'">
                <input type="number" v-model="customerForm.budgetMax" class="form-input" :placeholder="t('customers.budget') + ' Max'">
              </div>
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">{{ t('customers.notes') }}</label>
            <textarea v-model="customerForm.notes" class="form-input"></textarea>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" @click="closeModal">{{ t('common.cancel') }}</button>
          <button class="btn btn-primary" @click="saveCustomer">
            {{ editingCustomer ? t('common.update') : t('common.add') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useCustomerStore } from '@/stores/customer'
import { useEmployeeStore } from '@/stores/employee'
import { useAuthStore } from '@/stores/auth'

const { t } = useI18n()
const customerStore = useCustomerStore()
const employeeStore = useEmployeeStore()
const authStore = useAuthStore()

const searchQuery = ref('')
const statusFilter = ref('')
const showAddModal = ref(false)
const editingCustomer = ref(null)

const customerForm = ref({
  name: '',
  email: '',
  phone: '',
  status: 'lead',
  interestedType: 'Apartment',
  budgetMin: 0,
  budgetMax: 0,
  notes: '',
  assignedTo: authStore.user?.id
})

const filteredCustomers = computed(() => {
  let result = [...customerStore.customers]

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(c => 
      c.name.toLowerCase().includes(query) ||
      c.email.toLowerCase().includes(query) ||
      c.phone.includes(query)
    )
  }

  if (statusFilter.value) {
    result = result.filter(c => c.status === statusFilter.value)
  }

  if (authStore.isSales) {
    result = result.filter(c => c.assignedTo === authStore.user?.id)
  }

  return result
})

const formatNumber = (num) => num ? num.toLocaleString() : '0'

const getStatusClass = (status) => ({
  lead: 'badge-warning',
  active: 'badge-success',
  closed: 'badge-danger'
})[status] || 'badge-info'

const getEmployeeName = (id) => employeeStore.getEmployeeById(id)?.name || 'Unknown'

const editCustomer = (customer) => {
  editingCustomer.value = customer
  customerForm.value = { ...customer }
  showAddModal.value = true
}

const closeModal = () => {
  showAddModal.value = false
  editingCustomer.value = null
  customerForm.value = {
    name: '',
    email: '',
    phone: '',
    status: 'lead',
    interestedType: 'Apartment',
    budgetMin: 0,
    budgetMax: 0,
    notes: '',
    assignedTo: authStore.user?.id
  }
}

const saveCustomer = () => {
  if (editingCustomer.value) {
    customerStore.updateCustomer(editingCustomer.value.id, customerForm.value)
  } else {
    customerStore.addCustomer(customerForm.value)
  }
  closeModal()
}
</script>

<style scoped>
.customer-name {
  font-weight: 600;
  color: var(--accent);
}
</style>
