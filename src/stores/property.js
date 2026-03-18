import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { properties as mockProperties } from '@/data/mockData'

export const usePropertyStore = defineStore('property', () => {
  const properties = ref([...mockProperties])

  const available = computed(() => properties.value.filter(p => p.status === 'available'))
  const reserved = computed(() => properties.value.filter(p => p.status === 'reserved'))
  const sold = computed(() => properties.value.filter(p => p.status === 'sold'))

  const totalProperties = computed(() => properties.value.length)
  const totalValue = computed(() => properties.value.reduce((sum, p) => sum + p.price, 0))

  function getPropertyById(id) {
    return properties.value.find(p => p.id === parseInt(id))
  }

  function addProperty(property) {
    const newId = Math.max(...properties.value.map(p => p.id)) + 1
    properties.value.push({
      ...property,
      id: newId,
      createdAt: new Date().toISOString().split('T')[0]
    })
    return newId
  }

  function updateProperty(id, updates) {
    const index = properties.value.findIndex(p => p.id === parseInt(id))
    if (index !== -1) {
      properties.value[index] = { ...properties.value[index], ...updates }
      return true
    }
    return false
  }

  function updateStatus(id, status, additionalData = {}) {
    const property = getPropertyById(id)
    if (property) {
      property.status = status
      if (status === 'reserved') {
        property.reservedAt = new Date().toISOString().split('T')[0]
      } else if (status === 'sold') {
        property.soldAt = new Date().toISOString().split('T')[0]
      }
      Object.assign(property, additionalData)
      return true
    }
    return false
  }

  function deleteProperty(id) {
    const index = properties.value.findIndex(p => p.id === parseInt(id))
    if (index !== -1) {
      properties.value.splice(index, 1)
      return true
    }
    return false
  }

  return {
    properties,
    available,
    reserved,
    sold,
    totalProperties,
    totalValue,
    getPropertyById,
    addProperty,
    updateProperty,
    updateStatus,
    deleteProperty
  }
})
