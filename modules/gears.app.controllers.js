"use strict";


var appControllers = angular.module("gears.app.controllers", [])


     /**
     * TitlesController
     * ����������� ������� �������
     */
    .controller("TitlesController", ["$log", "$scope", "$titles", function ($log, $scope, $titles) {
        $scope.titles = $titles;
    }])


    /**
     * AddTitleController
     * ���������� ���������� ������
     */
    .controller("AddTitleController", ["$log", "$scope", function ($log, $scope) {

    }]);