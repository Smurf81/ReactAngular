/** @jsx React.DOM */
var SearchBar = React.createClass({
    searchHandler: function() {
        this.props.searchHandler(this.refs.searchKey.getDOMNode().value);
    },
    render: function () {
        return (
            <div className="list list-inset">
                <label className="item item-input">
                    <i className="icon ion-search placeholder-icon"></i>
                    <input type="search" ref="searchKey" onChange={this.searchHandler} placeholder="Filter in Another Component"/>
                </label>
            </div>
        );
    }
});

var ImageContact = React.createClass({
    render: function(){
        "use strict";

        return(
            <img src={this.props.img}/>
        )
    }
});

function createClickHandler(reactComponent) {
    var scope = reactComponent.props.scope;
    if(scope) {
        return scope.$apply.bind(
            scope,
            scope.clickAlert.bind(null, reactComponent)
        );
    }
}

var ContactItem = React.createClass({
    render: function(){
        var clickHandler = createClickHandler(this);

        return(
            <a className='item item-avatar' href="javascript:void(0)" onClick={clickHandler}>
            {this.props.contact.photo ? <ImageContact img={this.props.contact.photo} /> : <ImageContact img='img/png/noLogoAccount.png' />} <h2>{this.props.contact.displayName}</h2>
            </a>
        )
    }
});

var ContactList = React.createClass({
    render: function(){
        var scope = this.props.scope;

        var contact = this.props.contacts ?this.props.contacts.filter(function(contact){
            return contact.displayName != null && ( contact.emails != null || contact.phoneNumbers != null )
        }).map(function(contact){

            return (
                <ContactItem id={contact.id} contact={contact} scope={scope}/>
            );
        }) : [];
        return (
            <ul>
            {contact}
            </ul>
        )
    }
});

var ListWithoutScope =  React.createClass({
    propTypes:{
        contacts:React.PropTypes.string.isRequired
    },
    onUpdateQuery: function(event) {
        this.setState({
            query: event.target.value
        });
    },
    getInitialState : function(){
        return {query:''}
    },
    getRows: function() {
        if (this.state.query) {
            var regFilter = new RegExp(this.state.query, 'i');
            var rows = this.props.contacts.filter(function(item) {
                return regFilter.exec(item.displayName);
            });
            return rows;
        } else {
            return this.props.contacts;
        }
    },
    searchHandler : function(key){
       this.setState({
           query:key
       })
    },
    render: function() {
        return (
            <div>
                <input value={this.state.query} onChange={this.onUpdateQuery} placeholder="filter directly in List Component"/>
                <SearchBar searchHandler={this.searchHandler}/>
                <div className='list'>
                    <ContactList contacts={this.getRows()} />
                </div>
            </div>
        );
    }
});

var ListWithScope =  React.createClass({
    propTypes:{
        contacts:React.PropTypes.string.isRequired
    },
    onUpdateQuery: function(event) {
        this.setState({
            query: event.target.value
        });
    },
    getInitialState : function(){
        return {query:''}
    },
    getRows: function() {
        if (this.state.query) {
            var regFilter = new RegExp(this.state.query, 'i');
            var rows = this.props.scope.contacts.filter(function(item) {
                return regFilter.exec(item.displayName);
            });
            return rows;
        } else {
            return this.props.scope.contacts;
        }
    },
    render: function() {
        var scope = this.props.scope;
        var contacts = this.props.contacts;
        return (
            <div>
                <input value={this.state.query} onChange={this.onUpdateQuery} placeholder="filter..."/>
                <div className='list'>
                    <ContactList contacts={this.getRows()} scope={scope}/>
                </div>
            </div>
        );
    }
});