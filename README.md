# Chem-Sim 🧪

A sophisticated Chemical Simulation Laboratory built with React and TypeScript. Explore the wonders of chemistry through an interactive, visual interface designed for discovery and learning.

![Sample Screenshot](https://via.placeholder.com/800x450/0a0f1e/f8fafc?text=Chem-Sim+Laboratory+Interface)

## ✨ Overview

**Chem-Sim** (Reaction Lab) is a modern web application that allows users to experiment with chemical elements and reactions in a gamified environment. Drag elements onto the workbench, apply conditions, and discover new substances through realistic chemical synthesis pathways.

## 🚀 Key Features

- **Interactive Workbench**: A drag-and-drop environment for combining chemical elements.
- **Dynamic Element Library**: Access a wide range of elements with their real atomic properties.
- **Advanced Reaction Engine**: Simulate complex chemical reactions based on real-world stoichiometry and conditions.
- **Objective System**: Progress through tiers of challenges, from basic inorganic synthesis to advanced organic chemistry.
- **Glassmorphism UI**: A premium, dark-themed interface with smooth animations and micro-interactions.
- **Reaction Log**: Keep track of all your successful discoveries and synthesis equations.
- **Discovery Feedback**: Detailed information on newly synthesized molecules and materials.

## 🛠️ Tech Stack

- **Core**: React 19, TypeScript
- **Build Tool**: Vite
- **Styling**: Vanilla CSS (Custom Glassmorphism Design System)
- **State Management**: Custom React Hooks
- **Icons**: SVG-based element representations

## 📦 Project Structure

```text
src/
├── components/     # UI Components (Workbench, Library, ObjectivePanel, etc.)
├── data/           # Chemical data (Elements, Reactions, Objectives, Quizzes)
├── hooks/          # Core logic (Game Engine, Objective System)
├── styles/         # Global styles and design system
└── App.tsx         # Main application entry point
```

## 🚥 Getting Started

### Prerequisites

- Node.js (Latest LTS recommended)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/vegeta2op/Chem-Sim.git
   cd Chem-Sim
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Build for production:
   ```bash
   npm run build
   ```

## 🧪 How to Play

1. **Select Elements**: Browse the sidebar library for available chemical elements.
2. **Setup Workbench**: Drag and drop elements onto the central workbench area.
3. **Initiate Reaction**: Click the "React" button. If the combination and conditions are correct, a new substance will be discovered.
4. **Complete Objectives**: Check the Objective Panel for specific synthesis goals and progress through chemistry tiers.
5. **Reset Progress**: Use the "Reset Progress" button in the top right to start a fresh laboratory session.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

Developed with ❤️ by [vegeta2op](https://github.com/vegeta2op)
