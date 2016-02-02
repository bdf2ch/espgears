"use strict";


function ModelField (parameters) {
    this.title = "";
    this.value = undefined;
    this.default_value = undefined;
    this.source = "";
    this.editable = true;
    this.backupable = false;
    this.required = false;

    if (parameters !== undefined) {
        for (var param in parameters) {
            if (this.hasOwnProperty(param))
                this[param] = parameters[param];
        }
    }
};



function Model (parameters) {
    var target = this;
    this._title = "";
    this._class = "";
    this._controller = undefined;
    this._callbacks = {};

    /* Публичные переменные и методы */
    this._field = function (parameters) {
        if (parameters !== undefined) {
            var field = new ModelField(parameters);
            this[field.title] = field;
            console.log("field returned = ", this);
            return this;
        } else {
            $log.error("$models: Не задан параметр при добавлении поля к модели");
            return false;
        }
    };

    if (parameters !== undefined) {
        for (var param in parameters) {
            switch (param) {
                case "controller":
                    if (parameters[param] !== "")
                        this._controller = parameters["controller"];
                    break;
                case "title":
                    if (parameters[param] !== "")
                        this._title = parameters["title"];
            }
        }
    }
};






var test = angular.module("gears.test", [])
    .config(function ($provide) {


        $provide.factory("$models", ["$log", "$http", function ($log, $http) {
            var service = {};

            /* Приватные переменные сервиса */
            var classes = {};

            /**
             * Добавляет модель данных
             * @param parameters {Object} - параметры инициализации создаваемой модели данных
             * @returns {Model} - Возвращает созданную модель данных
             */
            service.add = function (parameters) {
                if (parameters !== undefined) {
                    var temp_model = new Model(parameters);
                    classes[temp_model._title] = temp_model;
                    $log.log("classes = ", classes);
                    temp_model._action = function (parameters) {
                        if (parameters !== undefined) {
                            if (parameters["title"] !== undefined) {
                                if (parameters["onComplete"] !== undefined) {
                                    if (parameters["onComplete"] instanceof Function) {
                                        temp_model._callbacks["onComplete" + parameters["title"]] = parameters["onComplete"];
                                    }
                                }
                                if (parameters["title"] !== "") {
                                    temp_model[parameters["title"]] = function (params) {
                                        $http.post(temp_model._controller, params)
                                            .success(function (data) {
                                                if (temp_model._callbacks.indexOf("onComplete" + parameters["title"]) !== -1)
                                                    temp_model._callbacks["onComplete" + parameters["title"]](data);

                                            });
                                    };
                                }
                            }
                            return temp_model;
                        }
                    };
                    return temp_model;
                }
            };

            service.create = function () {};

            return service;
        }]);



        $provide.factory("$columns", ["$log", function ($log) {
            var service = {};

            var items = []; // Массив с контейнерами колонок


            /**
             * Регистрирует контейнер колонок
             * @param columns {} - Контейнер колонок
             * @returns {boolean} - Возвращает true в случае успеха, false - в противном случае
             */
            service.register = function (columns) {
                if (columns !== undefined) {
                    items.push(columns);
                    return true;
                } else {
                    $log.error("$columns: Не указаны параметры при регистрации контейнера колонок");
                    return false;
                }
            };


            /**
             * Разварачивает колонку на всю ширину контейера
             * @param columnsId {String} - Идентификатор контейнера колонок
             * @param columnId {String} - Идентификатор колонки
             * @returns {boolean} - Возвращает true в случае успеха, иначе - false
             */
            service.maximize = function (columnsId, columnId) {
                if (columnsId !== undefined && columnId !== undefined) {
                    var length = items.length;
                    var columns_index = -1;
                    var column_index = -1;
                    for (var i = 0; i < length; i++) {
                        if (items[i].columnsId === columnsId) {
                            columns_index = i;
                            var columns_length = items[i].columns.length;
                            for (var y = 0; y < columns_length; y++) {
                                if (items[i].columns[y].columnId === columnId) {
                                    column_index = y;
                                }
                            }
                        }
                    }
                    if (columns_index != -1) {
                        if (column_index != -1) {
                            for (var x = 0; x < columns_length; x ++) {
                                var column = items[columns_index].columns[x];
                                if (column.columnId === columnId) {
                                    column.isMaximized = true;
                                    column.isMinimized = false;
                                    column.currentWidth = 100;
                                } else {
                                    column.isMaximized = false;
                                    column.isMinimized = true;
                                    column.currentWidth = 0;
                                }
                            }
                        }  else {
                            $log.error("$columns: Колонка с идентификатором '" + columnId + "' не найдена");
                            return false;
                        }
                    } else {
                        $log.error("$models: Контейнер колонок с идентификатором '" + columnsId + "' не найден");
                        return false;
                    }
                } else {
                    $log.error("$columns: Не указаны параметры при разворачивании колонки");
                    return false;
                }
            };


            /**
             * Восстанавливает первоначальную ширину колонок
             * @param columnsId {String} - Идентификатор контейнера колонок
             * @returns {boolean} - Возвращает true в случае успеха, false - в противном случае
             */
            service.restore = function (columnsId) {
                if (columnsId !== undefined) {
                    var length = items.length;
                    var container_found = false;
                    for (var i = 0; i < length; i ++) {
                        if (items[i].columnsId === columnsId) {
                            container_found = true;
                            var columns_length = items[i].columns.length;
                            for (var x = 0; x < columns_length; x++) {
                                var column = items[i].columns[x];
                                column.isMaximized = false;
                                column.isMinimized = false;
                                column.currentWidth = column.width;
                            }
                        }
                    }
                    if (container_found === false) {
                        $log.error("$columns: Контейнер колонок с идентификатором '" + columnsId + "' не найден");
                        return false;
                    }
                } else {
                    $log.error("$columns: Не заданы параметры при восстановлении ширины колонок");
                    return false;
                }
            };

            return service;
        }]);
    })
    .run(function ($modules, $models, $log) {
        $modules.load($models);
        $log.log("TEST MODULE LOADED");


        //var user = $models.add({ title: "User", controller: "test.php" })
        //    ._field({ title: "id", source: "ID", value: 0, default_value: 1, backupable: true })
        //    ._field({ title: "title", source: "TITLE", value: "", default_value: "", backupable: true, required: true })
        //    ._action({ title: "Add" })
        //    ._action({ title: "GetById", onComplete: function () { console.log("getById callback"); } });
        //user.GetById({ id: 15 });

        //$log.log("mdl = ", user);
    });








/********** COLUMNS **********/

test.directive("columns", ["$log", "$columns", function ($log, $columns) {
    return {
        restrict: "E",
        transclude: true,
        scope: {
            columnsId: "@"
        },
        template:
            "<div class='gears-columns'>" +
                "<div class='gears-columns-row' ng-transclude></div>" +
            "</div>",
        replace: true,
        controller: function ($scope) {
            var columns = $scope.columns = [];

            this.add = function (column) {
                column.isMaximized = false;
                column.isMinimized = false;
                columns.push(column);
            };

            this.maximize = function (id) {
                if (id !== undefined) {
                    var length = columns.length;
                    for (var i = 0; i < length; i++) {
                        if (columns[i].columnId === id) {
                            columns[i].currentWidth = 100;
                            columns[i].isMaximized = true;
                            if (columns[i].onMaximize !== undefined && typeof columns[i].onMaximize === "function")
                                columns[i].onMaximize();
                        } else {
                            columns[i].currentWidth = 0;
                            columns[i].isMinimized = true;
                        }
                    }
                }
            };

            this.restore = function () {
                var length = columns.length;
                for (var i = 0; i < length; i ++) {
                    columns[i].currentWidth = columns[i].width;
                    columns[i].isMaximized = false;
                    columns[i].isMinimized = false;
                    if (columns[i].onMinimize !== undefined && typeof columns[i].onMinimize === "function")
                        columns[i].onMinimize();
                }
            };

            $columns.register($scope);

        }
    }
}]);




test.directive("column", ["$log", function ($log) {
    return {
        restrict: "E",
        require: "^columns",
        transclude: true,
        template: "<div class='gears-columns-column' style='width: {{currentWidth}}%;'>" +
                      "<div class='column-header' ng-show='isMinimized === false'>" +
                      "<div class='left'>" +
                          "<span class='header-caption' ng-show='showCaption === true'>{{ caption }}</span>" +
                          "<button class='service-button' ng-show='showMaximizeButton === true && isMaximized === false' ng-click='max()' title='Развернуть колонку'>&harr;</button>" +
                          "<button class='service-button' ng-show='isMaximized' ng-click='min()' title='Свернуть колонку'>&rarr;</button>" +
                      "</div>" +
                      "<div class='right'><button ng-repeat='control in controls' ng-show='control.isVisible' class='{{ control.controlClass }}' ng-click='control.action()' title='{{ control.title }}'>{{ control.caption }}</button></div>" +
                      "</div>" +
                      "<div class='column-content' ng-show='isMinimized === false' ng-transclude></div>" +
                  "</div>",
        replace: true,
        scope: {
            columnId: "@",
            caption: "@",
            width: "@",
            maximizable: "@",
            onMaximize: "&",
            onMinimize: "&"
        },
        controller: function ($scope) {
            var controls = $scope.controls = [];

            this.addControl = function (control) {
                if (control !== undefined) {
                    controls.push(control);
                }
            };
        },
        link: function (scope, element, attrs, ctrl) {
            var showCaption = scope.showCaption = false;
            var showMaximizeButton = scope.showMaximizeButton = false;
            var currentWidth = scope.currentWidth = parseInt(scope.width);



            if (scope.caption !== undefined && scope.caption !== "")
                scope.showCaption = true;
            if (scope.maximizable !== undefined && scope.maximizable === "1")
                scope.showMaximizeButton = true;
            else {
                scope.showMaximizeButton = false;
            }

            scope.max = function () {
                ctrl.maximize(scope.columnId);
            };

            scope.min = function () {
                ctrl.restore();
            };

            ctrl.add(scope);
        }
    }
}]);



test.directive("columnControl", ["$log", function ($log) {
    return {
        restrict: "E",
        require: "^column",
        transclude: true,
        scope: {
            caption: "@",
            action: "&",
            controlClass: "@",
            icon: "@",
            title: "@",
            ngShow: "="
        },
        link: function (scope, element, attrs, ctrl) {
            //scope.ngShow = scope.ngShow === undefined ? true : scope.ngShow;
            scope.isVisible = scope.ngShow !== undefined ? scope.ngShow : true;

            scope.$watch("ngShow", function (value) {
                if (value !== undefined)
                    scope.isVisible = value;
            });

            //$log.info("visible = ", scope.visible);
            ctrl.addControl(scope);
            //$log.info("ngShow = ", scope.ngShow);
        }
    }
}]);




/**
 * GRID
 * Таблица данных
 */
test.directive("grid", ["$log", "$filter", function ($log, $filter) {
    return {
        restrict: "E",
        scope: {
            source: "=",
            fields: "@",
            captions: "@",
            sortable: "@"
        },
        template: "<table class='grid'>" +
                      "<thead ng-if='fieldCaptions.length > 0'>" +
                          "<th ng-repeat='caption in fieldCaptions'><span class='grid-caption' ng-click='select($index)'>{{ caption }}</span>" +
                              "<span class='service-button' ng-if='isSortable === true' ng-show='sorting[$index] === true && descending[$index] === false' ng-click='sort($index)' title='По убыванию'>&darr;</span>" +
                              "<span class='service-button' ng-if='isSortable === true' ng-show='sorting[$index] === true && descending[$index] === true' ng-click='sort($index)' title='По возрастанию'>&uarr;</span>" +
                          "</th>" +
                      "</thead>" +
                      "<tbody>" +
                          "<tr ng-repeat='row in source' ng-init='rowId = $index'>" +
                              "<td ng-repeat='field in dataFields' ng-init='val = check(rowId, field)'><span ng-show='isBool(val) === false'>{{ val }}</span>" +
                                  "<input type='checkbox' ng-if='isBool(val) === true' ng-checked='val' disabled/>" +
                              "</td>" +
                          "</tr>" +
                      "</tbody>" +
                  "</table>",
        replace: true,
        link: function (scope, element, attrs, ctrl) {
            var dataFields = scope.dataFields = [];
            var fieldCaptions = scope.fieldCaptions = [];
            var isSortable = scope.isSortable = false;
            var sorting = scope.sorting = [];
            var descending = scope.descending = [];

            scope.isBool = function (value) {
                if (value !== undefined) {
                    var result = typeof value === "boolean" ? true : false;
                    return result;
                }
            };

            scope.check = function (index, field) {
                if (index !== undefined && field !== undefined) {
                    if (scope.source[index][field] !== undefined) {
                        var result = scope.source[index][field].constructor === Field ? scope.source[index][field].value : scope.source[index][field];
                        return result;
                    } else
                        return "";
                }
            };

            scope.select = function (index) {
                if (index !== undefined) {
                    for (var i = 0; i < scope.sorting.length; i++) {
                        scope.sorting[i] = i === index ? true : false;
                    }
                }
            };

            scope.sort = function (index) {
                if (index !== undefined) {
                    var condition = scope.dataFields[index];
                    condition = scope.descending[index] === true ? "+" + condition : "-" + condition;
                    for (var i = 0; i < scope.source.length; i++) {
                        if (scope.source[i][scope.dataFields[index]] !== undefined) {
                            if (scope.source[i][scope.dataFields[index]].constructor === Field)
                                condition += ".value";
                            break;
                        }
                    }
                    var orderBy = $filter('orderBy');
                    scope.source = orderBy(scope.source, condition);
                    scope.descending[index] = !scope.descending[index];
                }
            };


            if (scope.source !== undefined && scope.source !== "") {
                if (scope.fields !== undefined && scope.fields !== "") {
                    scope.dataFields = scope.fields.replace(/ /g, "").split(";");
                    for (var i = 0; i < scope.dataFields.length; i++) {
                        scope.sorting[i] = i === 0 ? true : false;
                        scope.descending[i] = true;
                    }
                    if (scope.captions !== undefined && scope.captions !== "")
                        scope.fieldCaptions = scope.captions.split(";");
                    if (scope.sortable !== undefined) {
                        if (!isNaN(scope.sortable))
                            scope.isSortable = parseInt(scope.sortable) === 1 ? true : false;
                        else
                            $log.error("gears.ui.grid: Значение атрибута 'sortable' должно быть целым число (0 или 1)");
                    }
                }
            } else
                $log.error("gears.ui.grid: Не задан источник данных - атрибут 'source'");


        }
    }
}]);




test.directive("tabz", ["$log", function ($log) {
    return {
        restrict: "E",
        scope: {
            tabsPosition: "@"
        },
        transclude: true,
        template: "<div class='tabz'>" +
                      "<div class='tabs-container top' ng-if='topPosition === true'><ul ng-transclude></ul></div>" +
                      "<div class='tab-content' ng-class='{ \"top\": topPosition === true, \"bottom\": topPosition === false}' ng-include='currentTemplateUrl'></div>" +
                      "<div class='tabs-container bottom' ng-if='topPosition === false'><ul ng-transclude></ul></div>" +
                  "</div>",
        replace: true,
        controller: function ($scope, $element) {
            //$log.info("tabz");
            $scope.tabs = [];
            this.topPosition = $scope.topPosition = true;
            $scope.currentTemplateUrl = "";

            if ($scope.tabsPosition !== undefined && $scope.tabsPosition !== "") {
                switch ($scope.tabsPosition) {
                    case "top":
                        $scope.topPosition = true;
                        break;
                    case "bottom":
                        $scope.topPosition = false;
                        break;
                    default:
                        $scope.topPosition = true;
                        break;
                }
            }

            this.add = function (tab) {
                if (tab !== undefined) {
                    tab.tabId = $scope.tabs.length;
                    $scope.tabs.push(tab);
                    if ($scope.tabs[0].active === false) {
                        $scope.tabs[0].active = true;
                        $scope.currentTemplateUrl = $scope.tabs[0].templateUrl;
                    }
                    //$log.info($scope.tabs);
                }
            };

            this.select = function (id) {
                if (id !== undefined) {
                    var length = $scope.tabs.length;
                    for (var i = 0; i < length; i++) {
                        if ($scope.tabs[i].tabId === id) {
                            $scope.tabs[i].active = true;
                            $scope.currentTemplateUrl = $scope.tabs[i].templateUrl;
                        } else {
                            $scope.tabs[i].active = false;
                        }
                    }
                }
            };
        }
    }
}]);





/********* TABS ********/
test.directive("tab", ["$log", function ($log) {
    return {
        restrict: "E",
        require: "^tabz",
        transclude: true,
        scope: {
            caption: "@",
            templateUrl: "@",
            title: "@"
        },
        template: "<li ng-class='{ \"active\": active === true, \"top\": topPosition === true, \"bottom\": topPosition === false }' ng-click='select()' title='{{ title }}'>{{ caption }}<div ng-transclude></div></li>",
        link: function (scope, element, attrs, ctrl) {
            //$log.info("tab");
            scope.active = false;
            scope.topPosition = ctrl.topPosition;
            ctrl.add(scope);


            //$log.info(angular.element(element).innerHTML);

            if (scope.caption !== undefined && scope.caption !== "") {

            }

            if (scope.templateUrl !== undefined && scope.templateUrl !== "") {

            }

            scope.select = function () {
                ctrl.select(scope.tabId);
            }
        }
    }
}]);