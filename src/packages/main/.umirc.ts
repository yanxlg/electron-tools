import { defineConfig } from 'umi';
import path from 'path';

const shajs = require('sha.js');

export default defineConfig({
    nodeModulesTransform: {
        type: 'none',
    },
    title: 'tools',
    cssModulesTypescriptLoader: {
        mode: 'emit',
    },
    antd: {
        dark: true, // 开启暗色主题
    },
    publicPath: './',
    runtimePublicPath: true,
    outputPath: '../../../static/packages/main',
    history: { type: 'hash' },
    locale: {
        antd: true, // 需要设置为true，否则antd会使用默认语言en-US
        title: false,
        default: 'zh-CN',
        baseNavigator: false,
    },
    cssLoader: {
        localsConvention: 'camelCaseOnly',
        modules: {
            auto: /[a-zA-Z\.\-_0-9]+\.module\.less$/, // 仅符合要求的文件生成module，减少code体积
            getLocalIdent: (
                context: {
                    resourcePath: string;
                },
                _: string,
                localName: string,
            ) => {
                const { resourcePath } = context;

                if (/[a-zA-Z\.\-_0-9]+\.module\.less$/.test(resourcePath)) {
                    const match =
                        resourcePath.match(/src(.*)/) ||
                        resourcePath.match(/node_modules(.*)/);
                    if (match && match[1]) {
                        const hash = shajs('sha256')
                            .update(resourcePath)
                            .digest('hex')
                            .substr(0, 8); //最大长度
                        return `${localName
                            .replace(/([A-Z])/g, '-$1')
                            .toLowerCase()}_${hash}`;
                    }
                    // support node_modules
                }
                return localName;
            },
        },
    },
    chainWebpack(memo, { env, webpack, createCSSRule }) {
        const babelOptions = memo.module
            .rule('js')
            .use('babel-loader')
            .get('options');
        const jsonAppDir = path.join(process.cwd(), '../json/src');
        const sizzyAppDir = path.join(process.cwd(), '../sizzy/src');
        memo.module
            .rule('json_app')
            .test(/\.(js|mjs|jsx|ts|tsx)$/)
            .include.add(jsonAppDir)
            .add(sizzyAppDir)
            .add(path.join(process.cwd(), '../xls2lang/src'))
            .end()
            .use('babel-loader')
            .loader(require.resolve('babel-loader'))
            .options(babelOptions);
        // memo.resolve.extensions.add('.module.less');
        memo.plugin('antd-dayjs-webpack-plugin').use(
            require('antd-dayjs-webpack-plugin'),
        ); // dayjs代替moment
    },
});
