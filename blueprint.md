# Project Blueprint

## Overview

This document outlines the plan and progress for building a modern, responsive recipe application using React and Firebase. The application will allow users to browse, create, and manage recipes, with a focus on a clean user interface and a great user experience.

## Implemented Features

*   **Project Setup:**
    *   Initialized a React project with Vite.
    *   Installed necessary dependencies:
        *   `@mui/material`, `@emotion/react`, `@emotion/styled`, `@mui/icons-material` for UI components.
        *   `react-router-dom` for routing.
        *   `react-hook-form` for form management.
        *   `zustand` for state management.
        *   `react-dropzone` for file uploads.
        *   `@google/generative-ai` for interacting with the Gemini API.
    *   Created the basic directory structure for the project.

## Current Goal: Initial UI and Core Components

This is the first version of the application. I will start by creating the basic UI structure and the core components.

### Plan

1.  **Theme and Styling:**
    *   Create a custom theme using Material-UI to define the application's color palette, typography, and overall look and feel.
    *   Create a `theme.js` file in `src/styles` to house the theme configuration.
2.  **Layout Components:**
    *   Create a `Header` component with the application's logo and navigation links.
    *   Create a `Footer` component with basic information.
    *   Create a main `Layout` component that combines the `Header`, `Footer`, and the main content area.
3.  **Routing:**
    *   Set up basic routing using `react-router-dom` to navigate between the main pages.
    *   Create placeholder pages for `Home`, `Recipes`, and `Create Recipe`.
4.  **State Management:**
    *   Set up a basic store using `zustand` to manage the application's global state.
5.  **Gemini API Integration:**
    *   Create a service to interact with the Gemini API.
6.  **Core Components:**
    *   Create a `RecipeCard` component to display a summary of a recipe.
    *   Create a `RecipeForm` component for creating and editing recipes.
7.  **Main App Component:**
    *   Update the main `App.jsx` to use the `Layout`, `ThemeProvider`, and the router.
