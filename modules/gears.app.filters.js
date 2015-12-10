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
                    $log.log("type = ", type);
                    if (type.isBasicNode.value === true) {
                        result.push(type);
                    }
                });
                return result;
            }
        }]);


        /**
         * onlyNonBaseNodes
         * Фильтр типов узлов, возвращает типы узлов базового типа
         */
        $filterProvider.register("onlyNonBasicNodes", ["$log", function ($log) {
            return function (input) {
                var result = [];
                angular.forEach(input, function (type) {
                    if (type.isBasicNode.value === false) {
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
         * byRequestId
         * Фильтр документов статусов заявки по идентификатору заявки и идентификатору статуса заявки
         */
        $filterProvider.register("byRequestId", ["$log", function ($log) {
            return function (input, requestId, statusId) {
                if (requestId !== undefined && requestId !== 0 && statusId !== undefined && statusId !== 0) {
                    var result = [];
                    angular.forEach(input, function (item) {
                        if (item.requestId.value === requestId && item.statusId.value == statusId)
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


        /**
         * onlySelectableStatuses
         * Фильтр статусов заявки, возвращает статусы, доступнея для выбора
         */
        $filterProvider.register("onlySelectableStatuses", ["$log", "$application", function ($log, $application) {
            return function (input) {
                var result = [];
                angular.forEach(input, function (type) {
                    if (type.id.value !== 1) {
                        result.push(type);
                    }
                });
                return result;
            }
        }]);



        /**
         * fileSize
         * Фильтр статусов заявки, возвращает статусы, доступнея для выбора
         */
        $filterProvider.register("fileSize", ["$log", function ($log) {
            return function (input, precision) {
                if (typeof precision === 'undefined') precision = 1;
                var units = ['байт', 'кб', 'мб', 'гб', 'тв', 'пб'];
                var number = Math.floor(Math.log(input) / Math.log(1024));
                return (input / Math.pow(1024, Math.floor(number))).toFixed(precision) +  ' ' + units[number];
            }
        }]);


        /**
         * undeletedUsers
         * Фильтр статусов заявки, возвращает статусы, доступнея для выбора
         */
        $filterProvider.register("undeletedUsers", ["$log", function ($log) {
            return function (input) {
                var result = [];
                angular.forEach(input, function (user) {
                    if (user.isDeleted.value === false) {
                        result.push(user);
                    }
                });
                return result;
            }
        }]);


        /**
         * groupByPermission
         * Фильтр пользователей по группе
         */
        $filterProvider.register("groupByPermission", ["$log", function ($log) {
            return function (input) {
                var result = [];
                angular.forEach(input, function (permission) {
                    var group_found = false;

                    angular.forEach(result, function (group) {
                        if (group.id === permission.data.value) {
                            $log.log("group '" + permission.data.value + "' found");
                            group_found = true;
                            group.push(permission);
                        }
                    });
                    if (group_found === false) {
                        $log.log("group '" + permission.data.value + "' not found");
                        var new_group = [];
                        new_group.id = permission.data.value;
                        new_group.push(permission);
                        result.push(new_group);
                    }

                });
                $log.log("groups = ", result);
                return result;
            }
        }]);


    })
    .run(function () {

    }
);