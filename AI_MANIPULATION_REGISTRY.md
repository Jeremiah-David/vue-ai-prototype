# AI Manipulation Registry Documentation

## Overview

The AI Manipulation Registry provides a **secure, controlled interface** for AI systems to manipulate the user interface. This registry serves as the **single source of truth** for what the AI can and cannot do, providing enterprise-level security and clear audit trails.

## 🔐 Security Model

### Key Principles
1. **Whitelist Approach**: AI can ONLY execute methods defined in the registry
2. **Input Validation**: All parameters are validated before execution
3. **Audit Trail**: Every action is logged with timestamp and parameters
4. **Error Handling**: Graceful failure with detailed error messages
5. **Resource Limits**: Built-in protection against excessive resource usage

### Security Boundaries
- ✅ **AI CAN**: Execute pre-approved UI manipulation methods
- ❌ **AI CANNOT**: Run arbitrary code, access external systems, or execute methods outside the registry
- ✅ **AI CAN**: Create, modify, and interact with UI elements
- ❌ **AI CANNOT**: Access sensitive data, file systems, or network resources

## 📋 Available AI Methods

### 1. UI Element Creation

#### `addButton(text, id?, style?)`
**Purpose**: Create interactive buttons  
**Security**: Text length limited to 100 characters  
**Example**: `addButton("Click Me", null, { color: "purple", size: "large" })`

**Parameters**:
- `text` (string, required): Button text
- `id` (number, optional): Unique identifier
- `style` (object, optional): Styling configuration
  - `color`: purple | blue | green | red | gold | magic
  - `size`: small | medium | large
  - `theme`: Visual theme identifier

#### `addCard(title, content, id?, style?)`
**Purpose**: Create information cards  
**Security**: Title ≤200 chars, Content ≤1000 chars  
**Example**: `addCard("Status", "System operational", null, { color: "blue" })`

**Parameters**:
- `title` (string, required): Card title
- `content` (string, required): Card content
- `id` (number, optional): Unique identifier
- `style` (object, optional): Styling configuration

#### `addCounter(label, id?, style?)`
**Purpose**: Create progress counters  
**Security**: Label limited to 100 characters  
**Example**: `addCounter("Progress", null, { color: "green" })`

**Parameters**:
- `label` (string, required): Counter label
- `id` (number, optional): Unique identifier
- `style` (object, optional): Styling configuration

#### `addImage(content, alt, id?, style?)`
**Purpose**: Add visual elements (emojis/text)  
**Security**: Content ≤50 chars, Alt text ≤200 chars  
**Example**: `addImage("🚀", "Rocket icon", null, { color: "space" })`

**Parameters**:
- `content` (string, required): Image content (emoji or text)
- `alt` (string, required): Alternative text description
- `id` (number, optional): Unique identifier
- `style` (object, optional): Styling configuration

#### `addStoryElement(type, content, id?)`
**Purpose**: Create narrative elements  
**Security**: Content limited to 2000 characters  
**Example**: `addStoryElement("title", "Chapter 1: The Beginning")`

**Parameters**:
- `type` (string, required): title | paragraph | character
- `content` (string, required): Story content
- `id` (number, optional): Unique identifier

### 2. State Manipulation

#### `incrementCounter(id, amount?)`
**Purpose**: Increment counter values  
**Security**: Amount limited to 1-1000  
**Example**: `incrementCounter(12345, 5)`

**Parameters**:
- `id` (number, required): Counter ID to increment
- `amount` (number, optional): Amount to increment (default: 1)

#### `changeBackground(style)`
**Purpose**: Modify interface background  
**Security**: CSS injection protection, 500 char limit  
**Example**: `changeBackground("background: linear-gradient(45deg, #purple, #blue)")`

**Parameters**:
- `style` (string, required): CSS style string

#### `setTheme(themeName)`
**Purpose**: Apply predefined themes  
**Security**: Only predefined themes allowed  
**Example**: `setTheme("space")`

**Parameters**:
- `themeName` (string, required): space | ocean | forest | sunset | magical | corporate | default

### 3. Utility Methods (Read-Only)

#### `getElementCount(elementType?)`
**Purpose**: Count UI elements  
**Returns**: Number of elements  
**Example**: `getElementCount("button")` → `5`

#### `getActiveTheme()`
**Purpose**: Get current theme  
**Returns**: Current theme name  
**Example**: `getActiveTheme()` → `"space"`

#### `getActionLog(limit?)`
**Purpose**: Retrieve action history  
**Returns**: Array of log entries  
**Example**: `getActionLog(10)` → `[{timestamp, method, params, result}...]`

## 🎨 Supported Values

### Colors
```javascript
COLOR_SCHEMES = {
  PURPLE: 'purple',
  BLUE: 'blue',
  GREEN: 'green',
  RED: 'red',
  GOLD: 'gold',
  MAGIC: 'magic'
}
```

### Themes
```javascript
THEME_NAMES = {
  SPACE: 'space',      // Dark cosmic theme
  OCEAN: 'ocean',      // Blue gradient theme
  FOREST: 'forest',    // Green nature theme
  SUNSET: 'sunset',    // Orange/pink theme
  MAGICAL: 'magical',  // Purple mystical theme
  CORPORATE: 'corporate', // Professional theme
  DEFAULT: 'default'   // No theme
}
```

### Story Types
```javascript
STORY_TYPES = {
  TITLE: 'title',         // Large headings
  PARAGRAPH: 'paragraph', // Regular text blocks
  CHARACTER: 'character'  // Character descriptions
}
```

## 🔍 Usage Examples

### Creating a Complete Interface
```javascript
// Set theme
setTheme("magical")

// Add story elements
addStoryElement("title", "🧙‍♂️ The Wizard's Academy")
addStoryElement("paragraph", "Welcome to the mystical academy where magic comes alive...")

// Add interactive elements
addButton("Cast Spell", null, { color: "magic", size: "large" })
addCounter("Spells Cast", null, { color: "purple" })

// Add information
addCard("Progress", "You've mastered 3 out of 10 spells!", null, { color: "purple" })
```

### Error Handling Example
```javascript
try {
  addButton("", 123, {}) // This will fail - empty text
} catch (error) {
  console.error("Failed to add button:", error.message)
  // Error: "Button text must be a non-empty string"
}
```

## 🏢 Enterprise Features

### Audit Trail
Every action is automatically logged:
```javascript
{
  timestamp: "2024-01-15T10:30:00.000Z",
  method: "addButton",
  params: '{"text":"Click Me","id":12345,"style":{"color":"purple"}}',
  result: "success",
  id: 1705312200000.123
}
```

### Resource Protection
- Maximum 100 log entries kept in memory
- Input validation prevents excessive resource usage
- CSS injection protection on style inputs
- Length limits on all text inputs

### Validation Rules
- **Text Fields**: No HTML tags, reasonable length limits
- **Numeric Fields**: Range validation, type checking
- **Enum Fields**: Strict whitelist validation
- **Style Objects**: CSS injection protection

## 🚫 Limitations by Design

### What AI Cannot Do
1. **File System Access**: Cannot read/write files
2. **Network Requests**: Cannot make HTTP calls
3. **Arbitrary Code**: Cannot execute custom JavaScript
4. **DOM Manipulation**: Cannot directly modify DOM
5. **Event Handlers**: Cannot attach custom event listeners
6. **External Libraries**: Cannot import or use external code

### Why These Limitations Exist
- **Security**: Prevents malicious code execution
- **Predictability**: Ensures consistent behavior
- **Maintainability**: Easy to understand and debug
- **Performance**: Controlled resource usage
- **Audit**: Every action is traceable

## 🔄 Integration Guide

### Using the Registry
```javascript
import { createAIManipulationRegistry } from './services/aiManipulationRegistry.js'

// Create registry with UI state
const registry = createAIManipulationRegistry({
  elements: ref([]),
  storyElements: ref([]),
  counters: reactive({}),
  backgroundStyle: ref('')
})

// Get available methods
const methods = registry.getAvailableMethods()

// Use methods safely
methods.addButton("Hello World", null, { color: "blue" })
```

### AI Service Integration
```javascript
// In aiService.js
async processCommand(command, manipulationRegistry) {
  // AI can only use methods from the registry
  const methods = manipulationRegistry.getAvailableMethods()
  
  // Execute AI-requested function calls
  methods.addButton(aiGeneratedText, aiGeneratedId, aiGeneratedStyle)
}
```

## 📊 Monitoring & Debugging

### Get Current State
```javascript
const count = getElementCount()           // Total elements
const buttonCount = getElementCount("button") // Just buttons
const theme = getActiveTheme()            // Current theme
const recent = getActionLog(5)            // Last 5 actions
```

### Clear State
```javascript
// Reset everything (useful for demos)
registry.clearAllElements()
```

## 🛡️ Security Best Practices

1. **Always validate registry instance** before passing to AI
2. **Monitor action logs** for unusual patterns
3. **Set reasonable limits** on AI usage per session
4. **Review registry methods** before adding new capabilities
5. **Test input validation** with edge cases
6. **Keep audit trails** for compliance requirements

---

## 📝 Summary

The AI Manipulation Registry provides a **secure, controlled, and auditable** way for AI systems to manipulate user interfaces. By centralizing all AI-accessible methods in one place, we achieve:

- ✅ **Clear boundaries** of what AI can do
- ✅ **Enterprise-level security** with validation and logging
- ✅ **Easy maintenance** and feature additions
- ✅ **Predictable behavior** and error handling
- ✅ **Complete audit trails** for compliance

This architecture scales to enterprise applications while maintaining security and performance standards.
