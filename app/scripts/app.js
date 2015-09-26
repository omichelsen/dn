angular.module('app', ['ngRoute'])

.config(function ($provide, $routeProvider, $locationProvider) {
    $locationProvider.html5Mode(true);
    $routeProvider.otherwise({
        redirectTo: '/'
    });
})

.controller('MainCtrl', function ($rootScope, $scope, $http) {
    getLocation().then(function (position) {
        getAddress(position)
            .then(function (response) {
                $scope.address = response.data;
            });
        getZipCodes(position)
            .then(pluckZips)
            .then(function (zips) {
                getDnEvents()
                    .then(function (response) {
                        $scope.events = response.data.filter(function (item) {
                            return zips.indexOf(item.zip) > -1;
                        });
                    });
            });
        getWeather(position)
            .then(function (response) {
                $scope.weather = response.data;
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