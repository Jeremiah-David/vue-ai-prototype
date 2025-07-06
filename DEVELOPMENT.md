# Development Guide

This document provides comprehensive guidelines for developing the Vue AI Prototype application.

## Quick Start

### Available VS Code Tasks
Use `Ctrl+Shift+P` → "Tasks: Run Task" to access:

- **Start Development Server** - Starts the Vite dev server (auto-runs on folder open)
- **Build for Production** - Creates optimized production build
- **Preview Production Build** - Tests the production build locally
- **Install Dependencies** - Runs `npm install`
- **Clean Install** - Runs `npm ci` for clean dependency installation
- **Git: Add All and Commit** - Stages all changes and commits with custom message
- **Git: Push to Origin** - Pushes changes to GitHub

### Key Commands
```bash
npm run dev        # Start development server
npm run build      # Build for production
npm run preview    # Preview production build
```

## AI Manipulation Implementation Guide

### Core Principles
1. **Simple Methods** - Each AI command should map to a simple, descriptive method
2. **Reactive State** - Use Vue's reactivity for immediate UI updates
3. **Clear Feedback** - Provide visual feedback for all actions
4. **Reversible Actions** - Where possible, allow operations to be undone

### Implementation Pattern

```vue
<script setup>
import { ref, reactive } from 'vue'

// Reactive state for UI elements
const dynamicElements = ref([])
const appState = reactive({
  backgroundColor: '#ffffff',
  counters: {},
  settings: {}
})

// AI manipulation methods
const addButton = (text = 'New Button', color = 'blue') => {
  const id = Date.now()
  dynamicElements.value.push({
    id,
    type: 'button',
    text,
    color,
    visible: true
  })
  console.log(`Added button: ${text} with ID: ${id}`)
}

const removeElement = (id) => {
  const index = dynamicElements.value.findIndex(el => el.id === id)
  if (index !== -1) {
    dynamicElements.value.splice(index, 1)
    console.log(`Removed element with ID: ${id}`)
  }
}

const changeBackground = (color) => {
  appState.backgroundColor = color
  console.log(`Background changed to: ${color}`)
}

const incrementCounter = (name = 'default') => {
  if (!appState.counters[name]) {
    appState.counters[name] = 0
  }
  appState.counters[name]++
  console.log(`Counter '${name}' incremented to: ${appState.counters[name]}`)
}

// Make methods globally available for AI commands
window.addButton = addButton
window.removeElement = removeElement
window.changeBackground = changeBackground
window.incrementCounter = incrementCounter
</script>

<template>
  <div :style="{ backgroundColor: appState.backgroundColor }">
    <!-- Dynamic elements -->
    <div v-for="element in dynamicElements" :key="element.id">
      <button 
        v-if="element.type === 'button'"
        :style="{ backgroundColor: element.color }"
        @click="() => console.log(`Clicked: ${element.text}`)"
      >
        {{ element.text }}
      </button>
    </div>
    
    <!-- Counters -->
    <div v-for="(count, name) in appState.counters" :key="name">
      {{ name }}: {{ count }}
    </div>
  </div>
</template>
```

### Method Naming Conventions

#### Action Verbs
- `add*()` - Create new elements
- `remove*()` - Delete elements
- `update*()` - Modify existing elements
- `toggle*()` - Switch states
- `set*()` - Set specific values
- `increment*()` - Increase values
- `decrement*()` - Decrease values

#### Element Types
- `*Button()` - Button elements
- `*Counter()` - Counter components
- `*Text()` - Text elements
- `*Image()` - Image elements
- `*Background()` - Background styling
- `*Layout()` - Layout changes

#### Examples
```javascript
// Good method names
addButton(text, color)
removeButton(id)
updateButtonText(id, newText)
toggleButtonVisibility(id)
setBackgroundColor(color)
incrementCounter(name)
addTextElement(content, fontSize)
changeLayoutDirection(direction)

// Avoid generic names
add()
remove()
change()
update()
```

### State Management Guidelines

#### Use `ref()` for:
- Simple values (strings, numbers, booleans)
- Arrays of simple items
- Single reactive values

```javascript
const backgroundColor = ref('#ffffff')
const isVisible = ref(true)
const elementList = ref([])
```

#### Use `reactive()` for:
- Complex objects
- Nested data structures
- Multiple related properties

```javascript
const appState = reactive({
  theme: 'light',
  counters: {},
  settings: {
    autoSave: true,
    animations: false
  }
})
```

### Error Handling

Always include error handling and validation:

```javascript
const addButton = (text, color = 'blue') => {
  try {
    // Validate inputs
    if (!text || typeof text !== 'string') {
      throw new Error('Button text must be a non-empty string')
    }
    
    // Perform action
    const id = Date.now()
    dynamicElements.value.push({
      id,
      type: 'button',
      text: text.trim(),
      color,
      visible: true
    })
    
    console.log(`✅ Successfully added button: "${text}"`)
    return id
    
  } catch (error) {
    console.error(`❌ Failed to add button: ${error.message}`)
    return null
  }
}
```

### Testing Commands

Create a test suite for manual testing:

```javascript
// Add to your component for development testing
const runTests = () => {
  console.log('🧪 Running AI manipulation tests...')
  
  // Test button creation
  const buttonId = addButton('Test Button', 'red')
  
  // Test counter
  incrementCounter('test')
  incrementCounter('test')
  
  // Test background
  changeBackground('#f0f0f0')
  
  // Test removal
  setTimeout(() => {
    removeElement(buttonId)
    console.log('✅ All tests completed')
  }, 2000)
}

// Expose for console testing
window.runTests = runTests
```

## File Structure

```
src/
├── components/
│   ├── AIButton.vue          # Reusable button component
│   ├── AICounter.vue         # Counter component
│   ├── AITextElement.vue     # Text display component
│   └── HelloWorld.vue        # Original component
├── assets/
│   └── vue.svg              # Static assets
├── App.vue                  # Main application (AI manipulation logic)
├── main.js                  # Application entry point
└── style.css                # Global styles
```

## VS Code Configuration

### Recommended Extensions
The project includes recommended extensions for optimal development experience:
- Vue Language Features (Volar)
- TypeScript Vue Plugin
- Prettier Code Formatter
- ESLint
- GitLens
- GitHub Copilot

### Custom Settings
The workspace includes settings for:
- Auto-formatting on save
- Vue-specific formatting rules
- File nesting in explorer
- Terminal configuration

## Git Workflow

### Recommended Commands
```bash
# Quick commit (using VS Code task)
Ctrl+Shift+P → "Tasks: Git: Add All and Commit"

# Manual workflow
git add .
git commit -m "feat: add new AI manipulation method"
git push origin main
```

### Commit Message Conventions
- `feat:` - New features
- `fix:` - Bug fixes
- `docs:` - Documentation updates
- `style:` - Code style changes
- `refactor:` - Code refactoring
- `test:` - Adding tests
- `chore:` - Maintenance tasks

## Troubleshooting

### Common Issues

#### Development Server Won't Start
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run dev
```

#### Vue Components Not Updating
- Check if using `ref()` or `reactive()` correctly
- Ensure template uses `.value` for refs
- Verify Vue DevTools in browser

#### AI Methods Not Working
- Check browser console for errors
- Verify methods are attached to window object
- Test methods manually in browser console

### Performance Tips
- Use `markRaw()` for non-reactive objects
- Implement `v-memo` for expensive list rendering
- Use `shallowRef()` for large objects that don't need deep reactivity

## Deployment

### Production Build
```bash
npm run build      # Creates dist/ folder
npm run preview    # Test production build locally
```

### GitHub Pages Deployment
The project is ready for GitHub Pages deployment. The build output will be in the `dist/` folder.

## Next Steps

1. **Implement Core Methods** - Start with basic add/remove functionality
2. **Add Visual Feedback** - Implement animations and transitions
3. **Create Component Library** - Build reusable AI-manipulable components
4. **Add Persistence** - Save state to localStorage
5. **Implement Undo/Redo** - Add action history management
6. **Add Voice Commands** - Integrate speech recognition for AI commands
