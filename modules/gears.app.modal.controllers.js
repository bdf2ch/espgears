"use strict";


var modalControllers = angular.module("gears.app.modal.controllers", [])
    .controller("AddPowerLineModalController", ["$log", "$scope", "$misc", "$factory", "$application", "$modals", function ($log, $scope, $misc, $factory, $application, $modals) {
        $scope.newPowerLine = $factory({ classes: ["PowerLine", "Model", "Backup", "States"], base_class: "PowerLine" });
        $scope.errors = [];

        $scope.validate = function () {
            $scope.errors.splice(0, $scope.errors.length);
            if ($scope.newPowerLine.title.value === "")
                $scope.errors.push("Вы не указали наименование линии");
            if ($scope.newPowerLine.voltage.value === "" || $scope.newPowerLine.voltage.value === 0)
                $scope.errors.push("Вы не указали напряжение линии");
            if ($scope.errors.length === 0) {
                $misc.addPowerLine($scope.newPowerLine, $scope.onSuccessAddPowerLine);
            }
        };

        $scope.onSuccessAddPowerLine = function (data) {
            $modals.close();
            $scope.newPowerLine._model_.reset();
        };

        $scope.cancel = function () {
            $modals.close();
            $scope.errors.splice(0, $scope.errors.length);
            $scope.newPowerLine._model_.reset();
            $scope.newPowerLine._states_.changed(false);
        };
    }])


    .controller("EditPowerLineModalController", ["$log", "$scope", "$misc", "$application", "$modals", function ($log, $scope, $misc, $application, $modals) {
        $scope.app = $application;
        $scope.misc = $misc;
        $scope.errors = [];

        $scope.cancel = function () {
            $modals.close();
            $scope.errors.splice(0, $scope.errors.length);
            $application.currentPowerLine._backup_.restore();
            $application.currentPowerLine._states_.changed(false);
        };

        $scope.validate = function () {
            $scope.errors.splice(0, $scope.errors.length);
            if ($application.currentPowerLine.title.value === "")
                $scope.errors.push("Вы не указали наименование линии");
            if ($application.currentPowerLine.voltage.value === "")
                $scope.errors.push("Вы не указали напряжение линии");
            if ($scope.errors.length === 0) {
                $application.currentPowerLine._states_.loading(true);
                $misc.editPowerLine($application.currentPowerLine, $scope.onSuccessEditLine);
            }
        };

        $scope.onSuccessEditLine = function (data) {
            $application.currentPowerLine._states_.loaded(true);
            $application.currentPowerLine._states_.loading(false);
            $application.currentPowerLine._backup_.setup();
            $modals.close();
        };
    }]);