var app = angular.module('app', ['ngRoute']);

app.config(function ($routeProvider) {
    $routeProvider.when('/', {
        title: 'Pindsvin',
        templateUrl: 'front.html',
        controller: 'FrontCtrl'
    }).when('/events/:eventId', {
        title: 'Event',
        templateUrl: 'event.html',
        controller: 'EventCtrl'
    }).otherwise({
        redirectTo: '/'
    });
});

app.controller('AppCtrl', function ($rootScope, $scope, $http) {
    getLocation().then(function (position) {
        getAddress(position)
            .then(function (response) {
                $rootScope.address = response.data;
            });
        getZipCodes(position)
            .then(pluckZips)
            .then(function (zips) {
                getDnEvents()
                    .then(function (response) {
                        $rootScope.events = response.data.filter(function (item) {
                            return zips.indexOf(item.zip) > -1;
                        });
                    });
            });
        getWeather(position)
            .then(function (response) {
                $rootScope.weather = response.data;
            });
    });

    function getWeather(position) {
        return $http.get('http://api.openweathermap.org/data/2.5/weather', {
                params: {
                    lat: position.coords.latitude,
                    lon: position.coords.longitude,
                    units: 'metric'
                }
            });
    }

    function getAddress(position) {
        return $http.get('http://dawa.aws.dk/adgangsadresser/reverse', {
                params: {
                    y: position.coords.latitude,
                    x: position.coords.longitude
                }
            });
    }

    function getZipCodes(position) {
        return $http.get('http://dawa.aws.dk/postnumre?cirkel=' + [
                position.coords.longitude,
                position.coords.latitude,
                10000
            ].join(','));
    }

    function getDnEvents() {
        return $http.get('/dn_data.json');
    }
});

app.controller('FrontCtrl', function ($rootScope, $scope) {
});

app.controller('EventCtrl', function ($rootScope, $scope, $route, $window) {
    $scope.event = $rootScope.events.filter(function (item) {
        return item.zip === $route.current.params.eventId;
    })[0];

    $scope.back = function () {
        $window.history.back();
    };
});

function getLocation() {
    if (navigator.geolocation) {
        console.log('geolocation searching');
        return new Promise(function (resolve, reject) {
            navigator.geolocation.getCurrentPosition(function (position) {
                console.log('geolocation found', position);
                resolve(position);
            }, function (err) {
                console.warn('geolocation', err);
                reject(err);
            });
        });
    } else {
        return Promise.reject('geolocation unsupported');
    }
};

function pluckZips(response) {
    return response.data.map(function (item) {
        return item.nr;
    });
}