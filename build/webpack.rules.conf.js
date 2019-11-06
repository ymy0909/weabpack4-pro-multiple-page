const extractTextPlugin = require("extract-text-webpack-plugin");
const autoprefixer = require('autoprefixer');
// const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const postCssLoader = {
    loader: "postcss-loader",
    options: {
        plugins: [
            autoprefixer({
                overrideBrowserslist: ['ie >= 8','Firefox >= 20', 'Safari >= 5', 'Android >= 4','Ios >= 6', 'last 4 version']
            })
        ]
    }
}

const rules = [{
        test: /\.(css|scss|sass)$/,
        // 区别开发环境和生成环境
        // webpack的css单独打包解决方案
        use: extractTextPlugin.extract({
            fallback: "style-loader",
            // MiniCssExtractPlugin.loader,
            use: ["css-loader", "sass-loader", postCssLoader],
            // css中的基础路径
            publicPath: "../"
        })
            // process.env.NODE_ENV === "development" ? [MiniCssExtractPlugin.loader,"style-loader", "css-loader", "sass-loader", "postcss-loader",postCssLoader] :
    },
    {
        test: /\.js$/,
        exclude:/(node_modules)/,
        // include: /src/,
        use: [{
            loader: "babel-loader",
            // options:{
            //     presets:['@babel/preset-env',],
            //     plugins:['@babel/transform-runtime']
            // }
        }],
        // 不检查node_modules下的js文件
        // exclude: "/node_modules/"
    },
    {
        test: /\.(png|jpg|gif)$/,
        use: [{
            // 需要下载url-loader
            loader: "url-loader",
            options: {
                limit: 5 * 1024, //小于这个时将会已base64位图片打包处理
                // 图片文件输出的文件夹
                publicPath: "../images",
                outputPath: "images"
            }
        }]
    },
    {
        test: /\.html$/,
        // html中的img标签
        use: {
            loader: 'html-loader',
            options: {
                attrs: ['img:src', 'img:data-src', 'audio:src'],
                minimize: true
            }
        }
    }
];
module.exports = rules;
