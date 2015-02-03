'use strict';

angular.module('AngularReact',['react','directive'])
    .controller('MainCtrl',function($scope,$timeout){

        $scope.contacts = [];
        $scope.result = [];

        $scope.showAngularFilter=true;
        $scope.showReactFilterWithoutScope = false;
        $scope.showReactFilterWithScope = false;

        var ReactExample = React.createFactory(ListWithScope);


        function createData(){
            var contact1 = {
                id:0,
                displayName:'Rachel Green',
                emails:['test'],
                photo:'http://api.randomuser.me/portraits/women/1.jpg'
            }

            var contact2 = {
                id:1,
                displayName:'Michel White',
                emails:['test'],
                photo:'http://api.randomuser.me/portraits/women/2.jpg'
            }

            var list = [];
            list.push(contact1);
            list.push(contact2);

            $scope.contacts = list;
            $scope.result = list;
        }

        $scope.clickAlert = function(reactComponent){
            alert(reactComponent.props.contact.displayName);
        }

        $timeout(function(){
            createData();


        },1000);

        $scope.$watch('contacts',function(val){
            $scope.renderReact();
        })

        $scope.renderReact = function(){
            React.render(ReactExample({
                scope: $scope
            }), document.getElementById('reactExample'));
        };
    })


angular.module('directive',[])
    .directive('list',function(reactDirective){
        return reactDirective('ListWithoutScope');
    });