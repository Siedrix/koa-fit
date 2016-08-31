var React = require('react')
var ReactDOM = require('react-dom')
var request = require('browser-request')
 
const ListView = React.createClass({
	getInitialState: function(){
		return {
			posts: [
				{title:'Lolz', url:'http://imgur.com/asGkOyc'}
			]
		}
	},
	titleChange: function(event){
		this.setState({title: event.target.value});
	},
	urlChange: function(event){
		this.setState({url: event.target.value});
	},
	handleSubmit: function(e) {
		e.preventDefault();
		var title = this.state.title.trim();
		var url = this.state.url.trim();
		if (!title || !url) {
			return;
		}
		
		this.state.posts.push({
			title,
			url
		})
		this.setState({title: '', url: ''});
	},
	componentDidMount: function(){

	},
	render: function() {
		var list = this.state.posts.map(function(item, i){
			return <div key={i}>
				<a href={ item.url } target="_blank">{item.title}</a>
			</div>
		})

		return <div>
			<div>
				<form className="form-horizontal" onSubmit={this.handleSubmit}>
					<div className="form-group">
						<label className="col-sm-2 control-label">Title</label>
						<div className="col-sm-10">
							<input type="text" className="form-control product-name" placeholder="title" value={this.state.title} onChange={this.titleChange}/>
						</div>
					</div>
					<div className="form-group">
						<label className="col-sm-2 control-label">Url</label>
						<div className="col-sm-10">
							<input type="text" className="form-control product-name" placeholder="url" value={this.state.url} onChange={this.urlChange}/>
						</div>
					</div>
					<div className="form-group">
						<div className="col-sm-offset-2 col-sm-10">
							<button type="submit" className="btn btn-primary btn-block">Crear</button>
						</div>
					</div>
				</form>				
			</div>
			<div>{list}</div>
		</div>
	}
})
 
ReactDOM.render(<ListView/>, document.getElementById('content'))