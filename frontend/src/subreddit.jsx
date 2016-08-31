var React = require('react')
var ReactDOM = require('react-dom')
var request = require('browser-request')
 
const SubReddit = React.createClass({
	getInitialState: function(){
		return {
			loaded: false,
			posts: []
		}
	},
	componentDidMount: function(){
		const self = this

		request.get({
			uri: 'https://www.reddit.com/r/'+this.props.r+'.json',
			json: true
		}, function(err, res, body){
			if(err){return console.log('Couldn\'t load ', err)}

			const posts = body.data.children.map(function(item){
				return item.data
			})

			self.setState({
				loaded:true,
				posts
			})
		})
	},
	render: function() {
		var content
		if(this.state.loaded){
			var posts
			if(this.props.main){
				posts = this.state.posts.slice(0, 10)
			}else{
				posts = this.state.posts.slice(0, 3)
			}

			content = posts.map(function(item){
				// return <div key={item.id}>
				return <div>
					<h4>{item.title}</h4>
					<p>{item.url}</p>
				</div>
			})
		}else{
			content = <p>Loading...</p>
		}

		return <div>
			<h2>{this.props.r}</h2>
			{content}
		</div>
	}
})
 
ReactDOM.render(<SubReddit r="nfl" main="true"/>, document.getElementById('content'))
ReactDOM.render(<SubReddit r="soccer"/>, document.getElementById('sidebar1'))
ReactDOM.render(<SubReddit r="nba"/>, document.getElementById('sidebar2'))