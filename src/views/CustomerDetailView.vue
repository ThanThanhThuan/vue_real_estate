<template>
  <div class="customer-detail" v-if="customer">
    <div class="page-header">
      <div>
        <router-link to="/customers" class="back-link">← {{ t('common.back') }}</router-link>
        <h1 class="page-title">{{ customer.name }}</h1>
      </div>
      <div class="action-buttons">
        <button class="btn btn-secondary" @click="showEditModal = true">{{ t('common.edit') }}</button>
        <button class="btn btn-danger" @click="deleteCustomer">{{ t('common.delete') }}</button>
      </div>
    </div>

    <div class="grid-2">
      <div class="card">
        <h3 class="card-title mb-2">{{ t('customers.contactInfo') }}</h3>
        <div class="detail-row">
          <span class="detail-label">{{ t('common.email') }}</span>
          <span class="detail-value">{{ customer.email }}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">{{ t('common.phone') }}</span>
          <span class="detail-value">{{ customer.phone }}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">{{ t('common.status') }}</span>
          <span class="badge" :class="getStatusClass(customer.status)">{{ t(`customers.${customer.status}`) }}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">{{ t('customers.assignedTo') }}</span>
          <span class="detail-value">{{ assignedTo?.name || '-' }}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">{{ t('inventory.createdAt') }}</span>
          <span class="detail-value">{{ customer.createdAt }}</span>
        </div>
        
        <div v-if="customer.notes" class="mt-3">
          <h4 class="mb-1">{{ t('customers.notes') }}</h4>
          <p class="text-muted">{{ customer.notes }}</p>
        </div>
      </div>

      <div class="card">
        <h3 class="card-title mb-2">{{ t('customers.preferences') }}</h3>
        <div class="detail-row">
          <span class="detail-label">{{ t('customers.interestedType') }}</span>
          <span class="detail-value">{{ customer.interestedType }}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">{{ t('customers.budget') }}</span>
          <span class="detail-value">${{ formatNumber(customer.budgetMin) }} - ${{ formatNumber(customer.budgetMax) }}</span>
        </div>
      </div>
    </div>

    <div class="card mt-3" v-if="customerTransactions.length">
      <h3 class="card-title mb-2">{{ t('inventory.transactionHistory') }}</h3>
      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th>{{ t('transactions.property') }}</th>
              <th>{{ t('transactions.amount') }}</th>
              <th>{{ t('transactions.paid') }}</th>
              <th>{{ t('common.status') }}</th>
              <th>{{ t('common.date') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="tx in customerTransactions" :key="tx.id">
              <td>{{ getPropertyName(tx.propertyId) }}</td>
              <td>${{ formatNumber(tx.totalAmount) }}</td>
              <td>${{ formatNumber(tx.paidAmount) }}</td>
              <td>
                <span class="badge" :class="getTransactionStatusClass(tx.status)">
                  {{ t(`transactions.${tx.status}`) }}
                </span>
              </td>
              <td>{{ tx.createdAt }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div v-if="showEditModal" class="modal-overlay" @click.self="showEditModal = false">
      <div class="modal">
        <div class="modal-header">
          <h3 class="modal-title">{{ t('customers.editCustomer') }}</h3>
          <button class="modal-close" @click="showEditModal = false">×</button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label class="form-label">{{ t('common.name') }}</label>
            <input type="text" v-model="editForm.name" class="form-input">
          </div>
          <div class="grid-2">
            <div class="form-group">
              <label class="form-label">{{ t('common.email') }}</label>
              <input type="email" v-model="editForm.email" class="form-input">
            </div>
            <div class="form-group">
              <label class="form-label">{{ t('common.phone') }}</label>
              <input type="tel" v-model="editForm.phone" class="form-input">
            </div>
          </div>
          <div class="grid-2">
            <div class="form-group">
              <label class="form-label">{{ t('common.status') }}</label>
              <select v-model="editForm.status" class="form-input">
                <option value="lead">{{ t('customers.lead') }}</option>
                <option value="active">{{ t('dashboard.active') }}</option>
                <option value="closed">{{ t('customers.closed') }}</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">{{ t('customers.interestedType') }}</label>
              <select v-model="editForm.interestedType" class="form-input">
                <option value="Apartment">{{ t('inventory.apartment') }}</option>
                <option value="House">{{ t('inventory.house') }}</option>
                <option value="Villa">{{ t('inventory.villa') }}</option>
                <option value="Commercial">{{ t('inventory.commercial') }}</option>
                <option value="Land">{{ t('inventory.land') }}</option>
              </select>
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">{{ t('customers.notes') }}</label>
            <textarea v-model="editForm.notes" class="form-input"></textarea>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" @click="showEditModal = false">{{ t('common.cancel') }}</button>
          <button class="btn btn-primary" @click="updateCustomer">{{ t('common.save') }}</button>
        </div>
      </div>
    </div>
  </div>

  <div v-else class="empty-state">
    <p>{{ t('common.noData') }}</p>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import { useCustomerStore } from '@/stores/customer'
import { useEmployeeStore } from '@/stores/employee'
import { usePropertyStore } from '@/stores/property'
import { useTransactionStore } from '@/stores/transaction'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const customerStore = useCustomerStore()
const employeeStore = useEmployeeStore()
const propertyStore = usePropertyStore()
const transactionStore = useTransactionStore()

const showEditModal = ref(false)
const editForm = ref({})

const customer = computed(() => customerStore.getCustomerById(route.params.id))
const assignedTo = computed(() => employeeStore.getEmployeeById(customer.value?.assignedTo))
const customerTransactions = computed(() => transactionStore.getTransactionsByCustomer(route.params.id))

const formatNumber = (num) => num ? num.toLocaleString() : '0'

const getStatusClass = (status) => ({
  lead: 'badge-warning',
  active: 'badge-success',
  closed: 'badge-danger'
})[status] || 'badge-info'

const getTransactionStatusClass = (status) => ({
  completed: 'badge-success',
  pending: 'badge-warning'
})[status] || 'badge-info'

const getPropertyName = (id) => propertyStore.getPropertyById(id)?.name || 'Unknown'

const updateCustomer = () => {
  customerStore.updateCustomer(route.params.id, editForm.value)
  showEditModal.value = false
}

const deleteCustomer = () => {
  if (confirm(t('customers.deleteConfirm'))) {
    customerStore.deleteCustomer(route.params.id)
    router.push('/customers')
  }
}
</script>

<style scoped>
.back-link {
  font-size: 14px;
  color: var(--text-secondary);
  display: block;
  margin-bottom: 8px;
}
</style>
