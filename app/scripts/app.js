angular.module('app', [
    'ngRoute'
])

.config(function ($provide, $routeProvider, $locationProvider) {
    $locationProvider.html5Mode(true);
    $routeProvider.otherwise({
        redirectTo: '/'
    });
})

.controller('MainCtrl', function ($rootScope, $scope) {
    getLocation();
});

function getLocation() {
    if (navigator.geolocation) {
        console.log('geolocation searching');
        navigator.geolocation.getCurrentPosition(function (position) {
            console.log('geolocation found', position);
        }, function (err) {
            console.warn('geolocation', err);
        });
    } else {
        console.log('geolocation unsupported');
    }
};