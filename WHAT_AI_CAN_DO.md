# 🤖 What Can the AI Manipulate?

**This file provides a simple, clear overview of EXACTLY what the AI is allowed to do.**

---

## ✅ AI CAN Do These Things:

### 🔘 Create UI Elements
- **Buttons** with custom text and colors
- **Cards** with titles and content  
- **Counters** with labels for tracking progress
- **Images** using emojis or text
- **Story elements** like titles, paragraphs, and character descriptions

### 🎨 Change Appearance
- **Set themes**: space, ocean, forest, sunset, magical, corporate
- **Change backgrounds** with CSS gradients
- **Apply colors**: purple, blue, green, red, gold, magic

### 📊 Modify Data
- **Increment counters** by specified amounts
- **Track progress** across multiple counters

### 🔍 Read Information
- **Count elements** by type
- **Check current theme**
- **View action history**

---

## ❌ AI CANNOT Do These Things:

### 🚫 Security Restrictions
- **Cannot run arbitrary code** or custom JavaScript
- **Cannot access files** or the file system
- **Cannot make network requests** or API calls
- **Cannot access external websites** or services

### 🚫 System Restrictions  
- **Cannot modify core application** settings
- **Cannot access user data** outside the demo area
- **Cannot install software** or extensions
- **Cannot execute terminal commands**

### 🚫 UI Restrictions
- **Cannot directly manipulate DOM** elements
- **Cannot add custom CSS** beyond predefined styles
- **Cannot create custom components** beyond the allowed types
- **Cannot attach custom event handlers**

---

## 📋 Complete Method List

**These are ALL the methods the AI can use:**

```
✅ addButton(text, id?, style?)
✅ addCard(title, content, id?, style?)  
✅ addCounter(label, id?, style?)
✅ addImage(content, alt, id?, style?)
✅ addStoryElement(type, content, id?)
✅ incrementCounter(id, amount?)
✅ changeBackground(style)
✅ setTheme(themeName)
✅ getElementCount(type?)
✅ getActiveTheme()
✅ getActionLog(limit?)
```

**That's it. The AI cannot do anything else.**

---

## 🛡️ Security Features

### ✅ Input Validation
- Text length limits (100-2000 characters depending on field)
- Color validation (only predefined colors allowed)
- Theme validation (only predefined themes allowed)
- CSS injection protection

### ✅ Audit Trail
- Every AI action is logged with timestamp
- Parameters and results are recorded
- Action history is available for review

### ✅ Resource Protection
- Limits on increment amounts (max 1000)
- Memory limits on stored data
- Automatic cleanup of old logs

### ✅ Error Handling
- Graceful failure for invalid inputs
- Detailed error messages for debugging
- No system crashes from bad input

---

## 🎯 Example Commands AI Can Process

### Story Creation
- "Create a magical story with purple buttons"
- "Build a space adventure with rocket buttons"
- "Make a pirate tale with treasure counters"

### UI Manipulation  
- "Add three blue buttons for navigation"
- "Create a progress counter for user engagement"
- "Change to a forest theme with green colors"
- "Add a status card showing current progress"

### Data Interaction
- "Increment the score counter by 10"
- "Show how many buttons are currently displayed"
- "Change background to a sunset gradient"

---

## 📁 File Locations

**Where to find the AI manipulation code:**

- **Registry Definition**: `/src/services/aiManipulationRegistry.js`
- **AI Service**: `/src/services/aiService.js`  
- **UI Component**: `/src/components/Home.vue`
- **Documentation**: `/AI_MANIPULATION_REGISTRY.md`

---

## 🔄 How It Works

1. **User types command** → AI analyzes intent
2. **AI selects methods** → Only from approved registry  
3. **Registry validates input** → Checks parameters & limits
4. **Method executes safely** → Creates/modifies UI elements
5. **Action gets logged** → Audit trail updated
6. **User sees results** → Visual feedback in interface

---

## 🎉 Summary

The AI manipulation system provides a **secure, controlled environment** where AI can create engaging user interfaces while maintaining strict security boundaries. The AI can build rich, interactive experiences using the approved methods, but cannot access sensitive systems or execute dangerous code.

**This design ensures the AI is helpful but safe.**
