const path = require('path');

module.exports = {
    entry: path.resolve(__dirname, './export.ts'),
    output: {
        filename: 'browser-sync.js',
        path: path.resolve(__dirname, 'dist')
    },
    mode: 'production',
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: "ts-loader",
                exclude: /node_modules/,
                options:{
                    transpileOnly:true,
                    silent:true,
                    reportFiles: ['src/**/*.{ts,tsx}', '!src/*']
                }
            }
        ]
    },
    optimization: {
        minimize:false
    },
    resolve: {
        extensions: [ '.tsx', '.ts', '.js' ]
    },
};
