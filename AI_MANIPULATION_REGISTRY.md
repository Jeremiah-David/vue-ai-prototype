# AI Manipulation Registry Documentation

## Overview

The AI Manipulation Registry provides a **secure, controlled interface** for AI systems to create and manage events. This registry serves as the **single source of truth** for what the AI can and cannot do in event creation, providing enterprise-level security and clear audit trails.

**Current Implementation**: Event Creation Tool with 4 controlled methods for building event interfaces.

## 🔐 Security Model

### Key Principles
1. **Whitelist Approach**: AI can ONLY execute methods defined in the registry
2. **Input Validation**: All parameters are validated before execution
3. **Audit Trail**: Every action is logged with timestamp and parameters
4. **Error Handling**: Graceful failure with detailed error messages
5. **Resource Limits**: Built-in protection against excessive resource usage

### Security Boundaries
- ✅ **AI CAN**: Execute pre-approved event creation methods
- ❌ **AI CANNOT**: Run arbitrary code, access external systems, or execute methods outside the registry
- ✅ **AI CAN**: Create and modify event information (name, description, tickets, waitlist)
- ❌ **AI CANNOT**: Access sensitive data, file systems, or network resources

## 📋 Available AI Methods

The AI can execute exactly **4 controlled methods** for event creation:

### 1. Event Information

#### `setEventName(name)`
**Purpose**: Set the main event name  
**Security**: Name limited to 3-100 characters, HTML tags stripped  
**Example**: `setEventName("Tech Conference 2025")`

**Parameters**:
- `name` (string, required): Event name

#### `setEventDescription(description)`
**Purpose**: Set the event description  
**Security**: Description limited to 10-500 characters, HTML tags stripped  
**Example**: `setEventDescription("Join us for a day of innovation and networking")`

**Parameters**:
- `description` (string, required): Event description

### 2. Ticket Management

#### `addTicketType(name, price?)`
**Purpose**: Add or update ticket types  
**Security**: Name limited to 2-50 characters, price must be positive number  
**Example**: `addTicketType("VIP", 299)` or `addTicketType("General Admission")`

**Parameters**:
- `name` (string, required): Ticket type name
- `price` (number, optional): Ticket price (can be null for free tickets)

#### `toggleWaitlist(enabled)`
**Purpose**: Enable or disable event waitlist  
**Security**: Only boolean values accepted  
**Example**: `toggleWaitlist(true)` or `toggleWaitlist(false)`

**Parameters**:
- `enabled` (boolean, required): Whether waitlist should be enabled

## 🎨 Supported Values

### Available Ticket Types
```javascript
TICKET_TYPES = {
  GENERAL: 'General Admission',
  VIP: 'VIP',
  EARLY_BIRD: 'Early Bird',
  STUDENT: 'Student',
  PREMIUM: 'Premium',
  STANDARD: 'Standard'
}
```

### Validation Rules
- **Event Names**: 3-100 characters, no HTML tags
- **Event Descriptions**: 10-500 characters, no HTML tags  
- **Ticket Names**: 2-50 characters, no HTML tags
- **Ticket Prices**: Positive numbers or null for free tickets
- **Waitlist Status**: Boolean values only (true/false)

## 🔍 Usage Examples

### Creating a Complete Event
```javascript
// Set basic event information
setEventName("AI & Technology Summit 2025")
setEventDescription("Join industry leaders for cutting-edge AI discussions and networking")

// Add ticket types with different pricing
addTicketType("Early Bird", 199)
addTicketType("General Admission", 299)
addTicketType("VIP", 499)
addTicketType("Student", 99)

// Enable waitlist for sold-out events
toggleWaitlist(true)
```

### Example AI Commands
- "Create a tech conference in San Francisco with VIP tickets"
- "Make a music festival with general admission and student tickets"
- "Set up a corporate training event with waitlist enabled"
- "Create a workshop with early bird pricing at $150"

### Error Handling Example
```javascript
try {
  setEventName("") // This will fail - too short
} catch (error) {
  console.error("Failed to set event name:", error.message)
  // Error: "Event name must be between 3 and 100 characters"
}
```

## 🏢 Enterprise Features

### Audit Trail
Every action is automatically logged:
```javascript
{
  timestamp: "2024-01-15T10:30:00.000Z",
  method: "setEventName",
  params: '{"name":"Tech Conference 2025"}',
  result: "success",
  id: 1705312200000.123
}
```

### Resource Protection
- Maximum 100 log entries kept in memory
- Input validation prevents excessive resource usage
- HTML tag stripping for security
- Length limits on all text inputs

### Validation Rules
- **Text Fields**: No HTML tags, reasonable length limits
- **Numeric Fields**: Range validation, type checking
- **Boolean Fields**: Strict boolean validation
- **Duplicate Handling**: Existing ticket types are updated, not duplicated

## 🚫 Limitations by Design

### What AI Cannot Do
1. **File System Access**: Cannot read/write files
2. **Network Requests**: Cannot make HTTP calls
3. **Arbitrary Code**: Cannot execute custom JavaScript
4. **UI Framework Access**: Cannot directly modify Vue components
5. **Event Handlers**: Cannot attach custom event listeners
6. **External Libraries**: Cannot import or use external code
7. **Database Operations**: Cannot persist data beyond the session

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

// Create registry with event state
const registry = createAIManipulationRegistry({
  eventName: ref(''),
  eventDescription: ref(''),
  ticketTypes: ref([]),
  waitlistEnabled: ref(false)
})

// Get available methods
const methods = registry.getAvailableMethods()

// Use methods safely
methods.setEventName("My Event")
methods.addTicketType("General Admission", 50)
```

### AI Service Integration
```javascript
// In aiService.js
async processCommand(command, manipulationRegistry) {
  // AI can only use methods from the registry
  const methods = manipulationRegistry.getAvailableMethods()
  
  // Execute AI-requested function calls
  methods.setEventName(aiGeneratedName)
  methods.addTicketType(aiGeneratedTicketName, aiGeneratedPrice)
}
```

## 📊 Monitoring & Debugging

### Get Current State
```javascript
const eventState = registry.getEventState()
// Returns: { eventName, eventDescription, ticketTypes, waitlistEnabled }

const actionHistory = registry.getActionLog()
// Returns: Array of all AI actions with timestamps
```

### Development Tools
```javascript
// View current event configuration
console.log(registry.getEventState())

// Monitor AI actions in real-time
registry.getActionLog().forEach(action => {
  console.log(`${action.timestamp}: ${action.method}`)
})
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

The AI Manipulation Registry provides a **secure, controlled, and auditable** way for AI systems to create and manage events. By limiting AI access to exactly 4 predefined methods, we achieve:

- ✅ **Clear boundaries** of what AI can do (only event creation)
- ✅ **Enterprise-level security** with validation and logging
- ✅ **Simple, focused functionality** for event management
- ✅ **Predictable behavior** and error handling
- ✅ **Complete audit trails** for compliance

This architecture demonstrates how AI can be safely integrated into business applications while maintaining strict security controls.
