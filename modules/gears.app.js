"use strict";



var application = angular.module("gears.app", [
        "ngRoute",                      // Подключаем модуль управления рутами
        "gears",                        // Подключаем модуль с сервисами ядра системы
        //"gears.auth",                   // Подключаем модуль с сервисами авторизации
        "gears.app.controllers",        // Подключаем модуль с контроллерами приложения
        "gears.app.filters",             // Подключаем модуль с фильтрами приложения
        "gears.app.titles",
        "gears.app.nodes",
        "gears.app.misc"
    ])
    .config(function ($provide, $routeProvider) {


        $routeProvider
            .when("/", {
                //templateUrl: "templates/bouquets/bouquets.html",
                //controller: "BouquetsController"
                redirectTo: "/titles"
            })
            .when("/bouquet/:bouquetId", {
                templateUrl: "templates/bouquet/bouquet.html",
                controller: "BouquetController"
            })
            .when("/titles", {
                templateUrl: "templates/titles/titles.html",
                controller: "TitlesController"
            })
            .when("/new-title", {
                templateUrl: "templates/titles/new-title.html",
                controller: "AddTitleController"
            })
            .when("/confirm", {
                templateUrl: "templates/order/confirm.html",
                controller: "ConfirmationController"
            })
            .when("/account", {
                templateUrl: "templates/account/account.html",
                controller: "AccountController"
            })
            .when("/contacts", {
                templateUrl: "templates/contacts/contacts.html",
                controller: "ContactsController"
            })
            .otherwise({ redirectTo: '/titles' });


        /**
         * $application
         * Сервис приложения
         */
        $provide.factory("$application", ["$log", "$factory", function ($log, $factory) {
            var application = {};

            application.title = "Флористический салон Белый Лотос";
            application.description = "This is a test application provided by Shell Framework";
            application.currentTitle = undefined;
            application.currentTitlePart = undefined;

            return application;
        }]);
    })
    .run(function ($log, $application, $menu, $rootScope, $modules) {
        $modules.load($application);
        $menu.register();
        $rootScope.application = $application;
        $rootScope.menu = $menu;
        moment.locale("ru");


    }
);