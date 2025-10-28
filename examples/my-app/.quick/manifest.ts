export default {
  '/': {
    id: '/',
    path: '',
    pathname: '/',
    parentId: 'rootLayout',
    file: '/Users/feitingjun/Documents/文档/study/quick/examples/my-app/src/pages/page.tsx',
    layout: false,
    component: () => import('/Users/feitingjun/Documents/文档/study/quick/examples/my-app/src/pages/page')
  },
  'rootLayout': {
    id: 'rootLayout',
    path: '',
    pathname: '',
    file: '/Users/feitingjun/Documents/文档/study/quick/examples/my-app/src/layouts/index.tsx',
    layout: true,
    component: () => import('/Users/feitingjun/Documents/文档/study/quick/examples/my-app/src/layouts/index')
  }
}