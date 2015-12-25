"use strict";

var requests = angular.module("gears.app.requests", [])
    .config(function ($provide) {
        $provide.factory("$requests", ["$log", "$http", function ($log, $http) {

        }])
    })
    .run(function () {

    });
