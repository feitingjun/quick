import { PluginOption } from 'vite';
import { QuickConfig } from './types.js';
import 'fs';
import 'react';

/**vite插件，负责解析配置，生成约定式路由，以及提供quick插件功能*/
declare function QucikCore(quickonfig?: QuickConfig): PluginOption;

export { QucikCore as default };
