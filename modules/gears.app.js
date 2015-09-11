"use strict";



var application = angular.module("gears.app", [
        "ngRoute",                      // Подключаем модуль управления рутами
        "ngCookies",
        "gears",                        // Подключаем модуль с сервисами ядра системы
        "gears.ui",
        "gears.data",
        "gears.files",
        //"gears.auth",                   // Подключаем модуль с сервисами авторизации
        "gears.app.controllers",        // Подключаем модуль с контроллерами приложения
        "gears.app.modal.controllers",
        "gears.app.filters",             // Подключаем модуль с фильтрами приложения
        "gears.app.titles",
        "gears.app.nodes",
        "gears.app.misc",
        "gears.app.contractors",
        "gears.app.users"
    ])
    .config(function ($provide, $routeProvider) {


        $routeProvider
            .when("/", {
                templateUrl: "templates/dashboard/dashboard.html",
                controller: "DashboardController"
                //redirectTo: "/titles"
            })
            .when("/titles", {
                templateUrl: "templates/titles/titles.html",
                controller: "TitlesController"
            })
            .when("/new-title", {
                templateUrl: "templates/titles/new-title.html",
                controller: "AddTitleController"
            })
            .when("/titles/:titleId", {
                templateUrl: "templates/titles/edit-title.html",
                controller: "EditTitleController"
            })
            .when("/contractors", {
                templateUrl: "templates/contractors/contractors.html",
                controller: "ContractorsController"
            })
            .when("/powerlines", {
                templateUrl: "templates/powerlines/powerlines.html",
                controller: "PowerLinesController"
            })
            .when("/users", {
                templateUrl: "templates/users/users.html",
                controller: "UsersController"
            })
            .when("/new-user", {
                templateUrl: "templates/users/new-user.html",
                controller: "AddUserController"
            })
            .otherwise({ redirectTo: '/titles' });


        /**
         * $application
         * Сервис приложения
         */
        $provide.factory("$application", ["$log", "$factory", function ($log, $factory) {
            var application = {};

            application.title = "ЭСпРЭСО";
            application.currentTitle = undefined;
            application.currentTitlePart = undefined;
            application.currentTitleTabId = 0;
            application.currentNode = undefined;
            application.currentContractorType = undefined;
            application.currentContractor = undefined;
            application.currentUserGroup = undefined;
            application.currentUser = undefined;
            application.currentBuildingPlanItem = undefined;
            application.currentPowerLine = undefined;
            application.currentPylon = undefined;

            return application;
        }]);
    })
    .run(function ($log, $application, $menu, $rootScope, $modules, $factory) {
        $modules.load($application);
        $menu.register();
        $rootScope.application = $application;
        $rootScope.menu = $menu;
        moment.locale("ru");

        $application.currentTitleNodes = $factory({ classes: ["TitleNodes", "States"], base_class: "TitleNodes" });
    }
);