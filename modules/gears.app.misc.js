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
                },

                /**
                 * PylonType
                 * Набор свойств, описывающих тип опоры
                 */
                PylonType: {
                    id: new Field({ source: "ID", value: 0, default_value: 0 }),
                    title: new Field({ source: "NAME", value: "", default_value: "", backupable: true, required: true })
                },

                /**
                 * AnchorType
                 * Набор свойств, описывающих тип крепления
                 */
                AnchorType: {
                    id: new Field({ source: "ID", value: 0, default_value: 0 }),
                    title: new Field({ source: "TITLE", value: "", default_value: "", backupable: true, required: true })
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


            misc.getPylonTypes = function () {
                $http.post("serverside/controllers/misc.php", { action: "getPylonTypes" })
                    .success(function (data) {
                        if (data !== undefined) {
                            if (data["error_code"] !== undefined) {
                                var db_error = $factory({ classes: ["DBError"], base_class: "DBError" });
                                db_error.init(data);
                                db_error.display();
                            } else {
                                angular.forEach(data, function (pylon_type) {
                                    var temp_pylon_type = $factory({ classes: ["PylonType", "Model", "Backup", "States"], base_class: "PylonType" });
                                    temp_pylon_type._model_.fromJSON(pylon_type);
                                    misc.pylonTypes.append(temp_pylon_type);
                                });
                            }
                            $log.log("pylon types = ", misc.pylonTypes.items);
                        }
                    }
                );
            };

            return misc;
        }]);
    })
    .run(function ($modules, $misc) {
        $modules.load($misc);
        //$misc.getPowerLines();
        //$misc.getCableTypes();
        $misc.powerLines._states_.loaded(false);
    }
);





misc.controller("PowerLinesController", ["$log", "$scope", "$misc", "$application", "$factory", "$nodes", "$modals", function ($log, $scope, $misc, $application, $factory, $nodes, $modals) {
    $scope.misc = $misc;
    $scope.app = $application;
    $scope.pylons = $factory({ classes: ["Collection", "States"], base_class: "Collection" });
    $scope.search = "";

    $scope.selectPowerLine = function (powerLineId) {
        if (powerLineId !== undefined) {
            angular.forEach($misc.powerLines.items, function (line) {
                if (line.id.value === powerLineId) {
                    if (line._states_.selected() === true) {
                        line._states_.selected(false);
                        $application.currentPowerLine = undefined;
                        $application.currentPowerLineNodes.clear();
                    } else {
                        line._states_.selected(true);
                        $application.currentPowerLine = line;
                        $log.log("currentPowerLineId = ", $application.currentPowerLine.id.value);
                        $application.currentPowerLineNodes._states_.loaded(false);
                        $application.currentPowerLineNodes.clear();
                        $application.currentPowerLineNodeConnectionNodes.clear();
                        $nodes.getPylonsByPowerLineId(powerLineId, $scope.onSuccessGetPylons)
                    }
                } else {
                    line._states_.selected(false);
                }
            });
        }
    };


    $scope.selectNode = function (nodeId) {
        if (nodeId !== undefined) {
            angular.forEach($application.currentPowerLineNodes.items, function (node) {
                if (node.id.value === nodeId) {
                    if (node._states_.selected() === true) {
                        node._states_.selected(false);
                        $application.currentPowerLineNode = undefined;
                        $application.currentPowerLineNodeConnectionNodes.clear();
                    } else {
                        node._states_.selected(true);
                        $application.currentPowerLineNode = node;
                        $application.currentPowerLineNodeConnectionNodes.clear();
                        $application.currentPowerLineNodeConnectionNodes._states_.loaded(false);
                        $nodes.getConnectionNodesByBaseNodeId(nodeId, $scope.onSuccessGetConnectionNodes);
                    }
                } else {
                    node._states_.selected(false);
                }
            });
        }
    };


    $scope.selectConnectionNode = function (connectionNodeId) {
        if (connectionNodeId !== undefined) {
            angular.forEach($application.currentPowerLineNodeConnectionNodes.items, function (node) {
                if (node.id.value === connectionNodeId) {
                    if (node._states_.selected() === true) {
                        node._states_.selected(false);
                        $application.currentPowerLineConnectionNode = undefined;
                        //$application.currentPowerLineNodeConnectionNodes.clear();
                    } else {
                        node._states_.selected(true);
                        $application.currentPowerLineConnectionNode = node;
                        //$application.currentPowerLineNodeConnectionNodes.clear();
                        //$application.currentPowerLineNodeConnectionNodes._states_.loaded(false);
                        //$nodes.getConnectionNodesByBaseNodeId(nodeId, $scope.onSuccessGetConnectionNodes);
                    }
                } else {
                    node._states_.selected(false);
                }
                $log.log($application.currentPowerLineConnectionNode);
            });
        }
    };


    $scope.onSuccessGetConnectionNodes = function (data) {
        if (data !== undefined) {
            angular.forEach(data, function (connector) {
                var temp_connector = $nodes.parseNode(connector);
                $application.currentPowerLineNodeConnectionNodes.append(temp_connector);
            });
            $application.currentPowerLineNodeConnectionNodes._states_.loaded(true);
            $log.log($scope.app.currentPowerLineNodeConnectionNodes.items);
        }
    };


    $scope.onSuccessGetPylons = function (data) {
        if (data !== undefined) {
            angular.forEach(data, function (pylon) {
                var temp_pylon = $nodes.parseNode(pylon);
                $application.currentPowerLineNodes.append(temp_pylon);
            });
            $application.currentPowerLineNodes._states_.loaded(true);
        }
    };


    $scope.addPowerLine = function () {
        $modals.show({
            width: 400,
            position: "center",
            caption: "Новая линия",
            showFog: true,
            template: "templates/modals/new-power-line.html"
        });
    };


    $scope.editPowerLine = function (event) {
        event.stopPropagation();
        $modals.show({
            width: 400,
            position: "center",
            caption: "Редактирование линии",
            showFog: true,
            closeButton: false,
            template: "templates/modals/edit-power-line.html"
        });
    };

    $scope.deleteType = function () {
        $modals.show({
            width: 400,
            position: "center",
            caption: "Удаление типа контрагента",
            showFog: true,
            closeButton: true,
            template: "templates/modals/delete-contractor-type.html"
        });
    };

    $scope.addNode = function () {
        $modals.show({
            width: 400,
            position: "center",
            caption: "Новый объект на линии",
            showFog: true,
            template: "templates/modals/new-power-line-node.html"
        });
    };

    $scope.editNode = function (event) {
        event.stopPropagation();
        $modals.show({
            width: 400,
            position: "center",
            caption: "Редактирование объекта на линии",
            showFog: true,
            closeButton: false,
            template: "templates/modals/edit-power-line-node.html"
        });
    };

    $scope.addConnectionNode = function () {
        $modals.show({
            width: 400,
            position: "center",
            caption: "Новое оборудование на объекте",
            showFog: true,
            template: "templates/modals/new-connection-node.html"
        });
    };


    $scope.editConnectionNode = function (event) {
        $log.log(event);
        event.stopPropagation();
    };


    $scope.deleteConnectionNode = function (connectionNodeId, event) {
        event.stopPropagation();
        if (connectionNodeId !== undefined) {
            $modals.show({
                width: 400,
                position: "center",
                caption: "Удаление оборудования на объекте",
                showFog: true,
                closeButton: true,
                template: "templates/modals/delete-connection-node.html",
                data: {
                    connectionNodeId: connectionNodeId
                }
            });
        }
    };
}]);





/**
 * EditPowerLineModalController
 * Контроллер модального окна редактирования линии
 */
misc.controller("EditPowerLineModalController", ["$log", "$scope", "$misc", "$application", "$modals", function ($log, $scope, $misc, $application, $modals) {
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
        $application.currentPowerLine._states_.changed(false);
        $application.currentPowerLine._backup_.setup();
        $modals.close();
    };
}]);





/**
 * AddPowerLineNodeModalController
 * Контроллер модального окна добавления опоры в линию
 */
misc.controller("AddPowerLineNodeModalController", ["$log", "$scope", "$misc", "$factory", "$application", "$modals", "$nodes", function ($log, $scope, $misc, $factory, $application, $modals, $nodes) {
    $scope.misc = $misc;
    $scope.app = $application;
    $scope.nodes = $nodes;
    $scope.newNode = undefined;
    $scope.newNodeTypeId = 0;
    $scope.errors = [];


    $scope.onChangeNodeType = function (typeId) {
        if (typeId !== undefined) {
            switch (typeId) {
                case 1:
                    $scope.newNode = $factory({ classes: ["Pylon", "Model", "Backup", "States"], base_class: "Pylon" });
                    break;
                case 4:
                    $scope.newNode = $factory({ classes: ["PowerStation", "Model", "Backup", "States"], base_class: "PowerStation" });
                    break;
            }
            $log.log("newNode = ", $scope.newNode);
        }
    };

    $scope.validate = function () {
        $scope.errors.splice(0, $scope.errors.length);
        if ($scope.newNodeTypeId === 1) {
            $scope.newNode.powerLineId.value = $application.currentPowerLine.id.value;
            if ($scope.newNode.number.value === "" || $scope.newNode.number.value === 0)
                $scope.errors.push("Вы не указали номер опоры");
            if ($scope.newNode.powerLineId.value === 0)
                $scope.errors.push("Вы не указали линию");
        }
        if ($scope.errors.length === 0) {
            $nodes.addNode($scope.newNode, $scope.onSuccessAddNode);
        }
    };


    $scope.onSuccessAddNode = function (data) {
        $modals.close();
        $scope.newNode._model_.reset();
        var temp_node = $nodes.parseNode(data);
        $application.currentPowerLineNodes.append(temp_node);
    };


    $scope.cancel = function () {
        $modals.close();
        $scope.errors.splice(0, $scope.errors.length);
        if ($scope.newNode !== undefined) {
            $scope.newNode._model_.reset();
            $scope.newNode._states_.changed(false);
        }
    };
}]);





/**
 * EditPowerLineNodeModalController
 * Контроллер модального окна редактирования опоры
 */
misc.controller("EditPowerLineNodeModalController", ["$log", "$scope", "$misc", "$application", "$modals", "$nodes", function ($log, $scope, $misc, $application, $modals, $nodes) {
    $scope.app = $application;
    $scope.misc = $misc;
    $scope.errors = [];

    $scope.cancel = function () {
        $modals.close();
        $scope.errors.splice(0, $scope.errors.length);
        $application.currentPowerLineNode._backup_.restore();
        $application.currentPowerLineNode._states_.changed(false);
    };

    $scope.validate = function () {
        $scope.errors.splice(0, $scope.errors.length);
        if ($application.currentPowerLineNode.number.value === "")
            $scope.errors.push("Вы не указали номер опоры");
        if ($application.currentPowerLineNode.powerLineId.value === "")
            $scope.errors.push("Вы не указали линию");
        if ($scope.errors.length === 0) {
            $application.currentPowerLineNode._states_.loading(true);
            $nodes.editNode($application.currentPowerLineNode, $scope.onSuccessEditNode);
        }
    };

    $scope.onSuccessEditNode = function (data) {
        $application.currentPowerLineNode._states_.loaded(true);
        $application.currentPowerLineNode._states_.loading(false);
        $application.currentPowerLineNode._backup_.setup();
        $modals.close();
    };
}]);





/**
 * AddConnectionNodeModalController
 * Контроллер модального окна добавления узла-коннектора к объекту
 */
misc.controller("AddConnectionNodeModalController", ["$log", "$scope", "$misc", "$factory", "$application", "$modals", "$nodes", function ($log, $scope, $misc, $factory, $application, $modals, $nodes) {
    $scope.nodes = $nodes;
    $scope.misc = $misc;
    $scope.newConnectionNode = undefined;
    $scope.newConnectionNodeTypeId = 0;
    $scope.errors = [];

    $scope.onChangeNodeType = function (typeId) {
        if (typeId !== undefined) {
            switch (typeId) {
                case 2:
                    $scope.newConnectionNode = $factory({ classes: ["Anchor", "Model", "Backup", "States"], base_class: "Anchor" });
                    break;
                case 3:
                    $scope.newConnectionNode = $factory({ classes: ["Union", "Model", "Backup", "States"], base_class: "Union" });
                    break;
            }
            $log.log("newConnectionNode = ", $scope.newConnectionNode);
        }
    };

    $scope.validate = function () {
        $scope.errors.splice(0, $scope.errors.length);
        if ($scope.newConnectionNodeTypeId === 0) {
            $scope.errors.push("Вы не выбрали тип оборудования");
        }
        if ($scope.newConnectionNodeTypeId === 2) {
            if ($scope.newConnectionNode.anchorTypeId.value === 0)
                $scope.errors.push("Вы не выбрали тип крепления");
        }
        if ($scope.errors.length === 0) {
            $nodes.addConnectionNode(
                $scope.newConnectionNode,
                $scope.newConnectionNodeTypeId,
                $application.currentPowerLineNode.id.value,
                $scope.onSuccessAddConnectionNode
            );
        }
    };


    $scope.onSuccessAddConnectionNode = function (data) {
        $modals.close();
        $scope.newConnectionNode = undefined;
        $scope.newConnectionNodeTypeId = 0;
        var temp_connection_node = $nodes.parseNode(data);
        $application.currentPowerLineNodeConnectionNodes.append(temp_connection_node);
    };


    $scope.cancel = function () {
        $modals.close();
        $scope.errors.splice(0, $scope.errors.length);
        $scope.newConnectionNodeTypeId = 0;
        $scope.newConnectionNode = undefined;
    };
}]);