#!/usr/bin/env node
import { existsSync, cpSync, mkdirSync, readFileSync, writeFileSync } from 'fs'
import { resolve } from 'path'
import { text, confirm, isCancel, intro, outro, select, log } from '@clack/prompts'
import { cwd } from 'process'
import { execSync } from 'child_process'

type CopyTemplateOptions = {
  projectName: string
  template: string
}

const __dirname = import.meta.dirname
const IGNORE_FILES = ['node_modules', 'package.json', 'index.html']

// 模板列表
const TEMPLATE_LIST = [
  { name: '空白模版', template: 'template-blank' },
  { name: 'antd 模版', template: 'template-antd' },
  { name: 'antd + tailwindcss 模版', template: 'template-antd-tailwindcss' },
  { name: '@quick/ui 模版', template: 'template-quick-ui' }
]

// 复制模版
const copyTemplate = ({ projectName, template }: CopyTemplateOptions) => {
  const templatePath = resolve(__dirname, `../${template}`)
  const targetPath = resolve(cwd(), projectName)
  // 复制模版
  cpSync(templatePath, targetPath, {
    recursive: true,
    filter: path => IGNORE_FILES.every(ignore => !path.includes(ignore))
  })
  // 替换模版内的项目名称为新项目名称
  const pkgContent = readFileSync(resolve(templatePath, 'package.json'), 'utf-8')
  const htmlContent = readFileSync(resolve(templatePath, 'index.html'), 'utf-8')
  writeFileSync(
    resolve(targetPath, 'package.json'),
    pkgContent.replaceAll('vite-file-router-template', projectName)
  )
  writeFileSync(
    resolve(targetPath, 'index.html'),
    htmlContent.replaceAll('vite-file-router-template', projectName)
  )

  log.success(`项目 ${projectName} 创建完成`)
}

async function createApp() {
  intro(`创建项目`)
  const projectName = await text({
    message: '项目名称',
    initialValue: 'my-app',
    placeholder: '请输入项目名称'
  })

  if (isCancel(projectName)) return

  const template = await select({
    message: '选择模版',
    options: TEMPLATE_LIST.map(item => ({ label: item.name, value: item.template })),
    initialValue: TEMPLATE_LIST[0].template
  })
  if (isCancel(template)) return

  // 判断文件夹是否存在
  if (existsSync(projectName)) {
    log.error(`文件夹 ${projectName} 已存在`)
    return
  }

  // 创建文件夹
  mkdirSync(resolve(cwd(), projectName))
  // 复制模版
  copyTemplate({ projectName, template })

  const isRun = await confirm({
    message: '是否安装依赖并启动项目',
    active: '是',
    inactive: '否',
    initialValue: true
  })
  if (isCancel(isRun)) return
  if (!isRun) {
    outro(`创建完成，运行命令:
      
    cd ${projectName}
    npm install
    npm start  
    `)
    return
  }
  const pkgManager = await select({
    message: '选择包管理器',
    options: [
      { label: 'npm', value: 'npm' },
      { label: 'pnpm', value: 'pnpm' },
      { label: 'yarn', value: 'yarn' }
    ],
    initialValue: 'npm'
  })
  if (isCancel(pkgManager)) return
  outro(`创建完成，启动项目：`)
  execSync(`cd ${projectName} && ${pkgManager} install && ${pkgManager} start`)
}

createApp()
