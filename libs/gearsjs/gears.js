"use strict";





/**
 * Класс поля модели данных
 * @param parameters {Object} - Параметры инициализации создаваемого объекта
 * @constructor
 */
function Field (parameters) {
    this.source = "";           // Наименование поля-источника данных в БД
    this.value = undefined;     // Значение поля
    this.default_value = "";    // Значение поля по умолчанию
    this.backupable = false;    // Флаг, требуется ли резервировать значение поля
    this.required = false;      // Флаг, является ли поле обязательным для заполнения
    this.title = "";
    this.isValid = false;

    if (parameters !== undefined) {
        for (var param in parameters) {
            if (this.hasOwnProperty(param)) {
                this[param] = parameters[param];
            }
        }
    }
};





/********************
 * Модуль core
 * Содержит базовые сервисы системы
 ********************/
var gears = angular.module("gears", [])
    .config(function ($provide, $routeProvider, $filterProvider) {



        /********************
         * $modules
         * Сервис, осуществляющий загрузку модулей системы
         ********************/
        $provide.factory("$modules", ["$log", "$classes", "$factory", "$menu", function ($log, $classes, $factory, $menu) {
            var modules = {};

            /**
             * Переменные сервиса
             */
            modules.items = $factory({ classes: ["Collection"], base_class: "Collection" });


            /**
             * Звгружает модуль/сервис в систему
             * @param module - Наименование модуля/сервиса, который требуется загрузить в систему
             * @returns {boolean} - Возвращает true в случае успешной загрузки модуля, false - в обратном случае
             */
            modules.load = function (module) {
                var result = false;
                if (module !== undefined) {
                    if (module.classes !== undefined) {
                        for (var class_ in module.classes) {
                            $classes.classes[class_] = module.classes[class_];
                            result = true;
                            $log.log("Класс " + class_ + " загружен в стек классов.");
                        }
                    }
                    if (module.menu !== undefined)
                        $menu.load(module.menu);
                } else
                    $log.error("$menu: Не указан модуль, который требуется загрузить.");
                return result;
            };


            /**
             * Выгружает заданный модуль/сервис из системы
             * @param module - Наименование модуля/сервиса, который требуется выгрузить
             * @returns {boolean} - Возвращает true в случае успешной выгрузки модуля, false - в обратном случае
             */
            modules.unload = function (module) {
                var result = false;
                if (module !== undefined) {
                    if (module.classes !== undefined) {
                        for (var class_ in module.classes) {
                            if ($classes.classes.hasOwnProperty(class_)) {
                                delete $classes.classes[class_];
                                result = true;
                            }
                        }
                    }
                } else
                    $log.error("$menu: Не указан модуль, который требуется выгрузить.");
                return result;
            };

            return modules;
        }]);



        /********************
         * $menu
         * Сервис, реализующий функционал для управления меню
         ********************/
        $provide.factory("$menu", ["$log", "$factory", function ($log, $factory) {
            var menu = {};

            /**
             * Наборы свойст и методов, описывающих модели данных
             */
            menu.classes = {

                /**
                 * MenuItem
                 * Набор свойст и методов, описывающих пункт меню
                 */
                MenuItem: {
                    id: 0,
                    title: "",
                    description: "",
                    url: "",
                    template: "",
                    controller: "",
                    active: false,
                    submenu: [],

                    /**
                     * Инициализирует пункт меню заданными параметрами
                     * @param parameters
                     */
                    init: function (parameters) {
                        if (parameters !== undefined) {
                            for (var param in parameters) {
                                if (this.hasOwnProperty(param))
                                    this[param] = parameters[param];
                            }
                        } else
                            $log.error("$menu: Не указаны параметры инициализации раздела меню.");
                    }
                }

            };


            /**
             * Переменные сервиса
             */
            menu.items = $factory({ classes: ["Collection"], base_class: "Collection" });
            menu.activeMenuItem = undefined;


            /**
             * Загружает раздел меню в систему
             * @param menuItem
             */
            menu.load = function (menuItem) {
                if (menuItem !== undefined) {
                    if (menuItem.__class__ !== undefined && menuItem.__class__ === "MenuItem") {
                        menu.items.append(menuItem);
                        $log.info("Раздел меню " + menuItem.title + " добавлен в стек разделов меню.");
                    }
                }
            };


            /**
             * Устанавливает раздел меню
             * @param parameters
             * @returns {boolean}
             */
            menu.set = function (parameters) {
                var result = false;
                if (parameters !== undefined) {
                    var menu_tem = $factory({ classes: ["MenuItem"], base_class: "MenuItem" });
                    menu_item.init(parameters);
                    menu.items.append(menu_item);
                    result = menuItem;
                }
                return result;
            };


            menu.register = function () {
                angular.forEach(menu.items.items, function (menu_item) {
                    $routeProvider
                        .when(menu_item.url, {
                            templateUrl: menu_item.template,
                            controller: menu_item.controller
                        }
                    );
                });
            };


            /**
             * Возвращает активный раздел меню
             * @returns {MenuItem} - Возвращает активный раздел меню
             */
            menu.getActive = function () {
                var result = menu.items.find("active", true);
                return result;
            };


            /**
             * Делает раздел меню с идентификатором menuItemId активным
             * @param menuItemId - Идентификатор раздела меню
             * @returns {MenuItem} - Возвращает активный раздел меню
             */
            menu.select = function (menuItemId) {
                var result = false;
                if (menuItemId !== undefined) {
                    angular.forEach(menu.items.items, function (menuItem) {
                        if (menuItem.id === menuItemId) {
                            menuItem.active = true;
                            menu.activeMenuItem = menuItem;
                            result = menuItem;
                        } else
                            menuItem.active = false;
                    });
                } else  $log.error("$menu: Не указан идентификатор раздела меню");
                return result;
            };


            return menu;
        }]);



        /********************
         * $classes
         * Сервис, содержащий описание базовых и пользовательских классов
         ********************/
        $provide.factory("$classes", ["$log", function ($log) {
            var classes = {};

            /**
             * Наборы свойст и методов, описывающих модели данных
             */
            classes.classes = {

                /**
                 * DBError
                 * Набор свойств, описывающих ошибку БД
                 */
                DBError: {
                    error_code: 0,
                    error_message: "",

                    init: function (error) {
                        if (error !== undefined) {
                            for (var prop in error) {
                                if (this.hasOwnProperty(prop))
                                    this[prop] = error[prop];
                            }
                        }
                    },

                    display: function () {
                        $log.error("DB error #" + this.error_code + ": " + this.error_message);
                    }
                },

                /**
                 * Model
                 * Набор методов и свойств для управления моделю данных
                 */
                Model: {
                    __dependencies__: [],
                    _model_: {
                        __instance__: "",
                        errors: [],
                        db_table: "",

                        /**
                         * Производит инициализацию модели данных на основе JSON-данных
                         * @param JSONdata {JSON} - Набор JSON-данных
                         * @returns {number} - Возвращает количество полей, проинициализированных из JSON-данных
                         */
                        fromJSON: function (JSONdata) {
                            var result = 0;
                            for (var data in JSONdata) {
                                for (var prop in this.__instance__) {
                                    if (this.__instance__[prop].constructor === Field &&
                                        this.__instance__[prop].source === data) {
                                        if (JSONdata[data] !== "") {
                                            if (isNaN(JSONdata[data]) === false)
                                                this.__instance__[prop].value = parseInt(JSONdata[data]);
                                            else
                                                this.__instance__[prop].value = JSONdata[data];
                                        } else
                                            this.__instance__[prop].value = "";

                                        result++;
                                    }
                                }
                            }
                            return result;
                        },


                        /**
                         * Производит инициализацию модели данных на основе другого объекта, копируя значения совпадающих свойств
                         * @param obj {object} - Объект, на основе которого требуется произвести инициализацию
                         */
                        fromAnother: function (obj) {
                            for (var another_prop in obj) {
                                if (this.__instance__.hasOwnProperty(another_prop)) {
                                    //console.log("prop = ", another_prop);
                                    //console.log("prop constructor = ", obj[another_prop].constructor);
                                    if (this.__instance__[another_prop].constructor === Field) {
                                        //if (obj[another_prop].constructor === Field)
                                        //    this.__instance__[another_prop].value = obj[another_prop].value;
                                       // else
                                            this.__instance__[another_prop].value = obj[another_prop].value;

                                    } else {
                                        //if (obj[another_prop].constructor === Field)
                                            this.__instance__[another_prop] = obj[another_prop].value;
                                        //else
                                            //this.__instance__[another_prop] = obj[another_prop];
                                    }
                                }
                            }
                        },


                        /**
                         * Возвращает значения полей модели данных в виде строки
                         * @returns {string} - Возвращает значения полей модели в виде строки
                         */
                        toString: function () {
                            var result = {};
                            for (var prop in this.__instance__) {
                                if (this.__instance__[prop].constructor === Field) {
                                    result[prop] = this.__instance__[prop];
                                }
                            }
                            return JSON.stringify(result);
                        },


                        /**
                         * Производит сброс значений полей модели данных к значениям по умолчанию
                         * @returns {number} - Возвращает количество полей, чьи значения были установлены в значение по
                         *                      умолчанию
                         */
                        reset: function () {
                            var result = 0;
                            for (var prop in this.__instance__) {
                                if (this.__instance__[prop].constructor === Field &&
                                    this.__instance__[prop].default_value !== undefined) {
                                    this.__instance__[prop].value = this.__instance__[prop].default_value;
                                    result++;
                                }
                            }
                            return result;
                        },


                        _init_: function () {
                            //$log.log("Model _init_ func called");
                            for (var prop in this.__instance__) {
                                if (this.__instance__[prop].constructor === Field &&
                                    this.__instance__[prop].default_value !== undefined) {
                                    this.__instance__[prop].value = this.__instance__[prop].default_value;
                                }
                            }
                        }
                    }
                },



                /**
                 * States
                 * Набор свойств и методов для отслеживания состояний объекта
                 */
                States: {
                    __dependencies__: [],
                    _states_: {
                        isActive: false,        // Флаг, сигнализирующий, активен ли объект
                        isSelected: false,      // Флаг, сигнализирующий, выбран ли объект
                        isChanged: false,       // Флаг, сигнализирующий, был ли изменен объект
                        isLoaded: true,        // Флаг, сигнализирующий был ли объект загружен
                        isInEditMode: false,    // Флаг, сигнализирующий, находится ли объект в режиме редактирования
                        isInDeleteMode: false,  // Флаг, сигнализирующий, находится ли объект в режиме удаления

                        /**
                         * Устанавливает / отменяет режим активного объекта
                         * @param flag {Boolean} - Флаг активности / неактивности объекта
                         * @returns {boolean} - Возвращает флаг активности / неактивности объекта
                         */
                        active: function (flag) {
                            if (flag !== undefined && flag.constructor === Boolean)
                                this.isActive = flag;
                            return this.isActive;
                        },

                        /**
                         * Устанавливает / отменяет режим редактирования объекта
                         * @param flag {Boolean} - Флаг нахождения объекта в режиме редактирования
                         * @returns {boolean} - Возвращает флаг нахождения объекта в режиме редактирования
                         */
                        editing: function (flag) {
                            if (flag !== undefined && flag.constructor === Boolean)
                                this.isInEditMode = flag;
                            return this.isInEditMode;
                        },

                        /**
                         * Устанавливает / отменяет режим удаления объекта
                         * @param flag {boolean} - Флаг нахождения объекта в режиме удаления
                         * @returns {boolean} - Возвращает флаг нахождения объекта в режиме удаления
                         */
                        deleting: function (flag) {
                            if (flag !== undefined && flag.constructor === Boolean)
                                this.isInDeleteMode = flag;
                            return this.isInDeleteMode;
                        },

                        /**
                         * Устанавливает / отменяет режим измененного объекта
                         * @param flag {boolean} - Флаг, был ли объект изменен
                         * @returns {boolean} - Возвращает флаг, был ли объект изменен
                         */
                        changed: function (flag) {
                            if (flag !== undefined && flag.constructor === Boolean)
                                this.isChanged = flag;
                            return this.isChanged;
                        },

                        /**
                         * Устанавливает / отменяет режим выбранного объекта
                         * @param flag {boolean} - Флаг, был ли выбран объект
                         * @returns {boolean} - Возвращает флаг, был ли выбран объект
                         */
                        selected: function (flag) {
                            if (flag !== undefined && flag.constructor === Boolean) {
                                this.isSelected = flag;
                                console.log("selected = ", this.isSelected);
                            }
                            return this.isSelected;
                        },

                        /**
                         * Устанавливает / отменяет режим загруженного объекта
                         * @param flag {boolean} - Флаг, был ли объект загружен
                         * @returns {boolean} - Возвращает флаг, был ли объект загружен
                         */
                        loaded: function (flag) {
                            if (flag !== undefined && flag.constructor === Boolean)
                                this.isLoaded = flag;
                            return this.isLoaded;
                        }
                    }
                },


                /**
                 * Backup
                 * Набор свойств и методов для бэкапа свойств объекта
                 */
                Backup: {
                    __dependencies__: [],
                    _backup_: {
                        __instance__: "",
                        data: {},

                        /**
                         * Устанавливает резервные значения для полей, помеченных для бэкапа
                         * @returns {number} - Возвращает количество полей, для короых созданы резервные значения
                         */
                        setup: function () {
                            var result = 0;
                            for (var prop in this.__instance__) {
                                if (this.__instance__[prop].constructor === Field && this.__instance__[prop].backupable === true) {
                                    this.data[prop] = this.__instance__[prop].value;
                                    result++;
                                }
                            }
                            return result;
                        },

                        /**
                         * Восстанавливает резервные значения полей, занесенных в бэкап
                         * @returns {number} Возвращает количество полей, для которых восстановлены резервные значения
                         */
                        restore: function () {
                            var result = 0;
                            for (var prop in this.data) {
                                if (this.__instance__[prop] !== undefined &&
                                    this.__instance__[prop].constructor === Field &&
                                    this.__instance__[prop].backupable === true) {
                                    this.__instance__[prop].value = this.data[prop];
                                    result++;
                                }
                            }
                            return result;
                        }
                    }
                },


                /**
                 * Quantity
                 * Набор свойств описывающих численность чего-либо
                 */
                Quantity: {
                    id: 0,
                    amount: 0
                },


                /**
                 * Collection
                 * Набор свойств, описывающих коллекцию объектов
                 */
                Collection: {
                    items: [],
                    selectedItems: [],
                    allowMultipleSelect: false,
                    allowMultipleSearch: false,

                    /**
                     * Возвращает количество элементов в коллекции
                     * @returns {Number} - Возвращает размер коллекции
                     */
                    size: function () {
                        return this.items.length;
                    },

                    /**
                     * Выводит в консоль все элементы коллекции
                     * @returns {Number} - Возвращает количество элементов в коллекции
                     */
                    display: function () {
                        var result = this.items.length;
                        if (console !== undefined) {
                            console.log(this.items);
                        }
                        return result;
                    },

                    /**
                     * Включает / выключает режим поиска нескольких элементов коллекции
                     * @param flag {boolean} - Флаг, включения / выключения режима поиска нескольких элементов коллекции
                     * @returns {boolean} - Возвращает флаг, включен ли режим поиска нескольких элементов коллекции
                     */
                    multipleSearch: function (flag) {
                        var result = false;
                        if (flag !== undefined) {
                            if (flag.constructor === Boolean) {
                                this.allowMultipleSearch = flag;
                                result = this.allowMultipleSearch;
                            } else
                                $log.error("$classes 'Collection': Параметр должен быть типа Boolean");
                        } else
                            $log.error("$classes 'Collection': Не указан параметр при установке режима поиска нескольких элементов");
                        return result;
                    },

                    /**
                     * Возвращает элемент коллекции, поле field которого равен value
                     * @param field {String} - Наименование поля
                     * @param value - Значение искомого поля
                     * @returns {boolean/Any} - Возвращает искомый элемент коллекции, в противном случае false
                     */
                    find: function (field, value) {
                        var result = false;
                        var temp_result = [];
                        var length = this.items.length;

                        /* Если требуется найти элемент коллекции по значению поля */
                        if (field !== undefined && value !== undefined) {
                            console.log("finding item by field and value");
                            for (var i = 0; i < length; i++) {
                                if (this.items[i][field] !== undefined) {
                                    if (this.items[i][field].constructor === Field) {
                                        if (this.items[i][field].value === value) {
                                            if (this.allowMultipleSearch === true) {
                                                temp_result.push(this.items[i]);
                                            } else {
                                                temp_result.splice(0, temp_result.length);
                                                temp_result.push(this.items[i]);
                                                result = this.items[i];
                                            }
                                        }
                                    } else {
                                        if (this.items[i][field] === value) {
                                            if (this.allowMultipleSearch === true) {
                                                temp_result.push(this.items[i]);
                                            } else {
                                                temp_result.splice(0, temp_result.length);
                                                temp_result.push(this.items[i]);
                                                result = this.items[i];
                                            }
                                        }
                                    }
                                }
                            }
                        }

                        /* Если требуется найти элемент коллекции по значению */
                        if (field !== undefined && value === undefined) {
                            console.log("finding item by value");
                            for (var i = 0; i < length; i++) {
                                if (this.items[i] === field) {
                                    if (this.allowMultipleSearch === true) {
                                        temp_result.push(this.items[i]);
                                        result = this.items[i];
                                    } else {
                                        temp_result.splice(0, temp_result.length);
                                        temp_result.push(this.items[i]);
                                    }
                                }
                            }
                        }

                        if (temp_result.length === 0)
                            return false;
                        else if (temp_result.length === 1)
                            return temp_result[0];
                        else if (temp_result.length > 1)
                            return temp_result;
                    },


                    /**
                     * Добавляет элемент в конец коллекции
                     * @param item {Any} - Элемент, добавляемый в коллекцию
                     * @returns {boolean / Number} - Возвращает новую длину коллекции, false в случае некорректного завершения
                     */
                    append: function (item) {
                        var result = false;
                        if (item !== undefined) {
                            result = this.items.push(item);
                        }
                        return result;
                    },

                    /**
                     * Удаляет элементы по значению поля и по значению
                     * @param field {String} - Наименование поля
                     * @param value {Any} - Значение поля
                     * @returns {Number} - Возвращает количество удаленных элементов
                     */
                    delete: function (field, value) {
                        var result = 0;
                        var length = this.items.length;

                        /* Если требуется удалить элементы коллекции по полю и его значению */
                        if (field !== undefined && value !== undefined) {
                            console.log("deleting by field and value");
                            for (var i = 0; i < this.items.length; i++) {
                                if (this.items[i][field] !== undefined) {
                                    if (this.items[i][field].constructor === Field) {
                                        if (this.items[i][field].value === value) {
                                            this.items.splice(i, 1);
                                            result++;
                                        }
                                    } else {
                                        if (this.items[i][field] === value) {
                                            this.items.splice(i, 1);
                                            result++;
                                        }
                                    }
                                }
                            }
                        }

                        /* Если требуется удалить элементы по значению */
                        if (field !== undefined && value === undefined) {
                            console.log("deleting by value");
                            for (var i = 0; i < length; i++) {
                                if (this.items[i] === field) {
                                    this.items.splice(i, 1);
                                    result++;
                                }
                            }
                        }

                        return result;
                    },

                    /**
                     *
                     */
                    clear: function () {
                        this.items.splice(0, this.items.length);
                        return true;
                    },

                    /**
                     * Включает / выключает режим выбора нескольких элементов коллекции
                     * @param flag {boolean} - Флаг включения / выключения режима выбора нескольких элементов коллекции
                     * @returns {boolean} - Возвращает флаг, включен ли режим выбора нескольких элементов коллекции
                     */
                    multipleSelect: function (flag) {
                        if (flag !== undefined) {
                            if (flag.constructor === Boolean) {
                                this.allowMultipleSelect = flag;
                                return this.allowMultipleSelect;
                            } else
                                $log.error("$classes 'Collection': Параметр должен быть типа Boolean");
                        } else
                            $log.error("$classes 'Collection': Не указан параметр при установке режима выбора нескольких элементов");
                    },

                    /**
                     * Помечает элемент коллекции как выбранный
                     * @param field {string} - Наименование поля элемента коллекции
                     * @param value {any} - Значение поля элемента коллекции
                     * @returns {number}
                     */
                    select: function (field, value) {
                        var result = [];
                        if (field !== undefined && value !== undefined) {
                            var length = this.items.length;
                            for (var i = 0; i < length; i++) {
                                if (this.items[i].hasOwnProperty(field)) {
                                    var item = undefined;
                                    if (this.items[i][field].constructor === Field) {
                                        if (this.items[i][field].value === value) {
                                            console.log("element found", this.items[i]);
                                            item = this.items[i];
                                        }
                                    } else {
                                        if (this.items[i][field] === value)
                                            item = this.items[i];
                                    }
                                    if (item !== undefined) {
                                        if (this.allowMultipleSelect === true) {
                                            result.push(item);
                                            this.selectedItems.push(item);
                                            if (item._states_ !== undefined)
                                                item._states_.selected(true);
                                        } else {
                                            result.splice(0, result.length);
                                            this.selectedItems.splice(0, this.selectedItems.length);
                                            result.push(this.items[i]);
                                            this.selectedItems.push(this.items[i]);
                                            if (item._states_ !== undefined)
                                                item._states_.selected(true);
                                            for (var x = 0; x < length; x++) {
                                                if (this.items[x] !== item) {
                                                    if (this.items[x]._states_ !== undefined)
                                                        this.items[x]._states_.selected(false);
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }

                        console.log("selectedItems = ", this.selectedItems);

                        if (result.length === 0)
                            return false;
                        if (result.length === 1)
                            return result[0];
                        if (result.length > 1)
                            return result;

                    },

                    deselect: function (item) {
                        if (item !== undefined) {
                            var length = this.items.length;
                            for (var i = 0; i < length; i++) {
                                if (this.items[i] === item) {
                                    var selectedLength = this.selectedItems.length;
                                    if (item._states_ !== undefined)
                                        item._states_.selected(false);
                                    for (var x = 0; x < selectedLength; x++) {
                                        if (this.selectedItems[x] === item) {
                                            this.selectedItems.splice(x, 1);
                                        }
                                    }
                                }
                            }
                        }
                        console.log(this.selectedItems);
                        return this.selectedItems;
                    }
                }


            };

            return classes;
        }]);



        /********************
        * $factory
        * Сервис фабрики объектов
        *******************/
        $provide.factory("$factory", ["$log", "$classes", function ($log, $classes) {

            function FactoryObject (parameters) {

                var clone = function _clone(obj) {
                    if (obj instanceof Array) {
                        var out = [];
                        for (var i = 0, len = obj.length; i < len; i++) {
                            var value = obj[i];
                            out[i] = (value !== null && typeof value === "object") ? _clone(value) : value;
                        }
                    } else {
                        var out = new obj.constructor();
                        for (var key in obj) {
                            if (obj.hasOwnProperty(key)) {
                                var value = obj[key];
                                out[key] = (value !== null && typeof value === "object") ? _clone(value) : value;
                            }
                        }
                    }
                    return out;
                };

                var _clone = function (it) {
                    return this._clone({
                        it: it
                    }).it;
                };


                var addClass = function (className, destination) {
                    if (className !== undefined && destination !== undefined) {
                        if ($classes.classes.hasOwnProperty(className)) {
                            destination.init_functions = [];
                            for (var prop in $classes.classes[className]) {
                                if (prop !== "__dependencies__") {
                                    if ($classes.classes[className][prop].constructor !== Function) {
                                        destination[prop] = clone($classes.classes[className][prop]);
                                        if (destination[prop]["__instance__"] !== undefined)
                                            destination[prop]["__instance__"] = destination;
                                        if (destination[prop]["_init_"] !== undefined && destination[prop]["_init_"].constructor === Function)
                                            destination.init_functions.push(destination[prop]["_init_"]);
                                        if (destination["_init_"] !== undefined && destination["_init_"].constructor === Function)
                                            destination.init_functions.push(destination["_init_"]);

                                    } else {
                                        destination[prop] = $classes.classes[className][prop];
                                        if (prop === "_init_")
                                            destination.init_functions.push(destination[prop]);
                                    }
                                }
                            }
                        }
                    }
                };


                if (parameters !== undefined) {
                    if (parameters.hasOwnProperty("classes")) {
                        if (parameters["classes"].constructor === Array) {
                            for (var parent in parameters["classes"]) {
                                var class_name = parameters["classes"][parent];
                                addClass(class_name, this);
                            }
                        }
                    }
                    if (parameters.hasOwnProperty("base_class")) {
                        if ($classes.classes.hasOwnProperty(parameters["base_class"])) {
                            this.__class__ = parameters["base_class"];
                        }
                    }
                }

            };

            return function (parameters) {
                var obj = new FactoryObject(parameters);
                if (obj.init_functions.length > 0) {
                    for (var i = 0; i < obj.init_functions.length; i++) {
                        //console.log("init func = ", obj.init_functions[i]);
                        obj.init_functions[i].call(obj);
                    }
                }
                //return new FactoryObject(parameters);
                return obj;
            };

        }]);




        $provide.factory("$f", ["$log", "$classes", function ($log, $classes) {

            var factory = {};

            /**
             * Собирает объект на основе заданных наборов свойств и методов
             * @param parameters {Object} - Параметры сборки объекта
             * @returns {Object} - Возвращает собранный объект
             */
            factory.make = function (parameters) {
                var result = undefined;

                if (parameters !== undefined) {
                    result = parameters["destination"] !== undefined ? parameters["destination"] : {};

                    if (parameters["base_class"] !== undefined) {
                        if ($classes.classes.hasOwnProperty(parameters["base_class"]))
                            result.__class__ = parameters["base_class"];
                    }

                    if (parameters["classes"] !== undefined && parameters["classes"].constructor === Array) {
                        var classes = parameters["classes"];

                        for (var parent_class in classes) {
                            var target_class = undefined;

                            if ($classes.classes.hasOwnProperty(classes[parent_class]))
                                target_class = $classes.classes[classes[parent_class]];

                            if (target_class !== undefined) {
                                if (target_class.hasOwnProperty("__dependencies__") && target_class.__dependencies__.length > 0) {
                                    //TODO: add dependencies injection
                                } //else
                                    //console.log(classes[parent_class] + " have no dependencies");

                                for (var member in target_class) {
                                    if (target_class[member] !== undefined && target_class[member].constructor === Function) {
                                        if (result.prototype !== undefined) {
                                            if (result.prototype.constructor !== Object)
                                                result.prototype[member] = angular.copy(target_class[member]);
                                            else
                                                result[member] = angular.copy(target_class[member]);
                                        } else if (result.__proto__ !== undefined) {
                                            if (result.__proto__.constructor !== Object)
                                                result.__proto__[member] = angular.copy(target_class[member]);
                                            else
                                                result[member] = target_class[member];
                                        }
                                    } else if (target_class[member] !== undefined && target_class[member].constructor !== Function) {
                                        if (member !== "__dependencies__") {
                                            result[member] = angular.copy(target_class[member]);
                                            if (result[member]["__instance__"] !== undefined)
                                                result[member]["__instance__"] = result;
                                        }
                                    }
                                }
                            } else {
                                $log.error("$factory: Класс " + classes[parent_class] + " не найден.");
                            }
                        }
                    } else
                        $log.error("$factory: Вы не указали массив, содержащий классы, свойства и методы которых требуется наследовать.");
                }

                console.log("result object: ", result);
                return result;
            };

            return factory;
        }]);





        /********************
         * $pagination
         * Сервис пагинации
         ********************/
        $provide.factory("$pagination", ["$log", function ($log) {
            var pagination = {};


            /**
             * Переменные сервиса
             */
            pagination.totalPages = 0;
            pagination.currentPage = 1;
            pagination.itemsOnPage = 0;
            pagination.itemsCount = 0;

            /**
             * Переход на следующую страницу
             */
            pagination.next = function () {
                if (pagination.currentPage < pagination.totalPages)
                    pagination.currentPage++;
            };

            /**
             * Переход на предыдущую страницу
             */
            pagination.previous = function () {
                if (pagination.currentPage > 1)
                    pagination.currentPage--;
            };

            /**
             * Пееходит на указанную страницу
             * @param pageNumber {umber} - номер страницы
             */
            pagination.set = function (pageNumber) {
                if (pageNumber !== undefined) {
                    if (isNaN(pageNumber) === false) {
                        if (pageNumber > 0 && pageNumber <= pagination.totalPages) {
                            $log.log("currentpage = ", pageNumber);
                            pagination.currentPage = pageNumber;
                        } else
                            $log.error("$pagination: Номер страницы не может быть меньше 0 и больше общего количества страниц");
                    } else
                        $log.error("$pagination: Номер страницы должен быть числовым значением");
                } else
                    $log.error("$pagination: Не указан номер страницы, на которую требуется перейти");
            };


            pagination.init = function (parameters) {
                if (parameters !== undefined) {
                    //pagination.set(1);
                    if (parameters.hasOwnProperty("itemsOnPage")) {
                        if (isNaN(parameters["itemsOnPage"]) === false) {
                            pagination.itemsOnPage = parameters["itemsOnPage"];
                        }
                    }
                    if (parameters.hasOwnProperty("itemsCount")) {
                        if (isNaN(parameters["itemsCount"]) === false) {
                            pagination.itemsCount = parameters["itemsCount"];
                            pagination.totalPages = Math.ceil(parameters["itemsCount"] / parameters["itemsOnPage"]);
                        }
                    }
                    //pagination.currentPage = 1;
                }
            };


            /**
             * pagination
             * Фильтр массива объектов по страницам
             */
            $filterProvider.register("pagination", ["$log", "$pagination", function ($log, $pagination) {
                return function (input, itemsOnPage, pageNumber) {
                    if (itemsOnPage !== undefined && pageNumber !== undefined) {
                        var items = [];
                        var start = (pageNumber * itemsOnPage) - itemsOnPage ;
                        $pagination.init({ itemsOnPage: 12, itemsCount: input.length });
                        $log.log("input size = ", input.length);
                        angular.forEach(input, function (item, key) {
                            if (key >= start && key <= (start + itemsOnPage) - 1)
                                items.push(item);
                        });
                        return items;
                    } else
                        return input;
                };
            }]);


            return pagination;
        }]);


    })
    .run(function ($modules, $classes, $menu) {
        $modules.load($classes);
        $modules.load($menu);
    });