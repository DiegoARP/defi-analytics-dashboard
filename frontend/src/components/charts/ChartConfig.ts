export const CHART_THEME = {
    colors: [
        '#60a5fa',  // Light blue
        '#34d399',  // Light emerald
        '#fbbf24',  // Light amber
        '#f87171',  // Light red
        '#a78bfa'   // Light purple
    ],
    
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    
    chart: {
        background: 'transparent',
        padding: {
            top: 20,
            right: 20,
            bottom: 20,
            left: 20
        }
    },
    
    axis: {
        stroke: '#e5e7eb',
        strokeWidth: 1,
        label: {
            fontSize: 12,
            fill: '#6b7280'
        }
    },
    
    grid: {
        stroke: '#f3f4f6',
        strokeDasharray: '3 3'
    },
    
    tooltip: {
        container: {
            background: 'white',
            border: '1px solid #e5e7eb',
            borderRadius: '6px',
            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
            padding: '8px 12px'
        },
        text: {
            fontSize: 12,
            color: '#374151'
        }
    }
};