<template>
    <div class="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
        <!-- Navigation -->
        <nav class="relative z-10 flex items-center justify-between p-6 lg:px-8">
            <div class="flex items-center space-x-6">
                <div class="text-2xl font-bold text-white">
                    AI<span class="text-blue-400">Alpha</span>
                </div>
                <button @click="showDocumentation = true"
                    class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all flex items-center space-x-2">
                    <span>📖</span>
                    <span>Documentation</span>
                </button>
            </div>
        </nav>

        <!-- Hero Section -->
        <section class="relative flex items-center justify-center min-h-[80vh] px-4">
            <!-- Background Effects -->
            <div class="absolute inset-0 overflow-hidden">
                <div
                    class="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse">
                </div>
                <div
                    class="absolute top-1/3 right-1/4 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000">
                </div>
                <div
                    class="absolute bottom-1/4 left-1/3 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-4000">
                </div>
            </div>

            <div class="relative z-10 text-center max-w-5xl mx-auto">
                <!-- Main Headline -->
                <h1 class="text-6xl md:text-8xl font-bold text-white mb-8 leading-tight">
                    Jeremiah's<br>
                    AI-Driven
                    <span
                        class="block bg-gradient-to-r from-blue-400 via-cyan-400 to-indigo-400 bg-clip-text text-transparent">
                        Event Creation
                    </span>
                </h1>

                <!-- Subtitle -->
                <p class="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
                    Create events effortlessly with intelligent AI assistance.
                    Set event details, manage tickets, and configure waitlists through
                    natural language commands.
                </p>

                <!-- Interactive Demo Section -->
                <div
                    class="w-full max-w-4xl mx-auto bg-black/20 backdrop-blur-sm rounded-2xl p-8 border border-white/10 mb-16">
                    <h3 class="text-2xl font-bold text-white mb-6 text-center">
                        Try the AI Event Creator
                    </h3>

                    <!-- Command Input -->
                    <div class="mb-6">
                        <div class="space-y-3">
                            <textarea v-model="currentCommand" @keyup.ctrl.enter="processCommand"
                                placeholder="Try: 'Create a conference with pro and amateur tickets' or 'Make a festival with children and adult tickets and waitlist'"
                                rows="3"
                                class="w-full px-6 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 resize-y min-h-[80px]"></textarea>
                            <div class="flex justify-end">
                                <button @click="processCommand" :disabled="isProcessing"
                                    class="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white rounded-lg transition-all">
                                    {{ isProcessing ? 'Processing...' : 'Send' }}
                                </button>
                            </div>
                        </div>

                        <!-- AI Status Indicator -->
                        <div class="mt-2 flex items-center justify-between text-sm">
                            <div class="flex items-center space-x-2">
                                <div class="w-2 h-2 rounded-full bg-green-400"></div>
                                <span class="text-gray-400">
                                    AI Active ({{ aiService.getUsageStats().model }})
                                </span>
                            </div>
                            <div class="text-gray-500 text-xs">
                                {{ aiService.getUsageStats().remainingRequests }}/{{
                                    aiService.getUsageStats().sessionLimit }} requests left
                            </div>
                        </div>
                    </div>

                    <!-- AI Processing Status -->
                    <div v-if="isProcessing" class="mb-4 p-4 bg-blue-500/20 border border-blue-400/30 rounded-lg">
                        <div class="flex items-center space-x-3">
                            <div
                                class="animate-spin w-5 h-5 border-2 border-blue-400 border-t-transparent rounded-full">
                            </div>
                            <span class="text-blue-300">AI is creating your event...</span>
                        </div>
                    </div>

                    <!-- Command History -->
                    <div v-if="commandHistory.length > 0" class="mb-6">
                        <h4 class="text-lg font-semibold text-white mb-3">
                            Recent Commands:
                        </h4>
                        <div class="space-y-2 max-h-32 overflow-y-auto">
                            <div v-for="(command, index) in commandHistory.slice(-3)" :key="index"
                                class="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                                <span class="text-gray-300">{{ command.command }}</span>
                                <span
                                    :class="[command.success ? 'text-green-400' : 'text-red-400', 'text-xs font-semibold']">
                                    {{ command.success ? '✓' : '✗' }}
                                </span>
                            </div>
                        </div>
                    </div>

                    <!-- Event Display Section -->
                    <div class="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                        <h4 class="text-xl font-bold text-white mb-4 flex items-center">
                            🎫 Current Event
                        </h4>

                        <!-- Event Name -->
                        <div class="mb-4 p-4 bg-blue-600/20 border border-blue-400/30 rounded-lg">
                            <h5 class="text-sm font-semibold text-blue-300 mb-1">Event Name</h5>
                            <p class="text-white text-lg">{{ eventName || 'No event name set' }}</p>
                        </div>

                        <!-- Event Description -->
                        <div class="mb-4 p-4 bg-indigo-600/20 border border-indigo-400/30 rounded-lg">
                            <h5 class="text-sm font-semibold text-indigo-300 mb-1">Description</h5>
                            <p class="text-white">{{ eventDescription || 'No description set' }}</p>
                        </div>

                        <!-- Ticket Types and Waitlist -->
                        <div class="grid grid-cols-1 gap-4">
                            <!-- Ticket Types -->
                            <div class="p-4 bg-green-600/20 border border-green-400/30 rounded-lg">
                                <h5 class="text-sm font-semibold text-green-300 mb-2">Ticket Types</h5>
                                <div v-if="ticketTypes.length === 0" class="text-white">No ticket types set</div>
                                <div v-else class="space-y-2">
                                    <div v-for="ticket in ticketTypes" :key="ticket.id"
                                        class="flex items-center justify-between p-2 bg-white/10 rounded">
                                        <span class="text-white">{{ ticket.name }}</span>
                                        <span v-if="ticket.price" class="text-green-300 text-sm">${{ ticket.price
                                            }}</span>
                                    </div>
                                </div>
                            </div>

                            <!-- Waitlist Status -->
                            <div class="p-4 bg-orange-600/20 border border-orange-400/30 rounded-lg">
                                <h5 class="text-sm font-semibold text-orange-300 mb-1">Waitlist</h5>
                                <div class="flex items-center space-x-2">
                                    <div
                                        :class="[waitlistEnabled ? 'bg-green-500' : 'bg-gray-500', 'w-3 h-3 rounded-full']">
                                    </div>
                                    <span class="text-white">{{ waitlistEnabled ? 'Enabled' : 'Disabled' }}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Demo Examples -->
                    <div class="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <button @click="currentCommand = 'Create a tech conference in San Francisco'; processCommand()"
                            class="p-4 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-400/30 rounded-lg text-left transition-all">
                            <div class="text-blue-300 font-semibold mb-1">Tech Conference</div>
                            <div class="text-gray-400 text-sm">Create a technology conference</div>
                        </button>
                        <button
                            @click="currentCommand = 'Make a music festival with children and adult tickets and waitlist enabled'; processCommand()"
                            class="p-4 bg-cyan-600/20 hover:bg-cyan-600/30 border border-cyan-400/30 rounded-lg text-left transition-all">
                            <div class="text-cyan-300 font-semibold mb-1">Music Festival</div>
                            <div class="text-gray-400 text-sm">Festival with multiple ticket types</div>
                        </button>
                    </div>

                    <!-- Clear Button -->
                    <div class="mt-6 text-center">
                        <button @click="clearEvent"
                            class="px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-all">
                            Clear Event
                        </button>
                    </div>
                </div>
            </div>
        </section>

        <!-- Features Section -->
        <section id="features" class="relative py-20 px-4">
            <div class="max-w-6xl mx-auto">
                <div class="text-center mb-16">
                    <h2 class="text-4xl md:text-5xl font-bold text-white mb-6">
                        AI Event Creation Features
                    </h2>
                    <p class="text-xl text-gray-300 max-w-3xl mx-auto">
                        Streamline your event planning with intelligent AI assistance
                    </p>
                </div>

                <div class="grid md:grid-cols-3 gap-8">
                    <div
                        class="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:border-blue-400/50 transition-all transform hover:scale-105">
                        <div
                            class="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl mb-6 flex items-center justify-center">
                            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z">
                                </path>
                            </svg>
                        </div>
                        <h3 class="text-xl font-semibold text-white mb-4">
                            Smart Event Setup
                        </h3>
                        <p class="text-gray-400">
                            AI understands your event requirements and configures
                            details automatically through natural commands
                        </p>
                    </div>

                    <div
                        class="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:border-cyan-400/50 transition-all transform hover:scale-105">
                        <div
                            class="w-12 h-12 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl mb-6 flex items-center justify-center">
                            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z">
                                </path>
                            </svg>
                        </div>
                        <h3 class="text-xl font-semibold text-white mb-4">
                            Ticket Management
                        </h3>
                        <p class="text-gray-400">
                            Configure ticket types and pricing through simple AI commands
                        </p>
                    </div>

                    <div
                        class="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:border-indigo-400/50 transition-all transform hover:scale-105">
                        <div
                            class="w-12 h-12 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-xl mb-6 flex items-center justify-center">
                            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                        </div>
                        <h3 class="text-xl font-semibold text-white mb-4">
                            Waitlist Control
                        </h3>
                        <p class="text-gray-400">
                            Enable or disable waitlists with intelligent capacity management
                        </p>
                    </div>
                </div>
            </div>
        </section>
    </div>

    <!-- Documentation Modal -->
    <div v-if="showDocumentation"
        class="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div class="bg-slate-900 border border-gray-700 rounded-2xl max-w-4xl max-h-[90vh] overflow-y-auto">
            <div class="sticky top-0 bg-slate-900 border-b border-gray-700 p-6 flex items-center justify-between">
                <h2 class="text-2xl font-bold text-white flex items-center space-x-2">
                    <span>📖</span>
                    <span>AI Alpha Documentation</span>
                </h2>
                <button @click="showDocumentation = false"
                    class="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-all">
                    ← Back to Demo
                </button>
            </div>

            <div class="p-6 prose prose-invert max-w-none">
                <!-- Quick Start -->
                <section class="mb-8">
                    <h3 class="text-xl font-bold text-white mb-4 flex items-center space-x-2">
                        <span>🚀</span>
                        <span>Quick Start Guide</span>
                    </h3>
                    <div class="bg-blue-900/20 border border-blue-400/30 rounded-lg p-4 mb-4">
                        <p class="text-blue-300 font-semibold mb-2">What is AI Alpha?</p>
                        <p class="text-gray-300">AI Alpha is a prototype demonstrating AI-driven event creation. Simply
                            type natural language commands to create events, set ticket types, and manage waitlists.</p>
                    </div>

                    <h4 class="text-lg font-semibold text-white mb-3">Try These Commands:</h4>
                    <div class="space-y-2 mb-4">
                        <div class="bg-green-900/20 border border-green-400/30 rounded-lg p-3">
                            <code class="text-green-300">"Create a tech conference in San Francisco"</code>
                        </div>
                        <div class="bg-green-900/20 border border-green-400/30 rounded-lg p-3">
                            <code class="text-green-300">"Make a music festival with VIP and general tickets"</code>
                        </div>
                        <div class="bg-green-900/20 border border-green-400/30 rounded-lg p-3">
                            <code class="text-green-300">"Add children and adult tickets with waitlist enabled"</code>
                        </div>
                    </div>
                </section>

                <!-- AI Capabilities -->
                <section class="mb-8">
                    <h3 class="text-xl font-bold text-white mb-4 flex items-center space-x-2">
                        <span>🤖</span>
                        <span>AI Capabilities</span>
                    </h3>
                    <div class="grid md:grid-cols-2 gap-4">
                        <div class="bg-blue-900/20 border border-blue-400/30 rounded-lg p-4">
                            <h4 class="text-blue-300 font-semibold mb-2">Event Setup</h4>
                            <ul class="text-gray-300 space-y-1 text-sm">
                                <li>• Set event names and descriptions</li>
                                <li>• Configure event details automatically</li>
                                <li>• Intelligent context understanding</li>
                            </ul>
                        </div>
                        <div class="bg-cyan-900/20 border border-cyan-400/30 rounded-lg p-4">
                            <h4 class="text-cyan-300 font-semibold mb-2">Ticket Management</h4>
                            <ul class="text-gray-300 space-y-1 text-sm">
                                <li>• Multiple ticket types (VIP, General, etc.)</li>
                                <li>• Age-based categories (Children, Adults)</li>
                                <li>• Custom pricing and naming</li>
                            </ul>
                        </div>
                        <div class="bg-indigo-900/20 border border-indigo-400/30 rounded-lg p-4">
                            <h4 class="text-indigo-300 font-semibold mb-2">Waitlist Control</h4>
                            <ul class="text-gray-300 space-y-1 text-sm">
                                <li>• Enable/disable waitlists</li>
                                <li>• Intelligent capacity management</li>
                                <li>• Automatic configuration</li>
                            </ul>
                        </div>
                        <div class="bg-orange-900/20 border border-orange-400/30 rounded-lg p-4">
                            <h4 class="text-orange-300 font-semibold mb-2">Natural Language</h4>
                            <ul class="text-gray-300 space-y-1 text-sm">
                                <li>• Conversational commands</li>
                                <li>• Context-aware responses</li>
                                <li>• Error handling and suggestions</li>
                            </ul>
                        </div>
                    </div>
                </section>

                <!-- Technical Details -->
                <section class="mb-8">
                    <h3 class="text-xl font-bold text-white mb-4 flex items-center space-x-2">
                        <span>⚙️</span>
                        <span>Technical Implementation</span>
                    </h3>
                    <div class="bg-gray-800/50 border border-gray-600 rounded-lg p-4 mb-4">
                        <h4 class="text-gray-300 font-semibold mb-2">Security Architecture</h4>
                        <p class="text-gray-400 text-sm mb-2">All AI commands are processed through a secure registry
                            system that validates and controls what actions the AI can perform.</p>
                        <div class="text-xs text-gray-500">
                            <strong>AI Manipulation Registry:</strong> Only predefined, safe methods can be executed<br>
                            <strong>Validation Layer:</strong> All inputs are sanitized and validated<br>
                            <strong>Logging System:</strong> Complete audit trail of all AI actions
                        </div>
                    </div>

                    <div class="bg-gray-800/50 border border-gray-600 rounded-lg p-4">
                        <h4 class="text-gray-300 font-semibold mb-2">Technology Stack</h4>
                        <div class="grid md:grid-cols-3 gap-3 text-sm">
                            <div>
                                <strong class="text-blue-300">Frontend:</strong>
                                <ul class="text-gray-400 mt-1">
                                    <li>• Vue 3 Composition API</li>
                                    <li>• Vite Build Tool</li>
                                    <li>• Tailwind CSS</li>
                                </ul>
                            </div>
                            <div>
                                <strong class="text-green-300">AI Integration:</strong>
                                <ul class="text-gray-400 mt-1">
                                    <li>• OpenAI GPT-4</li>
                                    <li>• Function Calling</li>
                                    <li>• Secure Registry</li>
                                </ul>
                            </div>
                            <div>
                                <strong class="text-indigo-300">Architecture:</strong>
                                <ul class="text-gray-400 mt-1">
                                    <li>• Enterprise Ready</li>
                                    <li>• Scalable Design</li>
                                    <li>• Security First</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </section>

                <!-- Usage Examples -->
                <section class="mb-8">
                    <h3 class="text-xl font-bold text-white mb-4 flex items-center space-x-2">
                        <span>💡</span>
                        <span>Usage Examples</span>
                    </h3>

                    <div class="space-y-4">
                        <div class="bg-slate-800 border border-gray-600 rounded-lg p-4">
                            <h4 class="text-white font-semibold mb-2">Creating a Technology Conference</h4>
                            <div class="bg-black/30 rounded p-3 mb-2">
                                <code
                                    class="text-green-400">"Create a tech innovation conference in Silicon Valley with professional and student tickets"</code>
                            </div>
                            <p class="text-gray-400 text-sm">This command will automatically set up an event with
                                appropriate name, description, and multiple ticket types.</p>
                        </div>

                        <div class="bg-slate-800 border border-gray-600 rounded-lg p-4">
                            <h4 class="text-white font-semibold mb-2">Setting Up a Music Festival</h4>
                            <div class="bg-black/30 rounded p-3 mb-2">
                                <code
                                    class="text-green-400">"Make a summer music festival with VIP, general admission, and children tickets plus waitlist"</code>
                            </div>
                            <p class="text-gray-400 text-sm">Creates a festival event with multiple ticket tiers and
                                enables the waitlist functionality.</p>
                        </div>

                        <div class="bg-slate-800 border border-gray-600 rounded-lg p-4">
                            <h4 class="text-white font-semibold mb-2">Corporate Training Event</h4>
                            <div class="bg-black/30 rounded p-3 mb-2">
                                <code
                                    class="text-green-400">"Create a leadership training workshop for executives"</code>
                            </div>
                            <p class="text-gray-400 text-sm">Generates a professional training event with appropriate
                                settings and general admission tickets.</p>
                        </div>
                    </div>
                </section>

                <!-- Enterprise Features -->
                <section class="mb-8">
                    <h3 class="text-xl font-bold text-white mb-4 flex items-center space-x-2">
                        <span>🏢</span>
                        <span>Enterprise Ready Features</span>
                    </h3>
                    <div class="grid md:grid-cols-2 gap-4">
                        <div class="bg-blue-900/20 border border-blue-400/30 rounded-lg p-4">
                            <h4 class="text-blue-300 font-semibold mb-2">Security & Compliance</h4>
                            <ul class="text-gray-300 space-y-1 text-sm">
                                <li>• Controlled AI function execution</li>
                                <li>• Complete audit logging</li>
                                <li>• Input validation and sanitization</li>
                                <li>• Rate limiting and usage controls</li>
                            </ul>
                        </div>
                        <div class="bg-green-900/20 border border-green-400/30 rounded-lg p-4">
                            <h4 class="text-green-300 font-semibold mb-2">Scalability</h4>
                            <ul class="text-gray-300 space-y-1 text-sm">
                                <li>• Modular component architecture</li>
                                <li>• Extensible registry system</li>
                                <li>• Production-ready patterns</li>
                                <li>• Performance optimized</li>
                            </ul>
                        </div>
                    </div>
                </section>

                <!-- FAQ -->
                <section>
                    <h3 class="text-xl font-bold text-white mb-4 flex items-center space-x-2">
                        <span>❓</span>
                        <span>Frequently Asked Questions</span>
                    </h3>
                    <div class="space-y-3">
                        <details class="bg-slate-800 border border-gray-600 rounded-lg p-4">
                            <summary class="text-white font-semibold cursor-pointer">How secure is the AI integration?
                            </summary>
                            <p class="text-gray-400 mt-2 text-sm">The AI can only execute predefined methods through our
                                secure registry system. All commands are validated, logged, and sandboxed for maximum
                                security.</p>
                        </details>
                        <details class="bg-slate-800 border border-gray-600 rounded-lg p-4">
                            <summary class="text-white font-semibold cursor-pointer">Can I extend the AI capabilities?
                            </summary>
                            <p class="text-gray-400 mt-2 text-sm">Yes! The registry system is designed to be extensible.
                                New functions can be added to the registry with proper validation and security measures.
                            </p>
                        </details>
                        <details class="bg-slate-800 border border-gray-600 rounded-lg p-4">
                            <summary class="text-white font-semibold cursor-pointer">What happens if OpenAI is
                                unavailable?</summary>
                            <p class="text-gray-400 mt-2 text-sm">The system includes graceful fallback to mock AI
                                responses, ensuring the demo continues to work even without API connectivity.</p>
                        </details>
                        <details class="bg-slate-800 border border-gray-600 rounded-lg p-4">
                            <summary class="text-white font-semibold cursor-pointer">Is this production ready?</summary>
                            <p class="text-gray-400 mt-2 text-sm">This is a prototype built with enterprise-ready
                                patterns. The architecture, security model, and code quality are designed for production
                                scaling.</p>
                        </details>
                    </div>
                </section>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import aiService from '../services/aiService.js'
import { createAIManipulationRegistry } from '../services/aiManipulationRegistry.js'

// Event state (reactive)
const eventName = ref('')
const eventDescription = ref('')
const ticketTypes = ref([]) // Changed from ticketName to ticketTypes array
const waitlistEnabled = ref(false)

// Create the AI manipulation registry with event state
const manipulationRegistry = createAIManipulationRegistry({
    eventName,
    eventDescription,
    ticketTypes,
    waitlistEnabled,
})

// Command processing state
const currentCommand = ref('')
const isProcessing = ref(false)
const commandHistory = ref([])

// Documentation modal state
const showDocumentation = ref(false)

// Get the 4 available event methods from the registry
const {
    setEventName,
    setEventDescription,
    addTicketType, // Changed from setTicketName
    toggleWaitlist,
} = manipulationRegistry.getAvailableMethods()

// Process AI command
const processCommand = async () => {
    if (!currentCommand.value.trim() || isProcessing.value) return

    const command = currentCommand.value.trim()
    isProcessing.value = true

    try {
        // Process the command through AI service
        const result = await aiService.processCommand(command, manipulationRegistry)

        // Add to command history
        commandHistory.value.push({
            command: command,
            success: result.success,
            message: result.message,
            timestamp: new Date().toLocaleTimeString(),
        })

        // Clear the input on success
        if (result.success) {
            currentCommand.value = ''
        }
    } catch (error) {
        commandHistory.value.push({
            command: command,
            success: false,
            message: error.message || 'Command failed',
            timestamp: new Date().toLocaleTimeString(),
        })
    } finally {
        isProcessing.value = false
    }
}

// Clear event function
const clearEvent = () => {
    eventName.value = ''
    eventDescription.value = ''
    ticketTypes.value = [] // Changed from ticketName
    waitlistEnabled.value = false
    commandHistory.value = []
    currentCommand.value = ''
}

// Demo functions
const createTechConferenceDemo = async () => {
    setEventName('Tech Innovation Conference 2025')
    await new Promise((resolve) => setTimeout(resolve, 300))
    setEventDescription('Join industry leaders for cutting-edge technology discussions, networking, and innovation showcases.')
    await new Promise((resolve) => setTimeout(resolve, 300))
    addTicketType('General Admission')
    await new Promise((resolve) => setTimeout(resolve, 300))
    toggleWaitlist(false)
}

const createMusicFestivalDemo = async () => {
    setEventName('Summer Music Festival')
    await new Promise((resolve) => setTimeout(resolve, 300))
    setEventDescription('Three days of amazing music, food trucks, and unforgettable experiences under the stars.')
    await new Promise((resolve) => setTimeout(resolve, 300))
    addTicketType('Children')
    await new Promise((resolve) => setTimeout(resolve, 200))
    addTicketType('Adults') 
    await new Promise((resolve) => setTimeout(resolve, 200))
    addTicketType('VIP')
    await new Promise((resolve) => setTimeout(resolve, 300))
    toggleWaitlist(true)
}

// Expose methods for testing and future use
defineExpose({
    // Registry and its methods
    manipulationRegistry,
    setEventName,
    setEventDescription,
    addTicketType, // Changed from setTicketName
    toggleWaitlist,

    // Component methods
    processCommand,
    clearEvent,
    createTechConferenceDemo,
    createMusicFestivalDemo,

    // State (read-only access)
    eventName,
    eventDescription,
    ticketTypes, // Changed from ticketName
    waitlistEnabled,

    // Utility methods
    getActionLog: manipulationRegistry.getActionLog,
    getEventState: manipulationRegistry.getEventState,
})
</script>

<style scoped>
@keyframes pulse {
    0%,
    100% {
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
