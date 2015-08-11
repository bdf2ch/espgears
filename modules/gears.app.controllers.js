"use strict";


var appControllers = angular.module("gears.app.controllers", [])


     /**
     * TitlesController
     * Ктонтроллер раздела титулов
     */
    .controller("TitlesController", ["$log", "$scope", "$location", "$titles", "$application", function ($log, $scope, $location, $titles, $application) {
        $scope.titles = $titles;
        $scope.app = $application;

        $scope.gotoAddTitle = function () {
            $location.url("/new-title");
        };

        $scope.selectTitle = function (titleId) {
            if (titleId !== undefined) {
                angular.forEach($scope.titles.titles.items, function (title) {
                    if (title.id.value === titleId) {
                        if (title._states_.selected() === true) {
                            title._states_.selected(false);
                            $scope.app.currentTitle = undefined;
                        } else {
                            title._states_.selected(true);
                            $scope.app.currentTitle = title;
                        }
                    } else
                        title._states_.selected(false);
                });
            }
        };
    }])


    /**
     * AddTitleController
     * Контроллер добавления титула
     */
    .controller("AddTitleController", ["$log", "$scope", function ($log, $scope) {

    }]);