"use strict";


var titles = angular.module("gears.app.titles",[])
    .config(function ($provide) {

        /**
         * $titles
         * Сервис, одержащий функционал для работы с титулами
         */
        $provide.factory("$titles", ["$log", "$http", "$factory", function ($log, $http, $factory) {
            var titles = {};


            /**
             * Наборы свойст и методов, описывающих модели данных
             */
            titles.classes = {
                /**
                 * Title
                 * Набор свойств, описывающих титул
                 */
                Title: {
                    id: new Field({ source: "ID", value: 0, default_value: 0 }),
                    title: new Field({ source: "TITUL_NAME", value: "", default_value: "", backupable: true, required: true }),
                    startPointId: new Field({ source: "START_POINT_ID", value: 0, default_value: 0, backupable: true, required: true }),
                    startNodeTypeId: new Field({ source: "START_OBJECT_TYPE_ID", value: 0, default_value: 0, backupable: true, required: true }),
                    startNodeId: new Field({ source: "START_OBJECT_ID", value: 0, default_value: 0, backupable: true, required: true }),
                    endPointId: new Field({ source: "END_POINT_ID", value: 0, default_value: 0, backupable: true, required: true }),
                    endNodeTypeId: new Field({ source: "END_OBJECT_TYPE_ID", value: 0, default_value: 0, backupable: true, required: true }),
                    endNodeId: new Field({ source: "END_OBJECT_ID", value: 0, default_value: 0, backupable: true, required: true }),
                    description: new Field({ source: "NAME_EXTRA", value: "", default_value: "", backupable: true }),
                    length: new Field({ source: "LENGTH", value: 0, default_value: 0, backupable: true })
                 },

                /**
                 * TitlePart
                 * Набор свойст, описывающих участок титула
                 */
                TitlePart: {
                    id: new Field({ source: "ID", value: 0, default_value: 0 }),
                    tituleId: new Field({ source: "TITUL_ID", value: 0, default_value: 0, backupable: true, required: true }),
                    title: new Field({ source: "TITLE", value: "", default_value: "", backupable: true, required: true }),
                    startPointId: new Field({ source: "START_POINT_ID", value: 0, default_value: 0, backupable: true }),
                    startObjectTypeId: new Field({ source: "START_OBJECT_TYPE_ID", value: 0, default_value: 0, backupable: true, required: true }),
                    startObjectId: new Field({ source: "START_OBJECT_ID", value: 0, default_value: 0, backupable: true, required: true }),
                    endPointId: new Field({ source: "END_POINT_ID", value: 0, default_value: 0, backupable: true }),
                    endObjectTypeId: new Field({ source: "END_OBJECT_TYPE_ID", value: 0, default_value: 0, backupable: true, required: true }),
                    endObjectId: new Field({ source: "END_OBJECT_ID", value: 0, default_value: 0, backupable: true, required: true }),
                    cableTypeId: new Field({ source: "CABLE_TYPE_ID", value: 0, default_value: 0, backupable: true, required: true }),
                    length: new Field({ source: "LENGTH", value: 0, default_value: 0, backupable: true })
                },

                /**
                 * TitleNodes
                 * Набор свойст и методов, описывающих иерархию узлов, входящих в титул
                 */
                TitleNodes: {
                    nodes: [],
                    path: {
                        __instance__: "",
                        nodes: [],

                        append: function (node) {
                            if (node !== undefined) {
                                if (this.__instance__.path.nodes.length > 0) {
                                    node.previousNodeId = this.__instance__.path.nodes[this.__instance__.path.nodes.length - 1].id.value;
                                    this.__instance__.path.nodes[this.__instance__.path.nodes.length - 1].nextNodeId = node.id.value;
                                } else
                                    node.previousNodeId = -1;

                                node.nextNodeId = -1;
                                node.haveBranches = node.branchesCount.value > 0 ? true : false;
                                node.collapsed = true;

                                this.__instance__.path.nodes.push(node);
                                this.__instance__.nodes.push(node);
                            }
                        }
                    },

                    /**
                     * Возвращает узел с заданным идентификатором
                     * @param nodeId {number} - Идентификатор узла
                     * @returns {boolean / object} - Возвращает искомый узел, в противном случае - false
                     */
                    getNode: function (nodeId) {
                        var result = false;
                        if (nodeId !== undefined) {
                            var length = this.nodes.length;
                            for (var i = 0; i < length; i++) {
                                if (this.nodes[i].id.value === nodeId)
                                    result = this.nodes[i];
                            }
                        }
                        return result;
                    },

                    /**
                     * Возвращает массив ответвлений узла с заданныи идентификатором
                     * @param nodeId {number} - Идентификатор узла
                     * @returns {boolean / array} - Возвращает массив ответвлений узла, в противном случае - false
                     */
                    getBranches: function (nodeId) {
                        var result = false;
                        if (nodeId !== undefined) {
                            var length = this.nodes.length;
                            for (var i = 0; i < length; i++) {
                                if (this.nodes[i].branches !== undefined)
                                    result = this.nodes[i].branches;
                            }
                        }
                        return result;
                    }
                }


            };


            /**
             * Переменные сервиса
             */
            //titles.titules = $factory.make({ classes: ["Collection"], base_class: "Collection" });
            titles.titles = $factory({ classes: ["Collection", "States"], base_class: "Collection" });
            titles.parts = $factory({ classes: ["Collection", "States"], base_class: "Collection" });


            /**
             * Получает список всех титулов и помещает их в коллекцию
             */
            titles.titlesQuery = function () {
                titles.titles._states_.loaded(false);
                $http.post("serverside/controllers/titules.php", {action: "query"})
                    .success(function (data) {
                        if (data !== undefined) {
                            angular.forEach(data, function (title_data, key) {
                                var temp_title = $factory({ classes: ["Model", "Title", "Backup", "States"], base_class: "Title" });
                                temp_title._model_.fromJSON(title_data);
                                titles.titles.append(temp_title);
                                temp_title._backup_.setup();
                                $log.log("f = ", temp_title);
                            });
                            titles.titles._states_.loaded(true);
                        }
                        $log.log(titles.titles);
                    }
                );
            };


            /**
             * Получает список частей титулов всех титулов
             */
            titles.partsQuery = function () {
                $http.post("serverside/controllers/titule-parts.php", {action: "query"})
                    .success(function (data) {
                        if (data !== undefined) {
                            angular.forEach(data, function (title_part) {
                                var part = $factory.make({ classes: ["TitlePart", "Model", "Backup", "States"], base_class: "TitlePart" });
                                part._model_.fromJSON(title_part);
                                part._backup_.setup();
                                titles.parts.append(part);
                            });
                        }
                    }
                );
            };


            /**
             * Отправляет данные нового титула на сервер и добавляет его в коллекцию
             * @param title
             */
            titles.add = function (title) {
                $http.post("")
                    .success(function (data) {
                        if (data !== undefined) {
                            var added_title = $factory.make({ classes: ["Title", "Model", "Backup", "States"], base_class: "Title" });
                            added_title._model_.fromJSON(data);
                            added_title._backup_.setup();
                            titles.titles.append(added_title);
                        }
                    }
                );
            };


            return titles;
        }]);
    })
    .run(function ($modules, $titles, $log) {
        $modules.load($titles);
        $titles.titlesQuery();
        //$log.log($titules.titules);
        //$titules.titules.display();
    });