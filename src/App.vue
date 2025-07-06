<script setup>
import { ref, onMounted } from 'vue'
import Home from './components/Home.vue'
import AccessGate from './components/AccessGate.vue'

const isAuthenticated = ref(false)

onMounted(async () => {
  // Check if user is already authenticated
  const { AccessControl } = await import('./services/accessControl.js')
  const accessControl = new AccessControl()
  isAuthenticated.value = accessControl.checkAuthentication()
})

const handleAuthenticated = () => {
  isAuthenticated.value = true
}
</script>

<template>
  <div id="app">
    <AccessGate 
      v-if="!isAuthenticated" 
      @authenticated="handleAuthenticated" 
    />
    <Home v-else />
  </div>
</template>
