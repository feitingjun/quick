import { Outlet } from 'react-router'
// import { ConfigProvider } from '@quick/ui'

export default function RootLayout() {
  return (
    // <ConfigProvider
    //   dicts={{
    //     sys: [{ value: 1, label: '启用', status: 'invalid' }]
    //   }}
    // >
    <Outlet />
    // </ConfigProvider>
  )
}
