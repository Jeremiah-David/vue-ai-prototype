# Development Guide

This document provides comprehensive guidelines for developing and extending the AI Alpha event creation platform.

## Quick Start

### Available VS Code Tasks
Use `Ctrl+Shift+P` → "Tasks: Run Task" to access:

- **Start Development Server** - Starts the Vite dev server (auto-runs on folder open)
- **Build for Production** - Creates optimized production build
- **Preview Production Build** - Tests the production build locally
- **Install Dependencies** - Runs `npm install`
- **Clean Install** - Runs `npm ci` for clean dependency installation

### Key Commands
```bash
npm run dev        # Start development server
npm run build      # Build for production
npm run preview    # Preview production build
```

## Event Creation Implementation Guide

### Core Principles
1. **Focused Methods** - Each AI command maps to specific event management functions
2. **Reactive State** - Use Vue's reactivity for immediate UI updates
3. **Clear Feedback** - Provide visual feedback for all event creation actions
4. **Secure Registry** - All AI methods must be defined in the manipulation registry

### Implementation Pattern

```vue
<script setup>
import { ref, reactive } from 'vue'
import { createAIManipulationRegistry } from '../services/aiManipulationRegistry.js'

// Reactive state for event management
const eventName = ref('')
const eventDescription = ref('')
const ticketTypes = ref([])
const waitlistEnabled = ref(false)

// Create the secure AI manipulation registry
const manipulationRegistry = createAIManipulationRegistry({
    eventName,
    eventDescription,
    ticketTypes,
    waitlistEnabled
})

// Get AI-accessible methods from registry
const {
    setEventName,
    setEventDescription,
    addTicketType,
    toggleWaitlist
} = manipulationRegistry.getAvailableMethods()

// Example usage
const createSampleEvent = () => {
  setEventName('Tech Conference 2025')
  setEventDescription('A gathering of technology professionals')
  addTicketType('General Admission', 199)
  addTicketType('VIP', 499)
  toggleWaitlist(true)
}
</script>

<template>
  <div class="event-display">
    <h2>{{ eventName || 'No event name set' }}</h2>
    <p>{{ eventDescription || 'No description set' }}</p>
    
    <div v-if="ticketTypes.length > 0">
      <h3>Ticket Types:</h3>
      <div v-for="ticket in ticketTypes" :key="ticket.id">
        {{ ticket.name }} 
        <span v-if="ticket.price">${{ ticket.price }}</span>
      </div>
    </div>
    
    <div>
      Waitlist: {{ waitlistEnabled ? 'Enabled' : 'Disabled' }}
    </div>
  </div>
</template>
```
    
    <!-- Counters -->
    <div v-for="(count, name) in appState.counters" :key="name">
      {{ name }}: {{ count }}
    </div>
  </div>
</template>
```

### Method Naming Conventions

## AI Manipulation Registry

### Security Architecture
All AI-accessible methods must be defined in the manipulation registry:

```javascript
// Only these 4 methods can be executed by AI
export class AIManipulationRegistry {
    getAvailableMethods() {
        return {
            setEventName: this.setEventName.bind(this),
            setEventDescription: this.setEventDescription.bind(this),
            addTicketType: this.addTicketType.bind(this),
            toggleWaitlist: this.toggleWaitlist.bind(this)
        }
    }
}
```

### Method Naming Convention
- Use descriptive action-based names: `setEventName()`, `addTicketType()`, `toggleWaitlist()`
- Prefix with action verbs: `set`, `add`, `toggle`
- Focus on event management domain

### Validation and Security
Always include comprehensive validation:

```javascript
setEventName(name) {
    try {
        // Validate inputs
        if (!name || typeof name !== 'string') {
            throw new Error('Event name must be a non-empty string')
        }
        
        if (name.length < 3 || name.length > 100) {
            throw new Error('Event name must be between 3 and 100 characters')
        }
        
        // Sanitize input
        const sanitizedName = name.trim().replace(/[<>]/g, '')
        
        // Update state
        this.eventState.eventName.value = sanitizedName
        
        this.logAction('setEventName', { name: sanitizedName }, true)
        return true
        
    } catch (error) {
        console.error('Error setting event name:', error)
        this.logAction('setEventName', { name }, false)
        throw error
    }
}
```

## File Structure

```
src/
├── components/
│   └── Home.vue              # Main event creation interface
├── services/
│   ├── aiManipulationRegistry.js  # Secure AI method registry
│   └── aiService.js          # OpenAI integration & function calling
├── assets/
│   └── vue.svg              # Static assets
├── App.vue                  # Main application entry point
├── main.js                  # Application bootstrap
└── style.css                # Global styles
```

## Development Workflow

### Testing Event Creation
Test the AI integration with these commands:
```bash
"Create a tech conference in San Francisco"
"Make a music festival with VIP and general tickets"
"Add student tickets with waitlist enabled"
"Set up a workshop with children and adult pricing"
```

### Manual Testing
```javascript
// Test in browser console
const registry = window.eventRegistry
const methods = registry.getAvailableMethods()

// Test event creation
methods.setEventName("Test Conference")
methods.setEventDescription("A test event")
methods.addTicketType("General", 100)
methods.toggleWaitlist(true)

// Check state
console.log(registry.getEventState())
console.log(registry.getActionLog())
```

## Production Deployment

### Build Process
```bash
npm run build      # Creates optimized dist/ folder
npm run preview    # Test production build locally
```

### Environment Configuration
```bash
# Required environment variables
VITE_OPENAI_API_KEY=sk-your-key-here  # Optional for demo mode
```

The application gracefully falls back to mock AI mode when no API key is provided, ensuring functionality for stakeholder demonstrations.
