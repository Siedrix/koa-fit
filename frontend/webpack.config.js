module.exports = {
	entry: {
		"hello-world": './src/hello-world.jsx',
		"timer": './src/timer.jsx',
		"subreddit": './src/subreddit.jsx',
		"events": './src/events.jsx',
		"chat": './src/chat.jsx'
	},
	output: {
		filename: '[name].js',
		path: __dirname + '/build',
		sourceMapFilename: '[file].map'
	},
	devtool: ['source-map'],
	module: {
		loaders: [
			{
				test: /\.jsx?$/,
				loader: 'babel',
				query: {
					presets:['es2015', 'react']
				}
			}
		]
	}
}