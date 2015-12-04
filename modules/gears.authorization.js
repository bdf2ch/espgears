"use strict";


var authorization = angular.module("authorization", ["ngRoute", "gears", "gears.auth", "gears.ui", "ngCookies"])
    .config(function () {

    })
    .run(function () {

    }
);



authorization.controller("AppAuthorizationController", ["$log", "$scope", "$authorization", "$session", "$window", function ($log, $scope, $authorization, $session, $window) {
    $scope.auth = $authorization;
    $scope.session = $session;

    $authorization.onSuccessLogIn = function () {
        $window.location.reload();
    };
}]);