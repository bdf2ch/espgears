"use strict";


var contractors = angular.module("gears.app.contractors", [])
    .config(function ($provide) {

        /**
         * $contractors
         * Сервис, содержащий функционал для работы с контрагентами
         */
        $provide.factory("$contractors", ["$log", "$http", "$factory", function ($log, $http, $factory) {
            var contractors = {};


            /**
             * Наборы свойст и методов, описывающих модели данных
             */
            contractors.classes = {
                /**
                 * Contractor
                 * Набор свойств, описывающих контрагента
                 */
                Contractor: {
                    id: new Field({ source: "ID", value: 0, default_value: 0 }),
                    contractorTypeId: new Field({ source: "CONTRACTOR_TYPE_ID", value: 0, default_value: 0, backupable: true, required: true }),
                    title: new Field({ source: "NAME", value: "", default_value: "", backupable: true, required: true }),
                    fullTitle: new Field({ source: "FULL_NAME", value: "", default_value: "", backupable: true })
                },

                /**
                 * ContractorType
                 * Набор свойст, описывающих тип контрагента
                 */
                ContractorType: {
                    id: new Field({ source: "ID", value: 0, default_value: 0 }),
                    title: new Field({ source: "NAME", value: "", default_value: "", backupable: true, required: true })
                }
            };


            contractors.contractors = $factory({ classes: ["Collection", "States"], base_class: "Collection" });
            contractors.contractorTypes = $factory({ classes: ["Collection", "States"], base_class: "Collection" });


            contractors.getContractorTypes = function () {
                contractors.contractorTypes._states_.loaded(false);
                $http.post("serverside/controllers/contractors.php", { action: "getContractorTypes" })
                    .success(function (data) {
                        if (data !== undefined) {
                            if (data["error_code"] !== undefined) {
                                var db_error = $factory({ classes: ["DBError"], base_class: "DBError" });
                                db_error.init(data);
                                db_error.display();
                            } else {
                                angular.forEach(data, function (contractor_type) {
                                    var temp_type = $factory({ classes: ["ContractorType", "Model", "Backup", "States"], base_class: "ContractorType" });
                                    temp_type._model_.fromJSON(contractor_type);
                                    temp_type._backup_.setup();
                                    contractors.contractorTypes.append(temp_type);
                                });
                            }
                        }
                        contractors.contractorTypes._states_.loaded(true);
                        $log.log("contractor types = ", contractors.contractorTypes.items);
                    }
                );
            };


            contractors.addContractorType = function (type, callback) {
                if (type !== undefined) {
                    var params = {
                        action: "addContractorType",
                        data: {
                            title: type.title.value
                        }
                    };
                    $http.post("serverside/controllers/contractors.php", params)
                        .success(function (data) {
                            if (data !== undefined) {
                                if (data["error_code"] !== undefined) {
                                    var db_error = $factory({ classes: ["DBError"], base_class: "DBError" });
                                    db_error.init(data);
                                    db_error.display();
                                } else {
                                    var temp_type = $factory({ classes: ["ContractorType", "Model", "Backup", "States"], base_class: "ContractorType" });
                                    temp_type._model_.fromJSON(data);
                                    temp_type._backup_.setup();
                                    contractors.contractorTypes.append(temp_type);
                                    if (callback !== undefined)
                                        callback(temp_type);
                                }
                            }
                        }
                    );
                }
            };


            contractors.editContractorType = function (type, callback) {
                if (type !== undefined) {
                    var params = {
                        action: "editContractorType",
                        data: {
                            typeId: type.id.value,
                            title: type.title.value
                        }
                    };
                    $http.post("serverside/controllers/contractors.php", params)
                        .success(function (data) {
                            if (data !== undefined) {
                                if (data["error_code"] !== undefined) {
                                    var db_error = $factory({ classes: ["DBError"], base_class: "DBError" });
                                    db_error.init(data);
                                    db_error.display();
                                } else {
                                    type._backup_.setup();
                                    if (callback !== undefined)
                                        callback(data);
                                }
                            }
                        }
                    );
                }
            };


            contractors.deleteContractorType = function (typeId, callback) {
                if (typeId !== undefined) {
                    var params = {
                        action: "deleteContractorType",
                        data: {
                            typeId: typeId
                        }
                    };
                    $http.post("serverside/controllers/contractors.php", params)
                        .success(function (data) {
                            if (data !== undefined) {
                                if (data["error_code"] !== undefined) {
                                    var db_error = $factory({ classes: ["DBError"], base_class: "DBError" });
                                    db_error.init(data);
                                    db_error.display();
                                } else {
                                    angular.forEach(contractors.contractors.items, function (contractor) {
                                        if (contractor.contractorTypeId.value === typeId) {
                                            contractor.contractorTypeId.value = 0;
                                        }
                                    });
                                    contractors.contractorTypes.delete("id", typeId);
                                    if (callback !== undefined)
                                        callback(data);
                                }
                            }
                        }
                    );
                }
            };


            contractors.getContractors = function () {
                contractors.contractors._states_.loaded(false);
                $http.post("serverside/controllers/contractors.php", { action: "getContractors" })
                    .success(function (data) {
                        if (data !== undefined) {
                            if (data["error_code"] !== undefined) {
                                var db_error = $factory({ classes: ["DBError"], base_class: "DBError" });
                                db_error.init(data);
                                db_error.display();
                            } else {
                                angular.forEach(data, function (contractor) {
                                    var temp_contractor = $factory({ classes: ["Contractor", "Model", "Backup", "States"], base_class: "Contractor" });
                                    temp_contractor._model_.fromJSON(contractor);
                                    temp_contractor._backup_.setup();
                                    contractors.contractors.append(temp_contractor);
                                });
                            }
                            $log.log("contractors = ", contractors.contractors.items);
                        }
                        contractors.contractors._states_.loaded(true);
                    }
                );
            };


            contractors.addContractor = function (contractor, callback) {
                if (contractor !== undefined) {
                    var params = {
                        action: "addContractor",
                        data: {
                            contractorTypeId: contractor.contractorTypeId.value,
                            title: contractor.title.value,
                            fullTitle: contractor.fullTitle.value
                        }
                    };
                    $http.post("serverside/controllers/contractors.php", params)
                        .success(function (data) {
                            if (data !== undefined) {
                                if (data["error_code"] !== undefined) {
                                    var db_error = $factory({ classes: ["DBError"], base_class: "DBError" });
                                    db_error.init(data);
                                    db_error.display();
                                } else {
                                    var temp_contractor = $factory({ classes: ["Contractor", "Model", "Backup", "States"], base_class: "Contractor" });
                                    temp_contractor._model_.fromJSON(data);
                                    temp_contractor._backup_.setup();
                                    contractors.contractors.append(temp_contractor);
                                    if (callback !== undefined)
                                        callback(temp_contractor);
                                }
                            }
                        }
                    );
                }
            };

            contractors.editContractor = function (contractor, callback) {
                if (contractor !== undefined) {
                    var params = {
                        action: "editContractor",
                        data: {
                            contractorId: contractor.id.value,
                            contractorTypeId: contractor.id.value,
                            title: contractor.title.value,
                            fullTitle: contractor.fullTitle.value
                        }
                    };
                    $http.post("serverside/controllers/contractors.php", params)
                        .success(function (data) {
                            if (data !== undefined) {
                                if (data["error_code"] !== undefined) {
                                    var db_error = $factory({ classes: ["DBError"], base_class: "DBError" });
                                    db_error.init(data);
                                    db_error.display();
                                } else {
                                    contractor._backup_.setup();
                                    if (callback !== undefined)
                                        callback(data);
                                }
                            }
                        }
                    );
                }
            };


            contractors.getContractorsCountByType = function (contractorTypeId) {
                if (contractorTypeId !== undefined) {
                    var result = 0;
                    angular.forEach(contractors.contractors.items, function (contractor) {
                        if (contractor.contractorTypeId.value === contractorTypeId)
                            result++;
                    });
                    return result;
                }
            };

            return contractors;
        }]);
    })
    .run(function ($modules, $contractors) {
        $modules.load($contractors);
        //$contractors.getContractorTypes();
        //$contractors.getContractors();
    }
);
