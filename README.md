# FormBuilder: Dynamic Form Creation Tool

![FormBuilder Screenshot](screenshot.png)

FormBuilder is a powerful, drag-and-drop form creation tool built with React, TypeScript, and Tailwind CSS. It allows users to create complex forms with multiple field types, organize them into fieldsets, and customize properties for each field.

## Table of Contents

- [Features](#features)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Running the Application](#running-the-application)
- [Usage Guide](#usage-guide)
  - [Creating Forms](#creating-forms)
  - [Adding and Managing Fields](#adding-and-managing-fields)
  - [Reordering Fields](#reordering-fields)
  - [Field Properties](#field-properties)
- [Technical Overview](#technical-overview)
  - [Project Structure](#project-structure)
  - [Key Components](#key-components)
  - [State Management](#state-management)
- [Dependencies](#dependencies)
- [Contributing](#contributing)
- [License](#license)

## Features

- **Intuitive Drag-and-Drop Interface**: Easily add and organize form fields with visual feedback
- **Multiple Field Types**: Support for text fields, checkboxes, radio buttons, dropdowns, date pickers, and more
- **Field Organization**: Group related fields using fieldsets
- **Field Reordering**: Change the order of fields within fieldsets through drag-and-drop
- **Dynamic Properties Panel**: Configure field properties including labels, options, and required status
- **Responsive Design**: Works seamlessly across desktop and mobile devices
- **Modern UI**: Clean and intuitive interface with visual feedback for interactions

## Getting Started

### Prerequisites

- Node.js (v14.0.0 or later)
- npm (v6.0.0 or later) or yarn (v1.22.0 or later)

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/formbuilder.git
cd formbuilder
```

2. Install dependencies:

```bash
npm install
# or
yarn install
```

### Running the Application

Start the development server:

```bash
npm run dev
# or
yarn dev
```

The application will be available at `http://localhost:5173`.

## Usage Guide

### Creating Forms

When you first open FormBuilder, you'll see a blank canvas with a welcome message. Follow these steps to create a form:

1. **Add a Fieldset**: Fieldsets are containers that organize related form fields. Click on the "Add Fieldset" button to create your first fieldset.

2. **Name Your Fieldset**: Click on the fieldset title to edit it, giving it a descriptive name like "Personal Information" or "Contact Details".

3. **Add Fields to Your Fieldset**: Drag field types from the left sidebar panel onto your fieldset. You'll see a highlighted drop area when dragging over valid drop targets.

### Adding and Managing Fields

The left sidebar contains various field types you can add to your form:

- **Text Field**: For single-line text input
- **Text Area**: For multi-line text input
- **Number Input**: For numerical values
- **Checkbox**: For yes/no or true/false options
- **Radio Button**: For selecting one option from a list
- **Dropdown/Combo Box**: For selecting from a dropdown list
- **Date Picker**: For selecting dates

To add a field:

1. Click and drag a field type from the sidebar
2. Drag it over a fieldset until you see the drop area highlighted
3. Release to drop the field into the fieldset

### Reordering Fields

You can change the order of fields within a fieldset:

1. Click and drag the field's drag handle (the vertical dots icon)
2. Drag the field to the desired position within the same fieldset
3. Release to place the field in its new position

The other fields will automatically adjust to make space for the moved field.

### Field Properties

When you select a field, the right sidebar displays its properties. Here you can:

1. **Set Field Labels**: Change the display name of your field
2. **Edit Fieldset Name**: Change the parent fieldset name
3. **Manage Options**: For fields like dropdowns, radio buttons, and checkboxes, you can add, edit, or remove options
4. **Apply Changes**: Click the "Apply" button to save your modifications
5. **Delete Field**: Remove the field from your form

For fields that support options (like dropdowns and radio buttons):
- Type a new option name in the "Add new option" field
- Click the plus icon or press Enter to add it
- Click the trash icon next to an existing option to remove it

## Technical Overview

### Project Structure

```
formbuilder/
├── public/            # Static assets
├── src/               # Source files
│   ├── components/    # React components
│   ├── store/         # State management
│   ├── types/         # TypeScript type definitions
│   ├── App.tsx        # Main application component
│   └── main.tsx       # Application entry point
├── index.html         # HTML template
└── package.json       # Project dependencies and scripts
```

### Key Components

- **FormCanvas**: The main area where form fieldsets and fields are displayed
- **CustomFieldPanel**: The left sidebar with draggable field types
- **FieldProperties**: The right sidebar for editing field properties
- **Fieldset**: Container component for organizing related fields
- **FormField**: Component for rendering individual form fields
- **DragAndDropContext**: Provides drag-and-drop functionality throughout the application

### State Management

The application uses React's Context API for state management:

- **FormBuilderContext**: Manages the form structure, selected fields, and provides actions for manipulating the form
- Key actions include:
  - Adding/removing fieldsets
  - Adding/updating/deleting fields
  - Reordering fields within fieldsets
  - Selecting fields for property editing

## Dependencies

- **React**: UI library
- **TypeScript**: Static typing
- **Tailwind CSS**: Utility-first CSS framework
- **@dnd-kit**: Drag-and-drop functionality
- **UUID**: Generating unique identifiers
- **React Icons**: Icon components

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config({
  plugins: {
    // Add the react-x and react-dom plugins
    'react-x': reactX,
    'react-dom': reactDom,
  },
  rules: {
    // other rules...
    // Enable its recommended typescript rules
    ...reactX.configs['recommended-typescript'].rules,
    ...reactDom.configs.recommended.rules,
  },
})
```
# FormBuilder
