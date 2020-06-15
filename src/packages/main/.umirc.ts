import { defineConfig } from 'umi';

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
    routes: [{ exact: false, component: '@/pages/index' }],
    publicPath: './',
    runtimePublicPath: true,
    outputPath: '../../../static/packages/sizzy',
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
        // memo.resolve.extensions.add('.module.less');
        memo.plugin('antd-dayjs-webpack-plugin').use(
            require('antd-dayjs-webpack-plugin'),
        ); // dayjs代替moment
    },
});
