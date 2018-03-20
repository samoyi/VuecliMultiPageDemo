const fs = require('fs');
const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

// 设置执行`npm run dev`时打开哪一页
const cur_page = 'test';


 // 放置所有页面的路径
 // 内部的每个文件夹都会被认为是一个页面组件
const sPagesDir = './src/pages/';

// 每个页面都使用HtmlWebpackPlugin设置相应的配置来生成html文件
let aHWP = []; // 若干个配置

// 读取页面配置
const oPageConfig = JSON.parse(fs.readFileSync('src/pageConfig.json'));

function generateLinkNodes(sPageName){
    const aCSS = oPageConfig[sPageName].css;
    if(aCSS && aCSS.length){
        return aCSS.reduce((acc, cur)=>{
            return acc + '<link rel="stylesheet" type="text/css" href="'
                    + cur + '">';
        }, '');
    }
    else{
        return '';
    }
}
function generateScriptNodes(sPageName){
    const aJS = oPageConfig[sPageName].js;
    if(aJS && aJS.length){
        return aJS.reduce((acc, cur)=>{
            return acc + '<script src="' + cur + '"></script>';
        }, '');
    }
    else{
        return '';
    }
}

// 遍历sPagesDir生成的多入口对象
const oEntries = ((sPagesDir)=>{
    const contents = fs.readdirSync(sPagesDir);
    let oEntries = {};
    // src/pages/下的每个目录会被认为是一个页面组件
    contents.forEach(item=>{
        if(fs.statSync(sPagesDir+item).isDirectory()){
            // 每个页面目录下的main.js文件作为该页面的entry文件
            oEntries[item] = sPagesDir+item + '/main.js';
            // 为每个页面配置要生成的html入口文件
            // console.log(oPageConfig[item]);
            // console.log(item);
            aHWP.push(new HtmlWebpackPlugin({
                template: 'template.html', // 使用同一个模板
                // 所有html统一放在 /dist/html 目录下
                filename: 'html/' + item + '.html', // html文件名为页面组件名
                title: oPageConfig[item].title, // 每个页面的title
                css: generateLinkNodes(item),
                js: generateScriptNodes(item),
                // 默认时，生成的html会引用所有生成的js文件。这里设置为只引用自己的。
                chunks: [item],
            }));
        }
    });
    return oEntries;
})(sPagesDir);


module.exports = {
    entry: oEntries,
    output: {
        path: path.resolve(__dirname, './dist'),
        publicPath: '/dist/',
        // 多页面出口的设置参考文档 https://webpack.js.org/concepts/output/#multiple-entry-points
        filename: '[name].js'
    },
    plugins: aHWP,
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    'vue-style-loader',
                    'css-loader'
                ],
            },
            {
                test: /\.scss$/,
                use: [
                    'vue-style-loader',
                    'css-loader',
                    'sass-loader'
                ],
            },
            {
                test: /\.sass$/,
                use: [
                    'vue-style-loader',
                    'css-loader',
                    'sass-loader?indentedSyntax'
                ],
            },
            {
                test: /\.vue$/,
                loader: 'vue-loader',
                options: {
                    loaders: {
                        'scss': [
                            'vue-style-loader',
                            'css-loader',
                            'sass-loader'
                        ],
                        'sass': [
                            'vue-style-loader',
                            'css-loader',
                            'sass-loader?indentedSyntax'
                        ]
                    }
                }
            },
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /node_modules/
            },
            {
                test: /\.(png|jpg|webp|gif|svg)$/,
                loader: 'file-loader',
                options: {
                    name: '[name].[ext]?[hash]'
                }
            }
        ]
    },
    resolve: {
        alias: {
            'vue$': 'vue/dist/vue.esm.js'
        },
        extensions: ['*', '.js', '.vue', '.json']
    },
    devServer: {
        historyApiFallback: true,
        noInfo: true,
        overlay: true,
        // npm run dev 默认启动 index.html，这里做如下修改
        openPage: 'dist/html/' + cur_page + '.html',
    },
    performance: {
        hints: false
    },
    devtool: '#eval-source-map'
}

if (process.env.NODE_ENV === 'production') {
    module.exports.devtool = '#source-map'
    module.exports.plugins = (module.exports.plugins || []).concat([
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: '"production"'
            }
        }),
        new webpack.optimize.UglifyJsPlugin({
            sourceMap: true,
            compress: {
                warnings: false
            }
        }),
        new webpack.LoaderOptionsPlugin({
            minimize: true
        })
    ])
}
