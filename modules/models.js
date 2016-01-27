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
    })
    .run(function ($modules, $models, $log) {
        $modules.load($models);



        var user = $models.add({ title: "User", controller: "test.php" })
            ._field({ title: "id", source: "ID", value: 0, default_value: 1, backupable: true })
            ._field({ title: "title", source: "TITLE", value: "", default_value: "", backupable: true, required: true })
            ._action({ title: "Add" })
            ._action({ title: "GetById", onComplete: function () { console.log("getById callback"); } });
        user.GetById({ id: 15 });

        $log.log("mdl = ", user);
    });




test.directive("columns", ["$log", function ($log) {
    return {
        restrict: "E",
        transclude: true,
        template: "<div class='gears-columns'>" +
                      "<div class='gears-columns-row' ng-transclude></div>" +
                  "</div>",
        replace: true,
        controller: function ($scope) {
            var columns = $scope.columns = [];

            this.add = function (column) {
                column.columnId = columns.length + 1;
                column.isMaximized = false;
                column.isMinimized = false;
                columns.push(column);
                $log.info(columns);
            };

            this.maximize = function (id) {
                if (id !== undefined) {
                    var length = columns.length;
                    for (var i = 0; i < length; i++) {
                        if (columns[i].columnId === id) {
                            columns[i].currentWidth = 100;
                            columns[i].isMaximized = true;
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
                }
            };

        },
        link: function (scope, element, attrs, ctrl) {
            $log.info("columns directive");
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
                      "<div class='right'><button ng-repeat='control in controls' class='{{ control.controlClass }}'>{{ control.caption }}</button></div>" +
                      "</div>" +
                      "<div class='column-content' ng-show='isMinimized === false' ng-transclude></div>" +
                  "</div>",
        replace: true,
        scope: {
            caption: "@",
            width: "@",
            maximize: "@"
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


            ctrl.add(scope);
            if (scope.caption !== undefined && scope.caption !== "")
                scope.showCaption = true;
            if (scope.maximize !== undefined && scope.maximize === "1")
                scope.showMaximizeButton = true;

            scope.max = function () {
                ctrl.maximize(scope.columnId);
            };

            scope.min = function () {
                ctrl.restore();
            };
        }
    }
}]);


test.directive("columnControl", [function () {
    return {
        restrict: "E",
        require: "^column",
        transclude: true,
        scope: {
            caption: "@",
            action: "=",
            controlClass: "@",
            icon: "@"
        },
        link: function (scope, element, attrs, ctrl) {
            ctrl.addControl(scope);
        }
    }
}]);