angular.module('app', ['ngRoute'])

.config(function ($provide, $routeProvider, $locationProvider) {
    $locationProvider.html5Mode(true);
    $routeProvider.otherwise({
        redirectTo: '/'
    });
})

.controller('MainCtrl', function ($rootScope, $scope) {
    getLocation().then(function (position) {
        getZipCodes(position)
            .then(pluckZips)
            .then(function (zips) {
                getDnEvents()
                    .then(function (response) {
                        $scope.events = response.body.filter(function (item) {
                            return zips.indexOf(item.zip) > -1;
                        });
                        $scope.$apply();
                    });
            });
        getWeather(position)
            .then(function (response) {
                $scope.weather = response.body;
                $scope.$apply();
            });
    });
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

function getWeather(position) {
    return new Promise(function (resolve, reject) {
        window.superagent
            .get('http://api.openweathermap.org/data/2.5/weather')
            .query({
                lat: position.coords.latitude,
                lon: position.coords.longitude,
                units: 'metric'
            })
            .end(function (err, res) {
                if (err) {
                    reject(err);
                } else {
                    console.log('weather', res.body);
                    resolve(res);
                }
            });
    });
}

function getZipCodes(position) {
    return new Promise(function (resolve, reject) {
        window.superagent
            .get('http://dawa.aws.dk/postnumre?cirkel=' + [
                    position.coords.longitude,
                    position.coords.latitude,
                    10000
                ].join(','))
            .end(function (err, res) {
                if (err) {
                    reject(err);
                } else {
                    console.log('zips', res.body);
                    resolve(res);
                }
            });
    });
}

function getDnEvents() {
    return new Promise(function (resolve, reject) {
        window.superagent
            .get('/dn_data.json')
            .end(function (err, res) {
                if (err) {
                    reject(err);
                } else {
                    console.log('events', res.body);
                    resolve(res);
                }
            });
    });
}

function pluckZips(response) {
    return response.body.map(function (item) {
        return item.nr;
    });
}