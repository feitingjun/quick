import plugin from 'tailwindcss/plugin'

export default plugin(({ addUtilities }) => {
  addUtilities({
    '.text-base': {
      color: 'var(--ant-color-text-base)'
    },
    '.text-heading': {
      color: 'var(--ant-color-text-heading)'
    },
    '.text-label': {
      color: 'var(--ant-color-text-label)'
    },
    '.test-secondary': {
      color: 'var(--ant-color-text-secondary)'
    },
    '.text-placeholder': {
      color: 'var(--ant-color-text-placeholder)'
    },
    '.text-disabled': {
      color: 'var(--ant-color-text-disabled)'
    },
    '.text-hover': {
      color: 'var(--ant-color-bg-text-hover)'
    },
    '.text-active': {
      color: 'var(--ant-color-bg-text-active)'
    },
    '.border-disabled': {
      'border-color': 'var(--ant-color-border-disabled)'
    },
    '.border-secondary': {
      'border-color': 'var(--ant-color-border-secondary)'
    },
    '.border-primary-hover': {
      'border-color': 'var(--ant-color-primary-border-hover)'
    },
    '.bg-base': {
      'background-color': 'var(--ant-color-bg-base)'
    },
    '.bg-disabled': {
      'background-color': 'var(--ant-color-bg-container-disabled)'
    },
    '.bg-container': {
      'background-color': 'var(--ant-color-bg-container)'
    },
    '.bg-layout': {
      'background-color': 'var(--ant-color-bg-layout)'
    }
  })
})
