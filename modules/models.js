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
        }])
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
