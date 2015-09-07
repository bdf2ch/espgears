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


        /**
         * byContractorType
         * Фильтр контрагентов по типу контрагента
         */
        $filterProvider.register("byContractorType", ["$log", function ($log) {
            return function (input, contractorTypeId) {
                if (contractorTypeId !== undefined && contractorTypeId !== 0) {
                    var result = [];
                    angular.forEach(input, function (contractor) {
                        if (contractor.contractorTypeId.value === contractorTypeId)
                            result.push(contractor);
                    });
                    return result;
                } else
                    return input;
            }
        }]);


        /**
         * byUserGroup
         * Фильтр пользователей по группе
         */
        $filterProvider.register("byUserGroup", ["$log", function ($log) {
            return function (input, userGroupId) {
                if (userGroupId !== undefined && userGroupId !== 0) {
                    var result = [];
                    angular.forEach(input, function (user) {
                        if (user.groupId.value === userGroupId)
                            result.push(user);
                    });
                    return result;
                } else
                    return input;
            }
        }]);


    })
    .run(function () {

    }
);