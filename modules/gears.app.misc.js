"use strict";


var misc = angular.module("gears.app.misc", [])
    .config(function ($provide) {

        /**
         * $misc
         * Сервис, содержащий функционал для работы со вспомогательным оборудованием и пр.
         */
        $provide.factory("$misc", ["$log", "$http", "$factory", function ($log, $http, $factory) {
            var misc = {};


            /**
             * Наборы свойст и методов, описывающих модели данных
             */
            misc.classes = {
                /**
                 * Powerline
                 * Набор свойств, описывающих линию
                 */
                PowerLine: {
                    id: new Field({ source: "ID", value: 0, default_value: 0, backupable: true }),
                    title: new Field({ source: "TITLE", value: "", default_value: "", backupable: true }),
                    voltage: new Field({ source: "VOLTAGE", value: 0, default_value: 0, backupable: true }),
                    display: "",

                    _init_: function () {
                        //this.isBasicNode.value = this.isBasicNode.value === 1 ? true : false;
                        $log.log(this.title);
                        this.display = this.title.value + " (" + this.voltage.value + " кВ)";
                    }
                },

                /**
                 * CableType
                 * Набор свойст, описывающих тип кабеля
                 */
                CableType: {
                    id: new Field({ source: "ID", value: 0, default_value: 0 }),
                    title: new Field({ source: "NAME", value: "", default_value: "", backupable: true, required: true }),
                    fullTitle: new Field({ source: "FULL_NAME", value: "", default_value: "", backupable: true, required: true }),
                    capacity: new Field({ source: "CAPACITY", value: 0, default_value: 0, backupable: true, required: true }),
                    colorCode: new Field({ source: "COLOR_CODE", value: 0, default_value: 0, backupable: true, required: true })
                }
            };


            misc.powerLines = $factory({ classes: ["Collection", "States"], base_class: "Collection" });
            misc.pylonTypes = $factory({ classes: ["Collection", "States"], base_class: "Collection" });
            misc.cableTypes = $factory({ classes: ["Collection", "States"], base_class: "Collection" });
            misc.anchorTypes = $factory({ classes: ["Collection", "States"], base_class: "Collection" });
            misc.vibroTypes = $factory({ classes: ["Collection", "States"], base_class: "Collection" });


            misc.getPowerLines = function () {
                misc.powerLines._states_.loaded(false);
                $http.post("serverside/controllers/misc.php", { action: "getPowerLines" })
                    .success(function (data) {
                        if (data !== undefined) {
                            if (data["error_code"] !== undefined) {
                                var db_error = $factory({ classes: ["DBError"], base_class: "DBError" });
                                db_error.init(data);
                                db_error.display();
                            } else {
                                angular.forEach(data, function (powerline) {
                                    var temp_powerline = $factory({ classes: ["PowerLine", "Model", "Backup", "States"], base_class: "PowerLine" });
                                    temp_powerline._model_.fromJSON(powerline);
                                    temp_powerline._backup_.setup();
                                    misc.powerLines.append(temp_powerline);
                                });
                            }
                        }
                        misc.powerLines._states_.loaded(true);
                        $log.log("powerlines = ", misc.powerLines.items);
                    }
                );
            };


            misc.addPowerLine = function (powerLine, callback) {
                if (powerLine !== undefined) {
                    var params = {
                        action: "addPowerLine",
                        data: {
                            title: powerLine.title.value,
                            voltage: powerLine.voltage.value
                        }
                    };
                    $http.post("serverside/controllers/misc.php", params)
                        .success(function (data) {
                            if (data !== undefined) {
                                if (data["error_code"] !== undefined) {
                                    var db_error = $factory({ classes: ["DBError"], base_class: "DBError" });
                                    db_error.init(data);
                                    db_error.display();
                                } else {
                                    var temp_power_line = $factory({ classes: ["PowerLine", "Model", "Backup", "States"], base_class: "PowerLine" });
                                    temp_power_line._model_.fromJSON(data);
                                    temp_power_line._backup_.setup();
                                    misc.powerLines.append(temp_power_line);
                                    if (callback !== undefined)
                                        callback(temp_power_line);
                                }
                            }
                        }
                    );
                }
            };


            misc.editPowerLine = function (powerLine, callback) {
                if (powerLine !== undefined) {
                    var params = {
                        action: "editPowerLine",
                        data: {
                            powerLineId: powerLine.id.value,
                            title: powerLine.title.value,
                            voltage: powerLine.voltage.value
                        }
                    };
                    $http.post("serverside/controllers/misc.php", params)
                        .success(function (data) {
                            if (data !== undefined) {
                                if (data["error_code"] !== undefined) {
                                    var db_error = $factory({ classes: ["DBError"], base_class: "DBError" });
                                    db_error.init(data);
                                    db_error.display();
                                } else {
                                    powerLine._backup_.setup();
                                    if (callback !== undefined)
                                        callback(data);
                                }
                            }
                        }
                    );
                }
            };


            misc.getCableTypes = function () {
                $http.post("serverside/controllers/misc.php", { action: "getCableTypes" })
                    .success(function (data) {
                        if (data !== undefined) {
                            if (data["error_code"] !== undefined) {
                                var db_error = $factory({ classes: ["DBError"], base_class: "DBError" });
                                db_error.init(data);
                                db_error.display();
                            } else {
                                angular.forEach(data, function (cable_type) {
                                    var temp_cable_type = $factory({ classes: ["CableType", "Model", "Backup", "States"], base_class: "CableType" });
                                    temp_cable_type._model_.fromJSON(cable_type);
                                    misc.cableTypes.append(temp_cable_type);
                                });
                            }
                            $log.log("cable types = ", misc.cableTypes.items);
                        }
                    }
                );
            };

            return misc;
        }]);
    })
    .run(function ($modules, $misc) {
        $modules.load($misc);
        $misc.getPowerLines();
        //$misc.getCableTypes();
    }
);