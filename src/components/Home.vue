<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
    <!-- Navigation -->
    <nav class="relative z-10 flex items-center justify-between p-6 lg:px-8">
      <div class="flex items-center">
        <div class="text-2xl font-bold text-white">
          AI<span class="text-purple-400">Alpha</span>
        </div>
      </div>
      <div class="hidden md:flex items-center space-x-8">
        <a href="#features" class="text-gray-300 hover:text-white transition-colors">Features</a>
        <a href="#demo" class="text-gray-300 hover:text-white transition-colors">Demo</a>
        <button class="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-full transition-all transform hover:scale-105">
          Get Started
        </button>
      </div>
    </nav>

    <!-- Hero Section -->
    <section class="relative flex items-center justify-center min-h-[80vh] px-4">
      <!-- Background Effects -->
      <div class="absolute inset-0 overflow-hidden">
        <div class="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div class="absolute top-1/3 right-1/4 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
        <div class="absolute bottom-1/4 left-1/3 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-4000"></div>
      </div>

      <div class="relative z-10 text-center max-w-5xl mx-auto">
        <!-- Main Headline -->
        <h1 class="text-6xl md:text-8xl font-bold text-white mb-8 leading-tight">
          AI-Driven
          <span class="block bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
            UI Manipulation
          </span>
        </h1>
        
        <!-- Subtitle -->
        <p class="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
          Transform your applications with intelligent interface control. 
          Add buttons, counters, and components through natural AI commands.
        </p>

        <!-- CTA Buttons -->
        <div class="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
          <button class="px-8 py-4 bg-white text-slate-900 rounded-full text-lg font-semibold hover:bg-gray-100 transition-all transform hover:scale-105 shadow-xl">
            Experience the Demo
          </button>
          <button class="px-8 py-4 border-2 border-purple-400 text-purple-400 rounded-full text-lg font-semibold hover:bg-purple-400 hover:text-white transition-all transform hover:scale-105">
            View Documentation
          </button>
        </div>

        <!-- Feature Pills -->
        <div class="flex flex-wrap justify-center gap-4 text-sm">
          <span class="px-4 py-2 bg-white/10 backdrop-blur-sm text-white rounded-full border border-white/20">
            Vue 3 Composition API
          </span>
          <span class="px-4 py-2 bg-white/10 backdrop-blur-sm text-white rounded-full border border-white/20">
            Enterprise Ready
          </span>
          <span class="px-4 py-2 bg-white/10 backdrop-blur-sm text-white rounded-full border border-white/20">
            Real-time Manipulation
          </span>
          <span class="px-4 py-2 bg-white/10 backdrop-blur-sm text-white rounded-full border border-white/20">
            Scalable Architecture
          </span>
        </div>
      </div>
    </section>

    <!-- Features Preview Section -->
    <section id="features" class="relative py-20 px-4">
      <div class="max-w-6xl mx-auto">
        <div class="text-center mb-16">
          <h2 class="text-4xl md:text-5xl font-bold text-white mb-6">
            Intelligent Interface Control
          </h2>
          <p class="text-xl text-gray-300 max-w-2xl mx-auto">
            Watch as AI commands seamlessly transform your application's interface in real-time
          </p>
        </div>

        <!-- Feature Cards -->
        <div class="grid md:grid-cols-3 gap-8">
          <div class="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:border-purple-400/50 transition-all transform hover:scale-105">
            <div class="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl mb-6 flex items-center justify-center">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4"></path>
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-white mb-4">Dynamic Components</h3>
            <p class="text-gray-400">Add buttons, counters, and UI elements through simple AI commands</p>
          </div>

          <div class="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:border-cyan-400/50 transition-all transform hover:scale-105">
            <div class="w-12 h-12 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl mb-6 flex items-center justify-center">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-white mb-4">Real-time Updates</h3>
            <p class="text-gray-400">Instant visual feedback as AI manipulates your interface</p>
          </div>

          <div class="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:border-pink-400/50 transition-all transform hover:scale-105">
            <div class="w-12 h-12 bg-gradient-to-r from-pink-500 to-rose-500 rounded-xl mb-6 flex items-center justify-center">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-white mb-4">Enterprise Scale</h3>
            <p class="text-gray-400">Built with Vue 3 and designed for production environments</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Demo Preview Section -->
    <section id="demo" class="relative py-20 px-4">
      <div class="max-w-4xl mx-auto text-center">
        <h2 class="text-4xl md:text-5xl font-bold text-white mb-8">
          See It In Action
        </h2>
        <div class="bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10">
          <div class="bg-slate-800 rounded-2xl p-6 mb-6">
            <div class="flex items-center justify-between mb-4">
              <div class="flex space-x-2">
                <div class="w-3 h-3 bg-red-500 rounded-full"></div>
                <div class="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <div class="w-3 h-3 bg-green-500 rounded-full"></div>
              </div>
              <span class="text-gray-400 text-sm">AI Command Interface</span>
            </div>
            <div class="text-left">
              <div class="text-green-400 mb-2">$ ai.addButton("Click Me", "primary")</div>
              <div class="text-blue-400 mb-2">$ ai.incrementCounter("mainCounter")</div>
              <div class="text-purple-400">$ ai.changeBackground("gradient-purple")</div>
            </div>
          </div>
          <p class="text-gray-300 text-lg">
            Ready to revolutionize how you build interfaces? Start your journey with AIAlpha.
          </p>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="relative py-12 px-4 border-t border-white/10">
      <div class="max-w-6xl mx-auto text-center">
        <div class="text-2xl font-bold text-white mb-4">
          AI<span class="text-purple-400">Alpha</span>
        </div>
        <p class="text-gray-400 mb-6">
          Prototype for AI-driven UI manipulation • Built with Vue 3 & Tailwind CSS
        </p>
        <div class="flex justify-center space-x-6 text-gray-400">
          <a href="#" class="hover:text-white transition-colors">Documentation</a>
          <a href="#" class="hover:text-white transition-colors">GitHub</a>
          <a href="#" class="hover:text-white transition-colors">Contact</a>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
// Component state for future AI manipulation features
import { ref, reactive } from 'vue'

// State for AI manipulation (ready for future implementation)
const elements = ref([])
const counters = reactive({})
const backgroundStyle = ref('')

// AI manipulation methods (placeholder for future development)
const addButton = (text = 'New Button', id = Date.now()) => {
  elements.value.push({
    type: 'button',
    id,
    text,
    visible: true
  })
  console.log(`AI Command: Added button "${text}" with ID ${id}`)
}

const incrementCounter = (id) => {
  if (!counters[id]) counters[id] = 0
  counters[id]++
  console.log(`AI Command: Incremented counter ${id} to ${counters[id]}`)
}

const changeBackground = (style) => {
  backgroundStyle.value = style
  console.log(`AI Command: Changed background to ${style}`)
}

// Expose methods for future AI integration
defineExpose({
  addButton,
  incrementCounter,
  changeBackground,
  elements,
  counters
})
</script>

<style scoped>
@keyframes pulse {
  0%, 100% {
    opacity: 0.2;
  }
  50% {
    opacity: 0.4;
  }
}

.animation-delay-2000 {
  animation-delay: 2s;
}

.animation-delay-4000 {
  animation-delay: 4s;
}

/* Smooth scrolling for anchor links */
html {
  scroll-behavior: smooth;
}
</style>
