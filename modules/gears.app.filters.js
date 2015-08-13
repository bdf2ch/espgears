"use strict";


/********************
 * Модуль appFilters
 * Содкржит описание фильтров, используемых в приложении
 ********************/
var AppFilters = angular.module("gears.app.filters", [])
    .config(function ($filterProvider) {

        /**
         * onlyBaseNodes
         * Фильтр типов узлов, возвращает типы узлов базового типа
         */
        $filterProvider.register("onlyBasicNodes", ["$log", function ($log) {
            return function (input) {
                var result = [];
                angular.forEach(input, function (type) {
                    if (type.isBasicNode.value === true) {
                        result.push(type);
                    }
                });
                return result;
            }
        }]);

    })
    .run(function () {

    }
);