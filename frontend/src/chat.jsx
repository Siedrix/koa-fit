var React = require('react')
var ReactDOM = require('react-dom')
var request = require('browser-request')

var Messages = require('./datalayer/messages') 
 
const ListView = React.createClass({
	getInitialState: function(){
		return {
			messages: [],
			message: ''
		}
	},
	messageChange: function(event){
		this.setState({message: event.target.value});
	},
	handleSubmit: function(e) {
		e.preventDefault();
		var message = this.state.message.trim();
		if (!message) {
			return;
		}
		
		var model = new Messages.Model({message})
		model.save()

		this.setState({message: ''});
	},
	componentDidMount: function(){
		var self = this
		this.collection = new Messages.Collection()
		this.binder = function() {
			self.setState({messages: self.collection.toArray() })
		}

		this.collection.on('add', this.binder)
		this.collection.on('remove', this.binder)

		this.collection.fetch().then(function (data) {
			self.collection.add(data)
		})

		window.socket.on('new-message', function(message){
			self.collection.add(message)
		})		
	},
	render: function() {
		var list = this.state.messages.map(function(model, i){
			var message = model.toJSON()
			return <div key={i}>
				<div><b>{message.user.name}:</b> {message.message}</div>
			</div>
		})


		return <div>
			<div>
				<form className="form-horizontal" onSubmit={this.handleSubmit}>
					<div className="form-group">
						<label className="col-sm-2 control-label">Message</label>
						<div className="col-sm-10">
							<input type="text" className="form-control product-name" placeholder="Message" value={this.state.message} onChange={this.messageChange}/>
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