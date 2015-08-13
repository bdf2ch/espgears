"use strict";


var nodes = angular.module("gears.app.nodes", [])
    .config(function ($provide) {

        /**
         * $nodes
         * ������, ���������� ���������� ��� ������ � ������
         */
        $provide.factory("$nodes", ["$log", "$http", "$factory", "$menu", function ($log, $http, $factory, $menu) {
            var nodes = {};


            /**
             * ������ ������ � �������, ����������� ������ ������
             */
            nodes.classes = {
                /**
                 * NodeType
                 * ����� �������, ����������� ��� ����
                 */
                NodeType: {
                    id: new Field({ source: "ID", value: 0 }),
                    title: new Field({ source: "TITLE", value: "" }),
                    isBasicNode: new Field({ source: "IS_BASE_OBJECT", value: false }),

                    _init_: function () {
                        this.isBasicNode.value = this.isBasicNode.value === 1 ? true : false;
                    }
                },

                /**
                 * UnknownNode
                 * ����� ������, ����������� ����������������� ����
                 */
                UnknownNode: {
                    id: new Field({ source: "NODE_ID", value: 0, default_value: 0 }),
                    pointId: new Field({ source: "POINT_ID", value: 0, default_value: 0, backupable: true, required: true }),
                    titleId: new Field({ source: "TITULE_ID", value: 0, default_value: 0, backupable: true, required: true }),
                    titlePartId: new Field({ source: "TITULE_PART_ID", value: 0, default_value: 0, backupable: true, required: true }),
                    branchesCount: new Field({ source: "OUT_PATHS", value: 0, default_value: 0 })
                },

                /**
                 * Pylon
                 * ����� ������, ����������� �����
                 */
                Pylon: {
                    id: new Field({ source: "NODE_ID", value: 0, default_value: 0 }),
                    nodeTypeId: new Field({ source: "OBJECT_TYPE_ID", value: 0, default_value: 0, backupable: true, required: true }),
                    pointId: new Field({ source: "POINT_ID", value: 0, default_value: 0, backupable: true, required: true }),
                    pylonTypeId: new Field({ source: "PYLON_TYPE_ID", value: 0, default_value: 0, backupable: true, required: true }),
                    pylonSchemeTypeId: new Field({ source: "PYLON_SCHEME_TYPE_ID", value: 0, default_value: 0, backupable: true }),
                    powerLineId: new Field({ source: "POWER_LINE_ID", value: 0, default_value: 0, backupable: true, required: true }),
                    number: new Field({ source: "PYLON_NUMBER", value: 0, default_value: 0, backupable: true, required: true }),
                    branchesCount: new Field({ source: "OUT_PATHS", value: 0, default_value: 0 })
                },

                /**
                 * PowerStation
                 * ����� �������, ����������� ��������������
                 */
                PowerStation: {
                    id: new Field({ source: "OBJECT_ID", value: 0, default_value: 0 }),
                    title: new Field({ source: "TITLE", value: "", default_value: "", backupable: true, required: true }),
                    voltage: new Field({ source: "VOLTAGE", value: 0, default_value: 0, backupable: true, required: true })
                }
            };


            /**
             * �������� ������� ����
             */
            //nodes.menu = $menu.set({
            //    id: 1,
            //    title: "Nodes Menu Item"
            //});


            nodes.types = $factory({ classes: ["Collection", "States"], base_class: "Collection" });


            nodes.getNodeTypes = function () {
                $http.post("serverside/controllers/nodes.php", { action: "getNodeTypes" })
                    .success(function (data) {
                        if (data !== undefined) {
                            if (data["error_code"] !== undefined) {
                                var db_error = $factory({ classes: ["DBError"], base_class: "DBError" });
                                db_error.init(data);
                                db_error.display();
                            } else {
                                angular.forEach(data, function (type) {
                                    var temp_type = $factory({ classes: ["NodeType", "Model"], base_class: "NodeType" });
                                    temp_type._model_.fromJSON(type);
                                    nodes.types.append(temp_type);
                                });
                            }
                        }
                        $log.log("types = ", nodes.types.items);
                    }
                );
            };

            return nodes;
        }]);
    })
    .run(function ($modules, $nodes) {
        $modules.load($nodes);
        $nodes.getNodeTypes();
    }
);