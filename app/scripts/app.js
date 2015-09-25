angular.module('app', ['ngRoute'])

.config(function ($provide, $routeProvider, $locationProvider) {
    $locationProvider.html5Mode(true);
    $routeProvider.otherwise({
        redirectTo: '/'
    });
})

.controller('MainCtrl', function ($rootScope, $scope) {
    getDnEvents().then(function (response) {
        $scope.events = response.body;
        $scope.$apply();
    });

    getLocation().then(getWeather).then(function (response) {
        console.log('weather', response);
        $scope.location = response.body;
        $scope.$apply();
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
                lon: position.coords.longitude
            })
            .end(function (err, res) {
                if (err) {
                    reject(err);
                } else {
                    resolve(res);
                }
            });
    });
}

function getZipCodes(position) {
    return new Promise(function (resolve, reject) {
        window.superagent
            .get('http://dawa.aws.dk/adgangsadresser/reverse')
            .query({
                y: position.coords.latitude,
                x: position.coords.longitude
            })
            .end(function (err, res) {
                if (err) {
                    reject(err);
                } else {
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
                    resolve(res);
                }
            });
    });
}