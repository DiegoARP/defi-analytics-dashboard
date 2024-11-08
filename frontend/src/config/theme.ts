export const THEME = {
    // Modern, clean colors
    primary: '#2563eb',    // Vibrant blue
    success: '#10b981',    // Emerald green
    warning: '#f59e0b',    // Amber
    danger: '#ef4444',     // Red
    neutral: '#6b7280',    // Gray
    
    // Chart colors
    chartColors: [
      '#60a5fa',  // Light blue
      '#34d399',  // Light emerald
      '#fbbf24',  // Light amber
      '#f87171',  // Light red
      '#a78bfa'   // Light purple
    ],
    
    // Gradients for backgrounds
    gradients: {
      light: 'from-gray-50 to-white',
      blue: 'from-blue-50 to-indigo-50',
    }
  } as const;
  
  // Type definitions
  export type ThemeColors = typeof THEME.chartColors[number];
  export type ThemeGradients = keyof typeof THEME.gradients;