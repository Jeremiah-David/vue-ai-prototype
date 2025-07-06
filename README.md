IF NEEDED CONTACT JEREMIAH FOR API KEY

## ⚡ Quick Start

### Prerequisites
- Node.js (v20.19.0+ recommended)
- OpenAI API key (optional - will use mock mode without it)

### Installation

1. **Clone and Install**:
```bash
git clone <repository-url>
cd aialpha
npm install
```

2. **Configure OpenAI (Optional)**:
```bash
# Copy environment template
cp .env.example .env

# Edit .env and add your OpenAI API key
# IMPORTANT: Your .env file is in .gitignore and will NOT be committed
VITE_OPENAI_API_KEY=sk-your-api-key-here
```

⚠️ **Security Note**: Your `.env` file is automatically ignored by git and will never be committed. Your API key remains private and secure.

3. **Start Development Server**:
```bash
npm run dev
```

4. **Open Browser**: Navigate to `http://localhost:5173`

## 🔧 Configuration Options

### Environment Variables
```bash
# OpenAI Configuration
VITE_OPENAI_API_KEY=your_openai_api_key_here  # Get from platform.openai.com
VITE_AI_MODEL=gpt-4                           # AI model to use
VITE_AI_TEMPERATURE=0.7                       # Response creativity (0-1)
VITE_AI_MODE=real                            # 'real' or 'mock'
```

# AI Alpha - AI-Driven Event Creation Platform

A sophisticated Vue 3 prototype demonstrating real AI-powered event creation using OpenAI's GPT-4. Users can type natural language commands to dynamically create events, configure tickets, and manage waitlists in real-time.

## 🚀 Project Overview

AI Alpha showcases the future of event management by allowing natural language control over event creation. Built for enterprise stakeholder demonstrations, this prototype proves the viability of AI-driven business applications at scale.

**Key Capabilities:**
- **Real AI Integration**: Uses OpenAI's GPT-4 with function calling for controlled event management
- **Natural Language Processing**: Type commands like "Create a tech conference with VIP tickets"
- **Secure Function Execution**: AI can only execute predefined, safe event creation methods
- **Enterprise Ready**: Built with Vue 3, security-first architecture, and scalable patterns
- **Fallback Mode**: Graceful degradation to mock AI when OpenAI is unavailable

## 🎯 Live Demo Features

### Event Creation Commands
```bash
# Conference Setup
"Create a tech conference in San Francisco with professional tickets"
"Set up a leadership training workshop for executives"

# Festival Management  
"Make a music festival with VIP and general admission tickets"
"Create a food festival with children and adult pricing"

# Ticket Configuration
"Add student tickets at half price with waitlist enabled"
"Set up early bird, standard, and premium ticket types"

# Waitlist Management
"Enable waitlist for sold-out events"
"Create a workshop with limited capacity and waitlist"
```

## 🛠️ Technical Implementation

### Real AI Integration
- **OpenAI GPT-4**: Natural language understanding and intent recognition
- **Function Calling**: Structured execution of predefined UI methods
- **Context Management**: Conversation history for coherent interactions
- **Error Handling**: Automatic fallback to mock mode on API failures

### Available AI Functions
```javascript
// Core Event Management Methods (AI can execute these)
setEventName(name)                 // Set event name and details
setEventDescription(description)   // Configure event description  
addTicketType(name, price)        // Add ticket types with pricing
toggleWaitlist(enabled)           // Enable/disable waitlist management
```

## 🔐 AI Manipulation Registry

### Security-First Architecture
This application uses a **dedicated AI Manipulation Registry** that provides enterprise-level security and clear boundaries for AI interactions:

- **📋 Explicit Method Registry**: All AI-accessible methods are defined in `/src/services/aiManipulationRegistry.js`
- **🛡️ Security Boundary**: AI can ONLY execute methods from the registry - no arbitrary code execution
- **📊 Audit Trail**: Every AI action is logged with timestamps and parameters
- **✅ Input Validation**: All parameters are validated before execution
- **🚫 Injection Protection**: All inputs are sanitized for security

### What AI Can Do
The AI has access to these **controlled, secure methods**:

```javascript
// Event Creation (with validation)
setEventName(name)                 // Set event name (3-100 chars, sanitized)
setEventDescription(description)   // Set description (10-500 chars, sanitized)
addTicketType(name, price)        // Add ticket types (name validation, price validation)
toggleWaitlist(enabled)           // Enable/disable waitlist (boolean only)
```

### Security Features
- **✅ Whitelist Approach**: Only pre-approved methods can be executed
- **✅ Parameter Validation**: Text length limits, type checking, sanitization
- **✅ Resource Protection**: Memory limits, action logging, automatic cleanup
- **✅ Injection Prevention**: HTML tag stripping and input sanitization
- **✅ Audit Compliance**: Complete action history with timestamps

### Quick Start Files
- ** Detailed Docs**: [`AI_MANIPULATION_REGISTRY.md`](./AI_MANIPULATION_REGISTRY.md) - Complete technical documentation  
- **🔒 Security Guide**: [`SECURITY.md`](./SECURITY.md) - Security implementation details


### AI Status Indicator
The interface shows whether you're using:
- 🟢 **Real AI Active**: OpenAI GPT-4 processing commands
- 🟡 **Mock AI Mode**: Local simulation (no API key required)

## 🎪 Demo Scenarios

### Built-in Scenarios
1. **Tech Conference**: Professional conference with multiple ticket types
2. **Music Festival**: Entertainment event with age-based and premium tickets
3. **Corporate Training**: Business workshop with professional settings
4. **Community Event**: Local gathering with accessible pricing

### Custom Commands
```bash
# Event Management Examples
"Create a healthcare summit with medical professional and student tickets"
"Build a startup pitch competition with investor and general admission"
"Make a charity fundraiser with donor levels and waitlist"
"Design a workshop series with early bird pricing and capacity limits"
```

## 🏗️ Architecture

### Component Structure
```
src/
├── components/
│   └── Home.vue              # Main event creation interface
├── services/
│   ├── aiManipulationRegistry.js  # Secure AI method registry  
│   └── aiService.js          # OpenAI integration & function calling
├── assets/                   # Static assets
└── main.js                   # Application entry point
```

### AI Service Architecture
```javascript
class AIService {
  // Real OpenAI integration with function calling
  processCommand(command, uiMethods)
  
  // Predefined function definitions for AI
  getAvailableFunctions()
  
  // Secure function execution
  executeFunctionCall(functionCall, uiMethods)
  
  // Conversation context management
  addToHistory(role, content)
  
  // Graceful fallback to mock mode
  mockProcessor(command, uiMethods)
}
```

## 📊 Enterprise Features

### Security & Control
- ✅ **Controlled Execution**: AI can only call predefined event management methods
- ✅ **No Code Injection**: Structured function calling prevents arbitrary code
- ✅ **Input Validation**: All parameters validated before execution
- ✅ **Error Isolation**: Failures don't crash the application

### Scalability
- ✅ **Modular Architecture**: Easy to extend with new event management features
- ✅ **State Management**: Reactive Vue 3 state handling
- ✅ **Performance Optimized**: Efficient rendering and updates
- ✅ **Browser Compatible**: Modern ES6+ with Vite bundling

### Monitoring & Debugging
- ✅ **Console Logging**: Detailed execution tracking
- ✅ **Command History**: Visual feedback of all interactions
- ✅ **Mode Indicators**: Clear AI status visibility
- ✅ **Error Handling**: Graceful failure modes

## 🚧 Development Roadmap

### Current Phase: Event Creation Tool ✅
- AI-driven event name and description generation
- Intelligent ticket type configuration
- Waitlist management with AI commands
- Secure registry architecture with audit trails

### Future Enhancements
- Multi-event management and organization
- Advanced pricing models and discount codes
- Integration with ticketing platforms
- Enhanced security and enterprise features

## 📝 Available Scripts

```bash
npm run dev      # Start development server with hot reload
npm run build    # Build optimized production bundle  
npm run preview  # Preview production build locally
npm install      # Install all dependencies
npm ci          # Clean install from lock file
```

## 🤝 Contributing

This is an enterprise prototype for stakeholder demonstration. For questions about implementation or extending the platform:

1. Review the technical documentation in `AI_MANIPULATION_REGISTRY.md`
2. Check security guidelines in `SECURITY.md`
3. Understand the AI integration architecture in `src/services/aiService.js`

## 📋 Success Criteria

- ✅ Natural language commands create immediate event configurations
- ✅ Demonstrates clear value proposition for AI-driven business applications
- ✅ Shows enterprise scalability potential for event management
- ✅ Provides smooth, professional demo experience
- ✅ Real AI integration with OpenAI GPT-4 and secure boundaries

## 🔗 Links

- **OpenAI API**: https://platform.openai.com/api-keys
- **Vue 3 Documentation**: https://vuejs.org/guide/
- **Vite Build Tool**: https://vitejs.dev/guide/

---

*Built with Vue 3, Vite, Tailwind CSS, and OpenAI GPT-4 • Enterprise AI Event Creation Platform*