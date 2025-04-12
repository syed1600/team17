/**
 * UI Configuration
 * This file centralizes UI styling and theme elements for easy editing
 */

const uiConfig = {
  // Color scheme
  colors: {
    primary: {
      light: 'bg-blue-500',
      default: 'bg-blue-600',
      dark: 'bg-blue-700',
      text: 'text-blue-600',
      border: 'border-blue-500',
    },
    secondary: {
      light: 'bg-gray-100',
      default: 'bg-gray-800',
      dark: 'bg-gray-900',
    },
    accent: {
      success: 'bg-green-600',
      danger: 'bg-red-600',
      warning: 'bg-yellow-600',
      info: 'bg-gray-600',
    },
    status: {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-green-100 text-green-800',
      declined: 'bg-red-100 text-red-800',
      cancelled: 'bg-gray-100 text-gray-800',
    }
  },
  
  // Component styling
  components: {
    // Button styles
    button: {
      primary: 'bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors',
      secondary: 'bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors',
      success: 'bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors',
      danger: 'bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors',
      small: 'px-3 py-1 text-sm',
      large: 'px-6 py-3 text-lg',
      disabled: 'bg-blue-300 cursor-not-allowed',
    },
    
    // Input styling
    input: {
      default: 'w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500',
      error: 'w-full px-3 py-2 border border-red-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500',
    },
    
    // Card styling
    card: {
      default: 'bg-white rounded-lg shadow-md p-6',
      compact: 'bg-white rounded-lg shadow-md p-4',
      interactive: 'bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow',
    },
    
    // Alert/notification styling
    alert: {
      success: 'p-3 mb-4 rounded bg-green-100 text-green-700',
      error: 'p-3 mb-4 rounded bg-red-100 text-red-700',
      warning: 'p-3 mb-4 rounded bg-yellow-100 text-yellow-700',
      info: 'p-3 mb-4 rounded bg-blue-100 text-blue-700',
    },
    
    // Layout utilities
    layout: {
      container: 'container mx-auto px-4',
      section: 'my-8',
      grid: 'grid grid-cols-1 md:grid-cols-3 gap-4',
    },
    
    // Table styling
    table: {
      wrapper: 'overflow-x-auto',
      table: 'min-w-full bg-white',
      header: 'bg-gray-100',
      headerCell: 'py-3 px-4 text-left font-semibold text-gray-600',
      row: 'hover:bg-gray-50',
      cell: 'py-3 px-4',
      divider: 'divide-y',
    },
  },
  
  // Branding elements
  branding: {
    name: 'Barbershop Appointments',
    companyName: 'Classic Cuts Barbershop',
    logo: '/logo.png', // Path to logo if you have one
    favicon: '/favicon.ico',
  },
  
  // Language toggle
  languageToggle: {
    button: 'px-3 py-1 bg-white text-blue-600 rounded-full font-bold hover:bg-blue-100 transition-colors shadow-md',
  }
};

export default uiConfig;
