# Copilot Instructions

<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

This is a Vue 3 prototype application for testing AI-driven UI manipulation features. The app allows users to interact with predefined methods through AI commands to manipulate the UI (add buttons, counters, backgrounds, etc.).

## Project Context
- Vue 3 with Composition API
- Vite for build tooling
- Focus on simple, manipulable UI components
- Prototype for AI-driven event management features
- **NEW: AI Manipulation Registry for secure method execution**

## Code Style Guidelines
- Use Vue 3 Composition API with `<script setup>`
- Keep components simple and focused
- Use reactive references for state management
- Implement clear, descriptive method names for AI interaction
- Follow Vue 3 best practices and conventions

## AI Manipulation Architecture (UPDATED)
**IMPORTANT: All AI-manipulable methods are now centralized in the AI Manipulation Registry**

### Security Model
- AI can ONLY execute methods defined in `src/services/aiManipulationRegistry.js`
- Registry provides validation, logging, and security boundaries
- No direct method execution - everything goes through the registry

### Current Implementation Status
- ✅ AI Manipulation Registry created with full validation
- ✅ AI Service updated to use registry exclusively  
- ✅ Home.vue component refactored to use registry
- ✅ Security boundaries enforced
- 🔄 Testing and validation needed
- ❌ Documentation needs updating (do this LAST after testing)

## Development Priority
1. Test the new registry implementation
2. Validate all AI commands work through registry
3. Ensure security boundaries are working
4. Fix any runtime issues
5. Only then update README and user documentation
When implementing AI manipulation features, follow these patterns:

### Method Naming Convention
- Use descriptive action-based names: `addButton()`, `incrementCounter()`, `changeBackground()`
- Prefix manipulation methods with action verbs: `add`, `remove`, `update`, `toggle`
- Include type suffixes for clarity: `addButtonElement()`, `removeCounterComponent()`

### Component Structure
- Create simple, reusable components in `/src/components/`
- Each manipulable element should have a unique identifier
- Use reactive state for all dynamic properties
- Implement props for customization

### State Management
- Use `ref()` for simple reactive values
- Use `reactive()` for complex objects
- Keep state at the appropriate component level
- Document state changes in comments

### Example Implementation Pattern
```vue
<script setup>
import { ref, reactive } from 'vue'

// State for AI manipulation
const elements = ref([])
const counters = reactive({})
const backgroundStyle = ref('')

// AI manipulation methods
const addButton = (text = 'New Button', id = Date.now()) => {
  elements.value.push({
    type: 'button',
    id,
    text,
    visible: true
  })
}

const incrementCounter = (id) => {
  if (!counters[id]) counters[id] = 0
  counters[id]++
}

const changeBackground = (color) => {
  backgroundStyle.value = `background-color: ${color}`
}
</script>
```

## File Organization
- Main manipulation logic in `App.vue`
- Individual UI components in `/src/components/`
- Shared utilities in `/src/utils/` (if needed)
- Styling in component `<style scoped>` sections

## Development Workflow
- Use the VS Code tasks for common operations
- Test each manipulation method as you implement it
- Keep the UI responsive and accessible
- Comment complex manipulation logic

## Testing AI Commands
Create methods that can be easily called to test AI integration:
- Simple parameter acceptance (strings, numbers, booleans)
- Clear visual feedback for all actions
- Reversible operations where possible
- Descriptive console logging for debuggingions

<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

This is a Vue 3 prototype application for testing AI-driven UI manipulation features. The app allows users to interact with predefined methods through AI commands to manipulate the UI (add buttons, counters, backgrounds, etc.).

## Project Context
- Vue 3 with Composition API
- Vite for build tooling
- Focus on simple, manipulable UI components
- Prototype for AI-driven event management features

## Code Style Guidelines
- Use Vue 3 Composition API with `<script setup>`
- Keep components simple and focused
- Use reactive references for state management
- Implement clear, descriptive method names for AI interaction
- Follow Vue 3 best practices and conventions

Explain AI Manipulation Features
Do not write any code without explaining what it does and ask before writing any New
This is a simple prototype, but the tech, tools, methods, etc, must work at enterpise scale
- Use descriptive action-based names: `addButton()`, `incrementCounter()`, `changeBackground()`
- Prefix manipulation methods with action verbs: `add`, `remove`, `update`
- This PC is my work PC, so please do not suggest any code that has been deleted or is not relevant to the current project context.
- This PC is my work PC, do not install any extensions or suggest any code that has been deleted or is not relevant to the current project context. Do not make global modifations to this pc or vscode.