<template>
  <div class="inventory-page">
    <div class="page-header">
      <h1 class="page-title">{{ t('inventory.title') }}</h1>
      <button class="btn btn-primary" @click="showAddModal = true">
        + {{ t('inventory.addProperty') }}
      </button>
    </div>

    <div class="filters">
      <select v-model="statusFilter" class="filter-select">
        <option value="">{{ t('inventory.allStatus') }}</option>
        <option value="available">{{ t('inventory.available') }}</option>
        <option value="reserved">{{ t('inventory.reserved') }}</option>
        <option value="sold">{{ t('inventory.sold') }}</option>
      </select>
      
      <select v-model="typeFilter" class="filter-select">
        <option value="">{{ t('inventory.allTypes') }}</option>
        <option value="Apartment">{{ t('inventory.apartment') }}</option>
        <option value="House">{{ t('inventory.house') }}</option>
        <option value="Villa">{{ t('inventory.villa') }}</option>
        <option value="Commercial">{{ t('inventory.commercial') }}</option>
        <option value="Land">{{ t('inventory.land') }}</option>
      </select>

      <select v-model="sortBy" class="filter-select">
        <option value="newest">{{ t('inventory.newest') }}</option>
        <option value="price-high">{{ t('inventory.priceHigh') }}</option>
        <option value="price-low">{{ t('inventory.priceLow') }}</option>
      </select>
    </div>

    <div class="search-bar">
      <input 
        type="text" 
        v-model="searchQuery"
        class="search-input"
        :placeholder="t('inventory.searchProperties')"
      >
    </div>

    <div class="grid-list">
      <div v-for="property in filteredProperties" :key="property.id" class="property-card">
        <div class="property-image">
          <span>{{ getPropertyIcon(property.type) }}</span>
        </div>
        <div class="property-content">
          <div class="flex-between">
            <h3 class="property-name">{{ property.name }}</h3>
            <span class="badge" :class="getStatusClass(property.status)">
              {{ t(`inventory.${property.status}`) }}
            </span>
          </div>
          <p class="property-location">{{ property.address }}</p>
          
          <div class="property-details">
            <span class="property-price">${{ formatNumber(property.price) }}</span>
            <span class="property-type">{{ property.type }}</span>
          </div>
          
          <div class="property-meta">
            <span v-if="property.bedrooms">{{ property.bedrooms }} {{ t('inventory.bedrooms').toLowerCase() }}</span>
            <span v-if="property.bathrooms">{{ property.bathrooms }} {{ t('inventory.bathrooms').toLowerCase() }}</span>
            <span>{{ property.size }} m²</span>
          </div>

          <div class="action-buttons mt-2">
            <router-link :to="`/inventory/${property.id}`" class="action-btn">
              {{ t('common.view') }}
            </router-link>
            <button 
              v-if="property.status === 'available'" 
              class="action-btn"
              @click="openReserveModal(property)"
            >
              {{ t('inventory.reserve') }}
            </button>
            <button 
              v-if="property.status === 'reserved'" 
              class="action-btn"
              @click="openSellModal(property)"
            >
              {{ t('inventory.markSold') }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <div v-if="filteredProperties.length === 0" class="empty-state">
      <p>{{ t('common.noData') }}</p>
    </div>

    <!-- Add Property Modal -->
    <div v-if="showAddModal" class="modal-overlay" @click.self="showAddModal = false">
      <div class="modal">
        <div class="modal-header">
          <h3 class="modal-title">{{ t('inventory.addProperty') }}</h3>
          <button class="modal-close" @click="showAddModal = false">×</button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label class="form-label">{{ t('inventory.propertyName') }}</label>
            <input type="text" v-model="newProperty.name" class="form-input" required>
          </div>
          <div class="grid-2">
            <div class="form-group">
              <label class="form-label">{{ t('inventory.type') }}</label>
              <select v-model="newProperty.type" class="form-input" required>
                <option value="Apartment">{{ t('inventory.apartment') }}</option>
                <option value="House">{{ t('inventory.house') }}</option>
                <option value="Villa">{{ t('inventory.villa') }}</option>
                <option value="Commercial">{{ t('inventory.commercial') }}</option>
                <option value="Land">{{ t('inventory.land') }}</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">{{ t('inventory.price') }}</label>
              <input type="number" v-model="newProperty.price" class="form-input" required>
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">{{ t('common.address') }}</label>
            <input type="text" v-model="newProperty.address" class="form-input" required>
          </div>
          <div class="grid-2">
            <div class="form-group">
              <label class="form-label">{{ t('inventory.size') }} (m²)</label>
              <input type="number" v-model="newProperty.size" class="form-input">
            </div>
            <div class="form-group">
              <label class="form-label">{{ t('inventory.bedrooms') }}</label>
              <input type="number" v-model="newProperty.bedrooms" class="form-input">
            </div>
          </div>
          <div class="grid-2">
            <div class="form-group">
              <label class="form-label">{{ t('inventory.bathrooms') }}</label>
              <input type="number" v-model="newProperty.bathrooms" class="form-input">
            </div>
            <div class="form-group">
              <label class="form-label">{{ t('inventory.assignedTo') }}</label>
              <select v-model="newProperty.assignedTo" class="form-input">
                <option v-for="emp in employeeStore.employees" :key="emp.id" :value="emp.id">
                  {{ emp.name }}
                </option>
              </select>
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">{{ t('inventory.description') }}</label>
            <textarea v-model="newProperty.description" class="form-input"></textarea>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" @click="showAddModal = false">{{ t('common.cancel') }}</button>
          <button class="btn btn-primary" @click="addProperty">{{ t('common.add') }}</button>
        </div>
      </div>
    </div>

    <!-- Reserve Modal -->
    <div v-if="showReserveModal" class="modal-overlay" @click.self="showReserveModal = false">
      <div class="modal">
        <div class="modal-header">
          <h3 class="modal-title">{{ t('inventory.reserve') }}</h3>
          <button class="modal-close" @click="showReserveModal = false">×</button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label class="form-label">{{ t('inventory.selectCustomer') }}</label>
            <select v-model="reserveData.customerId" class="form-input">
              <option v-for="customer in customerStore.customers" :key="customer.id" :value="customer.id">
                {{ customer.name }}
              </option>
            </select>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" @click="showReserveModal = false">{{ t('common.cancel') }}</button>
          <button class="btn btn-primary" @click="reserveProperty">{{ t('inventory.reserve') }}</button>
        </div>
      </div>
    </div>

    <!-- Sell Modal -->
    <div v-if="showSellModal" class="modal-overlay" @click.self="showSellModal = false">
      <div class="modal">
        <div class="modal-header">
          <h3 class="modal-title">{{ t('inventory.markSold') }}</h3>
          <button class="modal-close" @click="showSellModal = false">×</button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label class="form-label">{{ t('inventory.selectCustomer') }}</label>
            <select v-model="sellData.customerId" class="form-input">
              <option v-for="customer in customerStore.customers" :key="customer.id" :value="customer.id">
                {{ customer.name }}
              </option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">{{ t('inventory.paymentTerms') }}</label>
            <select v-model="sellData.paymentTerms" class="form-input">
              <option value="Full Payment">{{ t('contracts.fullPayment') }}</option>
              <option value="2 Installments">2 {{ t('contracts.installments') }}</option>
              <option value="4 Installments">4 {{ t('contracts.installments') }}</option>
              <option value="6 Installments">6 {{ t('contracts.installments') }}</option>
              <option value="12 Installments">12 {{ t('contracts.installments') }}</option>
            </select>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" @click="showSellModal = false">{{ t('common.cancel') }}</button>
          <button class="btn btn-success" @click="sellProperty">{{ t('inventory.confirmSale') }}</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { usePropertyStore } from '@/stores/property'
import { useCustomerStore } from '@/stores/customer'
import { useTransactionStore } from '@/stores/transaction'
import { useEmployeeStore } from '@/stores/employee'
import { useAuthStore } from '@/stores/auth'

const { t } = useI18n()
const propertyStore = usePropertyStore()
const customerStore = useCustomerStore()
const transactionStore = useTransactionStore()
const employeeStore = useEmployeeStore()
const authStore = useAuthStore()

const searchQuery = ref('')
const statusFilter = ref('')
const typeFilter = ref('')
const sortBy = ref('newest')
const showAddModal = ref(false)
const showReserveModal = ref(false)
const showSellModal = ref(false)
const selectedProperty = ref(null)

const newProperty = ref({
  name: '',
  type: 'Apartment',
  price: 0,
  address: '',
  size: 0,
  bedrooms: 0,
  bathrooms: 0,
  assignedTo: authStore.user?.id,
  description: ''
})

const reserveData = ref({
  customerId: null
})

const sellData = ref({
  customerId: null,
  paymentTerms: 'Full Payment'
})

const filteredProperties = computed(() => {
  let result = [...propertyStore.properties]

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(p => 
      p.name.toLowerCase().includes(query) ||
      p.address.toLowerCase().includes(query) ||
      p.code.toLowerCase().includes(query)
    )
  }

  if (statusFilter.value) {
    result = result.filter(p => p.status === statusFilter.value)
  }

  if (typeFilter.value) {
    result = result.filter(p => p.type === typeFilter.value)
  }

  if (sortBy.value === 'newest') {
    result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  } else if (sortBy.value === 'price-high') {
    result.sort((a, b) => b.price - a.price)
  } else if (sortBy.value === 'price-low') {
    result.sort((a, b) => a.price - b.price)
  }

  return result
})

const formatNumber = (num) => {
  return num ? num.toLocaleString() : '0'
}

const getPropertyIcon = (type) => {
  const icons = {
    Apartment: '🏢',
    House: '🏡',
    Villa: '🏰',
    Commercial: '🏬',
    Land: '🌳'
  }
  return icons[type] || '🏠'
}

const getStatusClass = (status) => {
  const classes = {
    available: 'badge-success',
    reserved: 'badge-warning',
    sold: 'badge-danger'
  }
  return classes[status] || 'badge-info'
}

const addProperty = () => {
  propertyStore.addProperty({
    ...newProperty.value,
    status: 'available',
    code: `PROP-${String(propertyStore.properties.length + 1).padStart(3, '0')}`,
    features: []
  })
  showAddModal.value = false
  newProperty.value = {
    name: '',
    type: 'Apartment',
    price: 0,
    address: '',
    size: 0,
    bedrooms: 0,
    bathrooms: 0,
    assignedTo: authStore.user?.id,
    description: ''
  }
}

const openReserveModal = (property) => {
  selectedProperty.value = property
  showReserveModal.value = true
}

const reserveProperty = () => {
  if (selectedProperty.value && reserveData.value.customerId) {
    propertyStore.updateStatus(selectedProperty.value.id, 'reserved', {
      reservedBy: reserveData.value.customerId
    })
    showReserveModal.value = false
  }
}

const openSellModal = (property) => {
  selectedProperty.value = property
  showSellModal.value = true
}

const sellProperty = () => {
  if (selectedProperty.value && sellData.value.customerId) {
    const property = selectedProperty.value
    
    propertyStore.updateStatus(property.id, 'sold', {
      soldTo: sellData.value.customerId
    })

    transactionStore.addTransaction({
      propertyId: property.id,
      customerId: sellData.value.customerId,
      salesPersonId: property.assignedTo,
      totalAmount: property.price,
      paidAmount: sellData.value.paymentTerms === 'Full Payment' ? property.price : 0,
      paymentMethod: 'Installment',
      paymentTerms: sellData.value.paymentTerms,
      payments: transactionStore.generatePaymentSchedule(
        property.price,
        sellData.value.paymentTerms,
        new Date().toISOString().split('T')[0]
      )
    })

    showSellModal.value = false
  }
}
</script>

<style scoped>
.property-meta {
  display: flex;
  gap: 12px;
  font-size: 12px;
  color: var(--text-secondary);
  margin-bottom: 12px;
}
</style>
