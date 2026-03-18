<template>
  <div class="language-switcher">
    <button 
      class="lang-btn" 
      :class="{ active: locale === 'vi' }"
      @click="setLocale('vi')"
    >
      VN
    </button>
    <button 
      class="lang-btn" 
      :class="{ active: locale === 'en' }"
      @click="setLocale('en')"
    >
      EN
    </button>
  </div>
</template>

<script setup>
import { useLocale } from '@/composables/useLocale'

const { locale, setLocale } = useLocale()
</script>

<style scoped>
.language-switcher {
  display: flex;
  gap: 4px;
  background: var(--surface);
  padding: 4px;
  border-radius: var(--radius-sm);
}

.lang-btn {
  padding: 6px 12px;
  background: transparent;
  border: none;
  color: var(--text-secondary);
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  border-radius: var(--radius-sm);
  transition: all 0.3s ease;
}

.lang-btn:hover {
  color: var(--text-primary);
}

.lang-btn.active {
  background: var(--accent);
  color: white;
}
</style>
