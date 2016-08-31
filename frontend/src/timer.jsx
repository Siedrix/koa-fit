var React = require('react');
var ReactDOM = require('react-dom');
 
const Timer = React.createClass({
	getInitialState: function(){
		return {
			date: new Date().toString()
		}
	},
	componentDidMount: function(){
		const self = this

		setInterval(function(){
			self.setState({date: new Date().toString()})
		}, 1000)
	},
	render: function() {
		return <div>
			<p>{ this.state.date }</p>
		</div>
	}
})
 
ReactDOM.render(<Timer />, document.getElementById('content'))