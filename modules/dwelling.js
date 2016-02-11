"use strict";


var dwellingModule = angular.module("dwelling", [])
    .config(function ($provide) {
        $provide.service("$dwelling", ["$log", "$http", function ($log, $http) {
            var service = {};

            service.getHouses = function () {
                $http.post("")
                    .success(function (data) {
                        if (data !== undefined) {

                        }
                    });
            };

            return service;
        }])
    })
    .run(function () {

    });