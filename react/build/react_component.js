/** @jsx React.DOM */
var SearchBar = React.createClass({displayName: "SearchBar",
    searchHandler: function() {
        this.props.searchHandler(this.refs.searchKey.getDOMNode().value);
    },
    render: function () {
        return (
            React.createElement("div", {className: "list list-inset"}, 
                React.createElement("label", {className: "item item-input"}, 
                    React.createElement("i", {className: "icon ion-search placeholder-icon"}), 
                    React.createElement("input", {type: "search", ref: "searchKey", onChange: this.searchHandler, placeholder: "Filter in Another Component"})
                )
            )
        );
    }
});

var ImageContact = React.createClass({displayName: "ImageContact",
    render: function(){
        "use strict";

        return(
            React.createElement("img", {src: this.props.img})
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

var ContactItem = React.createClass({displayName: "ContactItem",
    render: function(){
        var clickHandler = createClickHandler(this);

        return(
            React.createElement("a", {className: "item item-avatar", href: "javascript:void(0)", onClick: clickHandler}, 
            this.props.contact.photo ? React.createElement(ImageContact, {img: this.props.contact.photo}) : React.createElement(ImageContact, {img: "img/png/noLogoAccount.png"}), " ", React.createElement("h2", null, this.props.contact.displayName)
            )
        )
    }
});

var ContactList = React.createClass({displayName: "ContactList",
    render: function(){
        var scope = this.props.scope;

        var contact = this.props.contacts ?this.props.contacts.filter(function(contact){
            return contact.displayName != null && ( contact.emails != null || contact.phoneNumbers != null )
        }).map(function(contact){

            return (
                React.createElement(ContactItem, {id: contact.id, contact: contact, scope: scope})
            );
        }) : [];
        return (
            React.createElement("ul", null, 
            contact
            )
        )
    }
});

var ListWithoutScope =  React.createClass({displayName: "ListWithoutScope",
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
            React.createElement("div", null, 
                React.createElement("input", {value: this.state.query, onChange: this.onUpdateQuery, placeholder: "filter directly in List Component"}), 
                React.createElement(SearchBar, {searchHandler: this.searchHandler}), 
                React.createElement("div", {className: "list"}, 
                    React.createElement(ContactList, {contacts: this.getRows()})
                )
            )
        );
    }
});

var ListWithScope =  React.createClass({displayName: "ListWithScope",
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
            React.createElement("div", null, 
                React.createElement("input", {value: this.state.query, onChange: this.onUpdateQuery, placeholder: "filter..."}), 
                React.createElement("div", {className: "list"}, 
                    React.createElement(ContactList, {contacts: this.getRows(), scope: scope})
                )
            )
        );
    }
});