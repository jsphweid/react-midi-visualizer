const webpack = require('webpack')
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
	devtool: 'source-map',
	entry: {
		client: ['./src/develop']
	},
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: '[name].js',
		publicPath: '/'
	},
	devServer: {
		hot: true,
		port: 3000,
		historyApiFallback: true
	},
	resolve: {
		extensions: ['.ts', '.tsx', '.js', '.json']
	},

	module: {
		rules: [
			{
				test: /\.tsx?$/,
				loaders: ['awesome-typescript-loader']
			},
			{
				enforce: 'pre',
				test: /\.js$/,
				loader: 'source-map-loader'
			},
			{
				test: /\.scss$/,
				use: ['style-loader', 'css-loader', 'sass-loader']
			},
			{
				test: /\.css$/,
				use: ['style-loader', 'css-loader']
			},
			{
				test: /\.html$/,
				use: 'html-loader'
			},
			{
				test: /\.(jpe?g|gif|png|svg)$/i,
				use: [{ loader: 'base64-inline-loader?name=[name].[ext]' }]
			}
		]
	},

	plugins: [
		new webpack.HotModuleReplacementPlugin(),
		new HtmlWebpackPlugin({
			template: './src/index.html',
			filename: 'index.html'
		})
	]
}
