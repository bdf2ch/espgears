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
         * exceptUnknown
         * Фильтр типов узлов, возвращает все типы узлов, кроме неформализованного объекта
         */
        $filterProvider.register("exceptUnknown", ["$log", function ($log) {
            return function (input) {
                var result = [];
                angular.forEach(input, function (type) {
                    if (type.id.value !== 0) {
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


        /**
         * byTitleId
         * Фильтр любых элементов по идентификатору титула
         */
        $filterProvider.register("byTitleId", ["$log", function ($log) {
            return function (input, titleId) {
                if (titleId !== undefined && titleId !== 0) {
                    var result = [];
                    angular.forEach(input, function (item) {
                        if (item.titleId.value === titleId)
                            result.push(item);
                    });
                    return result;
                } else
                    return input;
            }
        }]);



        /**
         * timestamp
         * Фильтр пользователей по группе
         */
        $filterProvider.register("timestamp", ["$log", function ($log) {
            return function (input, format) {
                if (format !== undefined && format !== "") {
                    var result = "";
                    switch (format) {
                        case "DDMMYYY":
                            result = moment.unix(input).format("DD.MM.YYYY");
                            break;
                        case "DDMMMYYYY":
                            result = moment.unix(input).format("DD MMM YYYY");
                            break;
                        case "DDMMMYYYYHHmm":
                            result = moment.unix(input).format("DD MMM YYYY в HH:mm");
                            break;
                    }
                    return result;
                } else
                    return input;
            }
        }]);


    })
    .run(function () {

    }
);