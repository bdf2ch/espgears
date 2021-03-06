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
                    title: new Field({ source: "TITLE", value: "", default_value: "", backupable: true, required: true }),
                    fullTitle: new Field({ source: "FULL_TITLE", value: "", default_value: "", backupable: true, required: true }),
                    capacity: new Field({ source: "CAPACITY", value: 0, default_value: 0, backupable: true, required: true }),
                    colorCode: new Field({ source: "COLOR_CODE", value: 0, default_value: 0, backupable: true, required: true })
                },

                /**
                 * PylonType
                 * Набор свойств, описывающих тип опоры
                 */
                PylonType: {
                    id: new Field({ source: "ID", value: 0, default_value: 0 }),
                    title: new Field({ source: "TITLE", value: "", default_value: "", backupable: true, required: true })
                },

                /**
                 * AnchorType
                 * Набор свойств, описывающих тип крепления
                 */
                AnchorType: {
                    id: new Field({ source: "ID", value: 0, default_value: 0 }),
                    title: new Field({ source: "TITLE", value: "", default_value: "", backupable: true, required: true })
                },

                /**
                 * VibroType
                 * Набор свойств и методов, описывающих тип виброгасителя
                 */
                VibroType: {
                    id: new Field({ source: "ID", value: 0, default_value: 0, type: "integer", backupable: true }),
                    title: new Field({ source: "TITLE", value: "", default_value: "", type: "string", backupable: true })
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

            misc.addPylonType = function (pylonType, callback) {
                if (pylonType !== undefined) {
                    var params = {
                        action: "addPylonType",
                        data: {
                            title: pylonType.title.value
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
                                    if (callback !== undefined)
                                        callback(data);
                                }
                            }
                        });
                }
            };

            misc.editPylonType = function (pylonType, callback) {
                if (pylonType !== undefined) {
                    var params = {
                        action: "editPylonType",
                        data: {
                            id: pylonType.id.value,
                            title: pylonType.title.value
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
                                    if (callback !== undefined)
                                        callback(data);
                                }
                            }
                        });
                }
            };

            misc.deletePylonType = function (pylonTypeId, callback) {
                if (pylonTypeId !== undefined) {
                    var params = {
                        action: "deletePylonType",
                        data: {
                            id: pylonTypeId
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
                                    if (callback !== undefined)
                                        callback(data);
                                }
                            }
                        });
                }
            };

            misc.addCableType = function (cableType, callback) {
                if (cableType !== undefined) {
                    var params = {
                        action: "addCableType",
                        data: {
                            title: cableType.title.value,
                            fullTitle: cableType.fullTitle.value,
                            capacity: cableType.capacity.value,
                            colorCode: cableType.colorCode.value
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
                                    if (callback !== undefined)
                                        callback(data);
                                }
                            }
                        });
                }
            };

            misc.editCableType = function (cableType, callback) {
                if (cableType !== undefined) {
                    var params = {
                        action: "editCableType",
                        data: {
                            id: cableType.id.value,
                            title: cableType.title.value,
                            fullTitle: cableType.fullTitle.value,
                            capacity: cableType.capacity.value,
                            colorCode: cableType.colorCode.value
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
                                    if (callback !== undefined)
                                        callback(data);
                                }
                            }
                        });
                }
            };

            misc.deleteCableType = function (cableTypeId, callback) {
                if (cableTypeId !== undefined) {
                    var params = {
                        action: "deleteCableType",
                        data: {
                            id: cableTypeId
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
                                    if (callback !== undefined)
                                        callback(data);
                                }
                            }
                        });
                }
            };

            misc.addAnchorType = function (anchorType, callback) {
                if (anchorType !== undefined) {
                    var params = {
                        action: "addAnchorType",
                        data: {
                            title: anchorType.title.value
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
                                    if (callback !== undefined)
                                        callback(data);
                                }
                            }
                        });
                }
            };

            misc.editAnchorType = function (anchorType, callback) {
                if (anchorType !== undefined) {
                    var params = {
                        action: "editAnchorType",
                        data: {
                            id: anchorType.id.value,
                            title: anchorType.title.value
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
                                    if (callback !== undefined)
                                        callback(data);
                                }
                            }
                        });
                }
            };

            misc.deleteAnchorType = function (anchorTypeId, callback) {
                if (anchorTypeId !== undefined) {
                    var params = {
                        action: "deleteAnchorType",
                        data: {
                            id: anchorTypeId
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
                                    if (callback !== undefined)
                                        callback(data);
                                }
                            }
                        });
                }
            };

            misc.addVibroType = function (vibroType, callback) {
                if (vibroType !== undefined) {
                    var params = {
                        action: "addVibroType",
                        data: {
                            title: vibroType.title.value
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
                                    if (callback !== undefined)
                                        callback(data);
                                }
                            }
                        });
                }
            };

            misc.editVibroType = function (vibroType, callback) {
                if (vibroType !== undefined) {
                    var params = {
                        action: "editVibroType",
                        data: {
                            id: vibroType.id.value,
                            title: vibroType.title.value
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
                                    if (callback !== undefined)
                                        callback(data);
                                }
                            }
                        });
                }
            };

            misc.deleteVibroType = function (vibroTypeId, callback) {
                if (vibroTypeId !== undefined) {
                    var params = {
                        action: "deleteVibroType",
                        data: {
                            id: vibroTypeId
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
                                    if (callback !== undefined)
                                        callback(data);
                                }
                            }
                        });
                }
            };


            return misc;
        }]);
    })
    .run(function ($modules, $misc, $menu) {
        $modules.load($misc);
        $misc.powerLines._states_.loaded(false);
        $misc.pylonTypes._states_.loaded(false);
        $misc.cableTypes._states_.loaded(false);
        $misc.anchorTypes._states_.loaded(false);
        $misc.vibroTypes._states_.loaded(false);
    }
);





misc.controller("PowerLinesController", ["$log", "$scope", "$misc", "$application", "$factory", "$nodes", "$modals", "$columns", function ($log, $scope, $misc, $application, $factory, $nodes, $modals, $columns) {
    $scope.misc = $misc;
    $scope.app = $application;
    $scope.pylons = $factory({ classes: ["Collection", "States"], base_class: "Collection" });
    $scope.search = "";
    $scope.markers = [];



    $scope.selectPowerLine = function (powerLineId) {
        if (powerLineId !== undefined) {
            angular.forEach($misc.powerLines.items, function (line) {
                if (line.id.value === powerLineId) {
                    if (line._states_.selected() === true) {
                        line._states_.selected(false);
                        $application.currentPowerLine = undefined;
                        $application.currentPowerLineNodes.clear();
                        $application.currentPowerLineNodeConnectionNodes.clear();
                        angular.forEach($application.powerLinesMap.markers, function (marker) {
                            marker.setMap(null);
                        });
                        angular.forEach($application.powerLinesMap.links, function (link) {
                            link.setMap(null);
                        });
                        $application.powerLinesMap.markers.splice(0, $application.powerLinesMap.markers.length);
                        $application.powerLinesMap.links.splice(0, $application.powerLinesMap.links.length);
                        $application.currentPowerLineNode = undefined;
                    } else {
                        line._states_.selected(true);
                        $application.currentPowerLine = line;
                        $log.log("currentPowerLineId = ", $application.currentPowerLine.id.value);
                        $application.currentPowerLineNodes._states_.loaded(false);
                        $application.currentPowerLineNodes.clear();
                        $application.currentPowerLineNodeConnectionNodes.clear();
                        angular.forEach($application.powerLinesMap.markers, function (marker) {
                            marker.setMap(null);
                        });
                        angular.forEach($application.powerLinesMap.links, function (link) {
                            link.setMap(null);
                        });
                        $application.powerLinesMap.markers.splice(0, $application.powerLinesMap.markers.length);
                        $application.powerLinesMap.links.splice(0, $application.powerLinesMap.links.length);
                        $nodes.getPylonsByPowerLineId(powerLineId, $scope.onSuccessGetPylons);
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
                        angular.forEach($application.powerLinesMap.markers, function (marker) {
                            if (marker.nodeId === nodeId) {
                                $application.powerLinesMap.map.setCenter(marker.getPosition());
                                $application.powerLinesMap.map.setZoom(16);
                                angular.forEach($application.powerLinesMap.windows, function (window) {
                                    if (window.nodeId === nodeId) {
                                        window.open($application.powerLinesMap.map, marker);
                                    }
                                });
                            }
                        });
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
            angular.forEach(data, function (node) {
                var temp_node = $nodes.parseNode(node);
                $application.currentPowerLineNodes.append(temp_node);
                var title = "";
                var content = "";
                switch (temp_node.__class__) {
                    case "Pylon":
                        title = "Опора #" + temp_node.number.value;
                        content = "<b>Опора #" + temp_node.number.value + "</b><br/><span class='secondary-text'>Тип опоры: ";
                        if (temp_node.pylonTypeId.value === 0)
                            content = content + "не указан</span>";
                        else
                            content = content + $misc.pylonTypes.find("id", temp_node.pylonTypeId.value).title.value + "</span>";
                        break;
                }
                var infowindow = new google.maps.InfoWindow({
                    content: content
                });
                infowindow.nodeId = temp_node.id.value;
                $application.powerLinesMap.windows.push(infowindow);
                var image = {
                    url: 'resources/img/icons/pylon.png',
                    // This marker is 20 pixels wide by 32 pixels high.
                    //size: new google.maps.Size(20, 32),
                    // The origin for this image is (0, 0).
                    origin: new google.maps.Point(0, 0),
                    // The anchor for this image is the base of the flagpole at (0, 32).
                    anchor: new google.maps.Point(20, 20)
                };

                var marker = new google.maps.Marker({
                    position: { lat: parseFloat(node["LATITUDE"]), lng: parseFloat(node["LONGITUDE"])},
                    map: $application.powerLinesMap.map,
                    title: title,
                    icon: image
                });
                marker.nodeId = temp_node.id.value;

                marker.addListener('click', function() {
                    $scope.selectNode(temp_node.id.value);
                    $columns.scrollTo("powerlines", "nodes", "powerline_node_" + temp_node.id.value);
                    //$application.powerLinesMap.map.setCenter(marker.getPosition());
                    //infowindow.open($application.powerLinesMap.map, marker);
                });
                $application.powerLinesMap.markers.push(marker);




            });

            for (var i = 0; i < $application.powerLinesMap.markers.length; i++) {
                if ($application.powerLinesMap.markers[i + 1] !== undefined) {
                    var link = new google.maps.Polyline({
                        path: [$application.powerLinesMap.markers[i].getPosition(), $application.powerLinesMap.markers[i+1].getPosition()],
                        geodesic: true,
                        strokeColor: '#FF0000',
                        strokeOpacity: 1.0,
                        strokeWeight: 2
                    });
                    link.setMap($application.powerLinesMap.map);
                    $application.powerLinesMap.links.push(link);
                }
            }

            if ($application.currentPowerLineNodes.size() > 0) {
                $application.powerLinesMap.map.fitBounds(
                    new google.maps.LatLngBounds(
                        {
                            lat: $application.powerLinesMap.markers[0].getPosition().lat(),
                            lng: $application.powerLinesMap.markers[0].getPosition().lng()
                        },
                        {
                            lat: $application.powerLinesMap.markers[$application.powerLinesMap.markers.length-1].getPosition().lat(),
                            lng: $application.powerLinesMap.markers[$application.powerLinesMap.markers.length-1].getPosition().lng()
                        }
                    )
                );
            }

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


    $scope.init = function () {
        $application.powerLinesMap.map = new google.maps.Map(document.getElementById('powerLinesMap'), {
            center: { lat: 67.808029, lng: 34.538108 },
            zoom: 5,
            mapTypeId: google.maps.MapTypeId.SATELLITE
        });
    };


    $scope.refreshMap = function () {
        google.maps.event.addListener($application.powerLinesMap.map, "idle", function(){
            google.maps.event.trigger($application.powerLinesMap.map, 'resize');
        });
    };

    $scope.min = function () {
        $log.info("MINIMIZED");
    };
}]);




misc.controller("EquipmentController", ["$log", "$scope", "$misc", "$application", "$modals", function ($log, $scope, $misc, $application, $modals) {
    $scope.app = $application;
    $scope.misc = $misc;

    $scope.selectPylonType = function (typeId) {
        if (typeId !== undefined) {
            angular.forEach($misc.pylonTypes.items, function (pylonType) {
                if (pylonType.id.value === typeId) {
                    if (pylonType._states_.selected() === true) {
                        pylonType._states_.selected(false);
                        $application.equipment.currentPylonType = undefined;
                    } else {
                        pylonType._states_.selected(true);
                        $application.equipment.currentPylonType = pylonType;
                    }
                } else {
                    pylonType._states_.selected(false);
                }
            });
        }
    };

    $scope.selectCableType = function (typeId) {
        if (typeId !== undefined) {
            angular.forEach($misc.cableTypes.items, function (cableType) {
                if (cableType.id.value === typeId) {
                    if (cableType._states_.selected() === true) {
                        cableType._states_.selected(false);
                        $application.equipment.currentCableType = undefined;
                    } else {
                        cableType._states_.selected(true);
                        $application.equipment.currentCableType = cableType;
                    }
                } else {
                    cableType._states_.selected(false);
                }
            });
        }
    };

    $scope.selectAnchorType = function (typeId) {
        if (typeId !== undefined) {
            angular.forEach($misc.anchorTypes.items, function (anchorType) {
                if (anchorType.id.value === typeId) {
                    if (anchorType._states_.selected() === true) {
                        anchorType._states_.selected(false);
                        $application.equipment.currentAnchorType = undefined;
                    } else {
                        anchorType._states_.selected(true);
                        $application.equipment.currentAnchorType = anchorType;
                    }
                } else {
                    anchorType._states_.selected(false);
                }
            });
        }
    };

    $scope.selectVibroType = function (typeId) {
        if (typeId !== undefined) {
            angular.forEach($misc.vibroTypes.items, function (vibroType) {
                if (vibroType.id.value === typeId) {
                    if (vibroType._states_.selected() === true) {
                        vibroType._states_.selected(false);
                        $application.equipment.currentVibroType = undefined;
                    } else {
                        vibroType._states_.selected(true);
                        $application.equipment.currentVibroType = vibroType;
                    }
                } else {
                    vibroType._states_.selected(false);
                }
            });
        }
    };


    $scope.addPylonType = function () {
        $modals.show({
            width: 400,
            position: "center",
            caption: "Новый тип опоры",
            showFog: true,
            closeButton: false,
            template: "templates/equipment/new-pylon-type.html"
        });
    };

    $scope.editPylonType = function (event) {
        event.stopPropagation();
        $modals.show({
            width: 400,
            position: "center",
            caption: "Редактирование типа опоры",
            showFog: true,
            closeButton: false,
            template: "templates/equipment/edit-pylon-type.html"
        });
    };

    $scope.deletePylonType = function (event) {
        event.stopPropagation();
        $modals.show({
            width: 400,
            position: "center",
            caption: "Удаление типа опоры",
            showFog: true,
            closeButton: false,
            template: "templates/equipment/delete-pylon-type.html"
        });
    };

    $scope.addCableType = function () {
        $modals.show({
            width: 400,
            position: "center",
            caption: "Новый тип кабеля",
            showFog: true,
            closeButton: false,
            template: "templates/equipment/new-cable-type.html"
        });
    };

    $scope.editCableType = function (event) {
        event.stopPropagation();
        $modals.show({
            width: 400,
            position: "center",
            caption: "Редактирование типа кабеля",
            showFog: true,
            closeButton: false,
            template: "templates/equipment/edit-cable-type.html"
        });
    };

    $scope.deleteCableType = function (event) {
        event.stopPropagation();
        $modals.show({
            width: 400,
            position: "center",
            caption: "Удаление типа кабеля",
            showFog: true,
            closeButton: false,
            template: "templates/equipment/delete-cable-type.html"
        });
    };

    $scope.addAnchorType = function () {
        $modals.show({
            width: 400,
            position: "center",
            caption: "Новый тип крепления",
            showFog: true,
            closeButton: false,
            template: "templates/equipment/new-anchor-type.html"
        });
    };

    $scope.editAnchorType = function (event) {
        event.stopPropagation();
        $modals.show({
            width: 400,
            position: "center",
            caption: "Редактирование типа крепления",
            showFog: true,
            closeButton: false,
            template: "templates/equipment/edit-anchor-type.html"
        });
    };

    $scope.deleteAnchorType = function (event) {
        event.stopPropagation();
        $modals.show({
            width: 400,
            position: "center",
            caption: "Удаление типа крепления",
            showFog: true,
            closeButton: false,
            template: "templates/equipment/delete-anchor-type.html"
        });
    };

    $scope.addVibroType = function () {
        $modals.show({
            width: 400,
            position: "center",
            caption: "Новый тип виброгасителя",
            showFog: true,
            closeButton: false,
            template: "templates/equipment/new-vibro-type.html"
        });
    };

    $scope.editVibroType = function (event) {
        event.stopPropagation();
        $modals.show({
            width: 400,
            position: "center",
            caption: "Редактирование типа виброгасителя",
            showFog: true,
            closeButton: false,
            template: "templates/equipment/edit-vibro-type.html"
        });
    };

    $scope.deleteVibroType = function (event) {
        event.stopPropagation();
        $modals.show({
            width: 400,
            position: "center",
            caption: "Удаление типа виброгасителя",
            showFog: true,
            closeButton: false,
            template: "templates/equipment/delete-vibro-type.html"
        });
    };
}]);



/********** MODAL CONTROLLERS ********/

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
misc.controller("AddPowerLineNodeModalController", ["$log", "$scope", "$misc", "$factory", "$application", "$modals", "$nodes", "$columns", function ($log, $scope, $misc, $factory, $application, $modals, $nodes, $columns) {
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
        var title = "";
        var content = "";
        switch (temp_node.__class__) {
            case "Pylon":
                title = "Опора #" + temp_node.number.value;
                content = "<b>Опора #" + temp_node.number.value + "</b><br/><span class='secondary-text'>Тип опоры: ";
                if (temp_node.pylonTypeId.value === 0)
                    content = content + "не указан</span>";
                else
                    content = content + $misc.pylonTypes.find("id", temp_node.pylonTypeId.value).title.value + "</span>";
                break;
        }
        var infowindow = new google.maps.InfoWindow({
            content: content
        });
        infowindow.nodeId = temp_node.id.value;
        $application.powerLinesMap.windows.push(infowindow);
        var image = {
            url: 'resources/img/icons/pylon.png'
        };
        var marker = new google.maps.Marker({
            position: { lat: parseFloat(data["LATITUDE"]), lng: parseFloat(data["LONGITUDE"])},
            map: $application.powerLinesMap.map,
            title: title,
            icon: image
        });
        marker.nodeId = temp_node.id.value;
        marker.addListener('click', function() {
            //infowindow.open($application.powerLinesMap.map, marker);
            //$application.powerLinesMap.map.setCenter(marker.getPosition());

            angular.forEach($application.currentPowerLineNodes.items, function (node) {
                if (node.id.value === temp_node.id.value) {
                    if (node._states_.selected() === true) {
                        node._states_.selected(false);
                        $application.currentPowerLineNode = undefined;
                        $application.currentPowerLineNodeConnectionNodes.clear();
                    } else {
                        node._states_.selected(true);
                        $application.currentPowerLineNode = node;
                        $application.currentPowerLineNodeConnectionNodes.clear();
                        $application.currentPowerLineNodeConnectionNodes._states_.loaded(false);
                        angular.forEach($application.powerLinesMap.markers, function (marker) {
                            if (marker.nodeId === temp_node.id.value) {
                                $application.powerLinesMap.map.setCenter(marker.getPosition());
                                $application.powerLinesMap.map.setZoom(16);
                                angular.forEach($application.powerLinesMap.windows, function (window) {
                                    if (window.nodeId === temp_node.id.value) {
                                        window.open($application.powerLinesMap.map, marker);
                                    }
                                });
                            }
                        });
                        $nodes.getConnectionNodesByBaseNodeId(temp_node.id.value, $scope.onSuccessGetConnectionNodes);
                    }
                } else {
                    node._states_.selected(false);
                }
            });
            $columns.scrollTo("powerlines", "nodes", "powerline_node_" + temp_node.id.value);

        });
        $application.powerLinesMap.markers.push(marker);

        if ($application.powerLinesMap.markers.length > 1) {
            var link = new google.maps.Polyline({
                path: [$application.powerLinesMap.markers[$application.powerLinesMap.markers.length - 2].getPosition(), $application.powerLinesMap.markers[$application.powerLinesMap.markers.length - 1].getPosition()],
                geodesic: true,
                strokeColor: '#FF0000',
                strokeOpacity: 1.0,
                strokeWeight: 2
            });
            link.setMap($application.powerLinesMap.map);
            $application.powerLinesMap.links.push(link);
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

        $modals.close();

        var temp_node = $nodes.parseNode(data);
        $log.log("edited node = ", temp_node);




        var title = "";
        var content = "";
        switch (temp_node.__class__) {
            case "Pylon":
                title = "Опора #" + temp_node.number.value;
                content = "<b>Опора #" + temp_node.number.value + "</b><br/><span class='secondary-text'>Тип опоры: ";
                if (temp_node.pylonTypeId.value === 0)
                    content = content + "не указан</span>";
                else
                    content = content + $misc.pylonTypes.find("id", temp_node.pylonTypeId.value).title.value + "</span>";
                break;
        }




        angular.forEach($application.powerLinesMap.markers, function (marker) {
            if (marker.nodeId === temp_node.id.value) {
                marker.setTitle("Орора #" + temp_node.number.value);
                if (marker.getPosition().lat() !== temp_node.latitude.value || marker.getPosition().lng() !== temp_node.longitude.value) {
                    marker.setPosition(new google.maps.LatLng({lat: temp_node.latitude.value, lng: temp_node.longitude.value}));
                }
            }
        });
        angular.forEach($application.powerLinesMap.windows, function (window) {
            if (window.nodeId === temp_node.id.value) {
                window.setContent(content);
            }
        });

        $log.log("old lat = ", $application.currentPowerLineNode._backup_.data.latitude, ", old lng = ", $application.currentPowerLineNode._backup_.data.longitude);
        angular.forEach($application.powerLinesMap.links, function (link) {
            var path = link.getPath().getArray();
            $log.log("start = ", path[0].lat(), ", ", path[0].lng(), "; end = ", +path[1].lat().toFixed(6), ", ", +path[1].lng().toFixed(6));
            //var new_path = [];
            if (+path[1].lat().toFixed(6) === $application.currentPowerLineNode._backup_.data.latitude && +path[1].lng().toFixed(6) === $application.currentPowerLineNode._backup_.data.longitude) {
                $log.log("IN link found");
                var new_path = [new google.maps.LatLng({ lat: path[0].lat(), lng: path[0].lng() }), new google.maps.LatLng({ lat: temp_node.latitude.value, lng: temp_node.longitude.value })];
                link.setPath(new google.maps.MVCArray(new_path));
            }

            if (+path[0].lat().toFixed(6) === $application.currentPowerLineNode._backup_.data.latitude && +path[0].lng().toFixed(6) === $application.currentPowerLineNode._backup_.data.longitude) {
                $log.log("OUT link found");
                var new_path = [new google.maps.LatLng({ lat: temp_node.latitude.value, lng: temp_node.longitude.value }), new google.maps.LatLng({ lat: path[1].lat(), lng: path[1].lng() })];
                link.setPath(new google.maps.MVCArray(new_path));
            }
        });
        $application.currentPowerLineNode._backup_.setup();
        $log.log("backuped node = ", $application.currentPowerLineNode);
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

        //if ($scope.newConnectionNodeTypeId === 2) {
        //    if ($scope.newConnectionNode.anchorTypeId.value === 0)
        //        $scope.errors.push("Вы не выбрали тип крепления");
        //}
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



misc.controller("PowerLinesMapController", ["$log", "$scope", "$application", function ($log, $scope, $application) {
    $log.log("map controller");

    //if ($application.powerLinesMap === undefined) {
        $application.powerLinesMap = new google.maps.Map(document.getElementById('powerLinesMap'), {
            center: {lat: -34.397, lng: 150.644},
            zoom: 8
        });
    //}

}]);





/**
 * AddPylonTypeModalController
 * Контроллер модального окна добавления типа опоры
 */
misc.controller("AddPylonTypeModalController", ["$log", "$scope", "$misc", "$factory", "$modals", function ($log, $scope, $misc, $factory, $modals) {
    $scope.misc = $misc;
    $scope.newPylonType = $factory({ classes: ["PylonType", "Model", "Backup", "States"], base_class: "PylonType" });
    $scope.errors = [];

    $scope.validate = function () {
        $scope.errors.splice(0, $scope.errors.length);
        if ($scope.newPylonType.title.value === "")
            $scope.errors.push("Вы не указали наименование типа опоры");
        if ($scope.errors.length === 0 ) {
            $misc.addPylonType($scope.newPylonType, $scope.onSuccessAddPylonType);
        }
    };

    $scope.cancel = function () {
        $modals.close();
        $scope.newPylonType._model_.reset();
        $scope.errors.splice(0, $scope.errors.length);
    };

    $scope.onSuccessAddPylonType = function (data) {
        if (data !== undefined) {
            var tempPylonType = $factory({ classes: ["PylonType", "Model", "Backup", "States"], base_class: "PylonType" });
            tempPylonType._model_.fromJSON(data);
            tempPylonType._backup_.setup();
            $misc.pylonTypes.append(tempPylonType);
            $scope.newPylonType._model_.reset();
            $modals.close();
        }
    };
}]);





/**
 * EditPylonTypeModalController
 * Контроллер модального окна редактирования типа опоры
 */
misc.controller("EditPylonTypeModalController", ["$log", "$scope", "$misc", "$modals", "$factory", "$application", function ($log, $scope, $misc, $modals, $factory, $application) {
    $scope.misc = $misc;
    $scope.app = $application;
    $scope.errors = [];

    $scope.validate = function () {
        $scope.errors.splice(0, $scope.errors.length);
        if ($application.equipment.currentPylonType.title.value === "")
            $scope.errors.push("Вы не указали наименование типа опоры");
        if ($scope.errors.length === 0) {
            $misc.editPylonType($application.equipment.currentPylonType, $scope.onSuccessEditPylonType);
        }
    };

    $scope.cancel = function () {
        $application.equipment.currentPylonType._backup_.restore();
        $application.equipment.currentPylonType._states_.changed(false);
        $scope.errors.splice(0, $scope.errors. length);
        $modals.close();
    };

    $scope.onSuccessEditPylonType = function (data) {
        if (data !== undefined) {
            $application.equipment.currentPylonType._backup_.setup();
            $application.equipment.currentPylonType._states_.changed(false);
            $modals.close();
        }
    };

}]);





/**
 * DeletePylonTypeModalController
 * Контроллер модального окна удаления типа опоры
 */
misc.controller("DeletePylonTypeModalController", ["$log", "$scope", "$misc", "$application", "$modals", function ($log, $scope, $misc, $application, $modals) {
    $scope.app = $application;

    $scope.delete = function () {
        $misc.deletePylonType($application.equipment.currentPylonType.id.value, $scope.onSuccessDeletePylonType);
    };

    $scope.cancel = function () {
        $modals.close();
    };

    $scope.onSuccessDeletePylonType = function (data) {
        if (data !== undefined && JSON.parse(data) === "success") {
            $misc.pylonTypes.delete("id", $application.equipment.currentPylonType.id.value);
            $application.equipment.currentPylonType = undefined;
            $modals.close();
        }
    };
}]);





/**
 * AddCableTypeModalController
 * Контроллер модального окна добавления типа кабеля
 */
misc.controller("AddCableTypeModalController", ["$log", "$scope", "$misc", "$factory", "$modals", function ($log, $scope, $misc, $factory, $modals) {
    $scope.misc = $misc;
    $scope.newCableType = $factory({ classes: ["CableType", "Model", "Backup", "States"], base_class: "CableType" });
    $scope.errors = [];

    $scope.validate = function () {
        $scope.errors.splice(0, $scope.errors.length);
        if ($scope.newCableType.title.value === "")
            $scope.errors.push("Вы не указали наименование типа кабеля");
        if ($scope.errors.length === 0 ) {
            $misc.addCableType($scope.newCableType, $scope.onSuccessAddCableType);
        }
    };

    $scope.cancel = function () {
        $modals.close();
        $scope.newCableType._model_.reset();
        $scope.errors.splice(0, $scope.errors.length);
    };

    $scope.onSuccessAddCableType = function (data) {
        if (data !== undefined) {
            var tempCableType = $factory({ classes: ["CableType", "Model", "Backup", "States"], base_class: "CableType" });
            tempCableType._model_.fromJSON(data);
            tempCableType._backup_.setup();
            $misc.cableTypes.append(tempCableType);
            $scope.newCableType._model_.reset();
            $modals.close();
        }
    };
}]);





/**
 * EditCableTypeModalController
 * Контроллер модального окна редактирования типа кабеля
 */
misc.controller("EditCableTypeModalController", ["$log", "$scope", "$misc", "$modals", "$factory", "$application", function ($log, $scope, $misc, $modals, $factory, $application) {
    $scope.misc = $misc;
    $scope.app = $application;
    $scope.errors = [];

    $scope.validate = function () {
        $scope.errors.splice(0, $scope.errors.length);
        if ($application.equipment.currentCableType.title.value === "")
            $scope.errors.push("Вы не указали наименование типа кабеля");
        if ($scope.errors.length === 0) {
            $misc.editCableType($application.equipment.currentCableType, $scope.onSuccessEditCableType);
        }
    };

    $scope.cancel = function () {
        $application.equipment.currentCableType._backup_.restore();
        $application.equipment.currentCableType._states_.changed(false);
        $scope.errors.splice(0, $scope.errors. length);
        $modals.close();
    };

    $scope.onSuccessEditCableType = function (data) {
        if (data !== undefined) {
            $application.equipment.currentCableType._backup_.setup();
            $application.equipment.currentCableType._states_.changed(false);
            $modals.close();
        }
    };

}]);





/**
 * DeleteCableTypeModalController
 * Контроллер модального окна удаления типа кабеля
 */
misc.controller("DeleteCableTypeModalController", ["$log", "$scope", "$misc", "$application", "$modals", function ($log, $scope, $misc, $application, $modals) {
    $scope.app = $application;

    $scope.delete = function () {
        $misc.deleteCableType($application.equipment.currentCableType.id.value, $scope.onSuccessDeleteCableType);
    };

    $scope.cancel = function () {
        $modals.close();
    };

    $scope.onSuccessDeleteCableType = function (data) {
        if (data !== undefined && JSON.parse(data) === "success") {
            $misc.cableTypes.delete("id", $application.equipment.currentCableType.id.value);
            $application.equipment.currentCableType = undefined;
            $modals.close();
        }
    };
}]);





/**
 * AddAnchorTypeModalController
 * Контроллер модального окна добавления типа крепления
 */
misc.controller("AddAnchorTypeModalController", ["$log", "$scope", "$misc", "$factory", "$modals", function ($log, $scope, $misc, $factory, $modals) {
    $scope.misc = $misc;
    $scope.newAnchorType = $factory({ classes: ["AnchorType", "Model", "Backup", "States"], base_class: "AnchorType" });
    $scope.errors = [];

    $scope.validate = function () {
        $scope.errors.splice(0, $scope.errors.length);
        if ($scope.newAnchorType.title.value === "")
            $scope.errors.push("Вы не указали наименование типа крепления");
        if ($scope.errors.length === 0 ) {
            $misc.addAnchorType($scope.newAnchorType, $scope.onSuccessAddAnchorType);
        }
    };

    $scope.cancel = function () {
        $modals.close();
        $scope.newAnchorType._model_.reset();
        $scope.errors.splice(0, $scope.errors.length);
    };

    $scope.onSuccessAddAnchorType = function (data) {
        if (data !== undefined) {
            var tempAnchorType = $factory({ classes: ["AnchorType", "Model", "Backup", "States"], base_class: "AnchorType" });
            tempAnchorType._model_.fromJSON(data);
            tempAnchorType._backup_.setup();
            $misc.anchorTypes.append(tempAnchorType);
            $scope.newAnchorType._model_.reset();
            $modals.close();
        }
    };
}]);





/**
 * EditAnchorTypeModalController
 * Контроллер модального окна редактирования типа крепления
 */
misc.controller("EditAnchorTypeModalController", ["$log", "$scope", "$misc", "$modals", "$factory", "$application", function ($log, $scope, $misc, $modals, $factory, $application) {
    $scope.misc = $misc;
    $scope.app = $application;
    $scope.errors = [];

    $scope.validate = function () {
        $scope.errors.splice(0, $scope.errors.length);
        if ($application.equipment.currentAnchorType.title.value === "")
            $scope.errors.push("Вы не указали наименование типа крепления");
        if ($scope.errors.length === 0) {
            $misc.editAnchorType($application.equipment.currentAnchorType, $scope.onSuccessEditAnchorType);
        }
    };

    $scope.cancel = function () {
        $application.equipment.currentAnchorType._backup_.restore();
        $application.equipment.currentAnchorType._states_.changed(false);
        $scope.errors.splice(0, $scope.errors. length);
        $modals.close();
    };

    $scope.onSuccessEditAnchorType = function (data) {
        if (data !== undefined) {
            $application.equipment.currentAnchorType._backup_.setup();
            $application.equipment.currentAnchorType._states_.changed(false);
            $modals.close();
        }
    };

}]);





/**
 * DeleteAnchorTypeModalController
 * Контроллер модального окна удаления типа крепления
 */
misc.controller("DeleteAnchorTypeModalController", ["$log", "$scope", "$misc", "$application", "$modals", function ($log, $scope, $misc, $application, $modals) {
    $scope.app = $application;

    $scope.delete = function () {
        $misc.deleteAnchorType($application.equipment.currentAnchorType.id.value, $scope.onSuccessDeleteAnchorType);
    };

    $scope.cancel = function () {
        $modals.close();
    };

    $scope.onSuccessDeleteAnchorType = function (data) {
        if (data !== undefined && JSON.parse(data) === "success") {
            $misc.anchorTypes.delete("id", $application.equipment.currentAnchorType.id.value);
            $application.equipment.currentAnchorType = undefined;
            $modals.close();
        }
    };
}]);






/**
 * AddVibroTypeModalController
 * Контроллер модального окна добавления типа виброгасителя
 */
misc.controller("AddVibroTypeModalController", ["$log", "$scope", "$misc", "$factory", "$modals", function ($log, $scope, $misc, $factory, $modals) {
    $scope.misc = $misc;
    $scope.newVibroType = $factory({ classes: ["VibroType", "Model", "Backup", "States"], base_class: "VibroType" });
    $scope.errors = [];

    $scope.validate = function () {
        $scope.errors.splice(0, $scope.errors.length);
        if ($scope.newVibroType.title.value === "")
            $scope.errors.push("Вы не указали наименование типа виброгасителя");
        if ($scope.errors.length === 0 ) {
            $misc.addVibroType($scope.newVibroType, $scope.onSuccessAddVibroType);
        }
    };

    $scope.cancel = function () {
        $modals.close();
        $scope.newVibroType._model_.reset();
        $scope.errors.splice(0, $scope.errors.length);
    };

    $scope.onSuccessAddVibroType = function (data) {
        if (data !== undefined) {
            var tempVibroType = $factory({ classes: ["VibroType", "Model", "Backup", "States"], base_class: "VibroType" });
            tempVibroType._model_.fromJSON(data);
            tempVibroType._backup_.setup();
            $misc.vibroTypes.append(tempVibroType);
            $scope.newVibroType._model_.reset();
            $modals.close();
        }
    };
}]);





/**
 * EditVibroTypeModalController
 * Контроллер модального окна редактирования типа виброгасителя
 */
misc.controller("EditVibroTypeModalController", ["$log", "$scope", "$misc", "$modals", "$factory", "$application", function ($log, $scope, $misc, $modals, $factory, $application) {
    $scope.misc = $misc;
    $scope.app = $application;
    $scope.errors = [];

    $scope.validate = function () {
        $scope.errors.splice(0, $scope.errors.length);
        if ($application.equipment.currentVibroType.title.value === "")
            $scope.errors.push("Вы не указали наименование типа виброгасителя");
        if ($scope.errors.length === 0) {
            $misc.editVibroType($application.equipment.currentVibroType, $scope.onSuccessEditVibroType);
        }
    };

    $scope.cancel = function () {
        $application.equipment.currentVibroType._backup_.restore();
        $application.equipment.currentVibroType._states_.changed(false);
        $scope.errors.splice(0, $scope.errors. length);
        $modals.close();
    };

    $scope.onSuccessEditVibroType = function (data) {
        if (data !== undefined) {
            $application.equipment.currentVibroType._backup_.setup();
            $application.equipment.currentVibroType._states_.changed(false);
            $modals.close();
        }
    };

}]);





/**
 * DeleteVibroTypeModalController
 * Контроллер модального окна удаления типа виброгасителя
 */
misc.controller("DeleteVibroTypeModalController", ["$log", "$scope", "$misc", "$application", "$modals", function ($log, $scope, $misc, $application, $modals) {
    $scope.app = $application;

    $scope.delete = function () {
        $misc.deleteVibroType($application.equipment.currentVibroType.id.value, $scope.onSuccessDeleteVibroType);
    };

    $scope.cancel = function () {
        $modals.close();
    };

    $scope.onSuccessDeleteVibroType = function (data) {
        if (data !== undefined && JSON.parse(data) === "success") {
            $misc.vibroTypes.delete("id", $application.equipment.currentVibroType.id.value);
            $application.equipment.currentVibroType = undefined;
            $modals.close();
        }
    };
}]);
