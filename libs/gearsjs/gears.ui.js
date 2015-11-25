"use strict";

/**
 * Вычисляет метрики элемента
 * @param element {HTMLElement} - Элемент, для которого производится перерасчет
 * @returns {Object} - Возвращает митрики элемента
 */
var metrics = function (element) {
    if (element !== undefined) {
        var top = 0,
            left = 0,
            offsetY = 0,
            offsetX = 0,
            scrollY = 0,
            scrollX = 0,
            width = element.clientWidth,
            height = element.clientHeight;
        while (element) {
            top = top + parseFloat(element.offsetTop);
            left = left + parseFloat(element.offsetLeft);
            offsetX = offsetX + parseFloat(element.offsetLeft);
            offsetY = offsetY + parseFloat(element.offsetTop);
            scrollY = scrollY + parseFloat(element.scrollTop);
            scrollX = scrollX + parseFloat(element.scrollLeft);
            element = element.offsetParent;
        }
        return {
            width: width,
            height: height,
            top: Math.round(top),
            left: Math.round(left),
            offsetX: Math.round(offsetX),
            offsetY: Math.round(offsetY),
            scrollX: Math.round(scrollX),
            scrollY: Math.round(scrollY)
        }
    }
};



var grUi = angular.module("gears.ui", [])
    .config(function ($provide) {
        $provide.factory("$popup", ["$log", "$factory", function ($log, $factory) {
            var popup = {};

            popup.classes = {
                /**
                 * Popup
                 * Набор свойст, описывающих всплывабщий элемент интерфейса
                 */
                Popup: {
                    id: 0,
                    element: HTMLElement,
                    target: HTMLElement,
                    visible: false
                }
            };

            var items = $factory({ classes: ["Collection"], base_class: "Collection" });

            function position (element) {
                var top = 0, left = 0, offsetX = 0, offsetY = 0;
                while (element) {
                    top = top + parseFloat(element.offsetTop);
                    left = left + parseFloat(element.offsetLeft);
                    offsetX = offsetX + parseFloat(element.scrollLeft);
                    offsetY = offsetY + parseFloat(element.scrollTop);
                    element = element.offsetParent;
                }
                return {top: Math.round(top), left: Math.round(left), offsetX: Math.round(offsetX), offsetY: Math.round(offsetY)};
            };


            /**
             * Создает новый попап
             * @returns {Popup} - Возвращает созданный попап
             */
            popup.register = function (target) {
                var result = false;
                if (target !== undefined) {
                    var temp_popup = $factory({ classes: ["Popup"], base_class: "Popup" });
                    temp_popup.target = target;
                    temp_popup.id = target.id + "_typeahead";
                    items.append(temp_popup);

                    var element = document.createElement("div");
                    var content = document.createElement("div");
                    content.id = temp_popup.id + "_content";
                    content.className = "content";
                    var corner = document.createElement("div");
                    corner.className = "corner-bottom";
                    var pos = position(temp_popup.target);
                    $log.log("pos = ", pos);
                    temp_popup.element = element;
                    angular.element(temp_popup.element).prop("id", popup.id);
                    angular.element(temp_popup.element).prop("className", "gears-ui-typeahead");
                    element.appendChild(content);
                    element.appendChild(corner);
                    document.body.appendChild(element);
                    angular.element(element).css({
                        display: "block",
                        width: angular.element(temp_popup.target).prop("clientWidth") + 12 + "px",
                        //left: pos.left + "px",
                        //top: pos.top - angular.element(temp_popup.element).css("height") + "px",
                        visibility: "hidden"
                    });

                    result = temp_popup;
                    $log.log("created popup = ", temp_popup);
                }
                return result;
            };

            /**
             * Удаляет попап с идентификатором popupId
             * @param popupId {number} - идентификатор попапа
             * @returns {boolean} - Возвращает true в случае успеха, иначе - false
             */
            popup.delete = function (popupId) {
                var result = false;
                if (popupId !== undefined) {
                    var temp_popup = items.find("id", popupId);
                    if (temp_popup !== false) {
                        items.delete("id", popupId);
                        result = true;
                    }
                }
                return result;
            };

            /**
             * Делает попап с идентификатором popupId видимым
             * @param popupId {number} - Идентификатор попапа
             * @returns {boolean} - Возвращает true в случае успеха, иначе - false
             */
            popup.show = function (popupId) {
                var result = false;
                if (popupId !== undefined) {
                    angular.forEach(items.items, function (popup) {
                        if (popup.id === popupId) {
                            var pos = position(popup.target);
                            $log.log("position = ", pos);
                            $log.log("element height = ", angular.element(popup.element).css("height"));
                            $log.log("window offset y = ", window.document.scrollHeight);
                            angular.element(popup.element).css({
                                //left: pos.left - 6 + "px",
                                //top: pos.top - popup.element.clientHeight - pos.offsetY + 8 + "px",
                                visibility: "hidden"
                            });
                            angular.element(popup.element).css("visibility", "visible");
                            popup.visible = true;
                            result = true;
                        }
                    });
                }
                return result;
            };

            /**
             * Делает попап с идентификатором popupId невидимым
             * @param popupId {number} - Идентификатор попапа
             * @returns {boolean} - Возвращает true в случае успеха, иначе - false
             */
            popup.hide = function (popupId) {
                var result = false;
                if (popupId !== undefined) {
                    angular.forEach(items.items, function (popup) {
                        if (popup.id === popupId) {
                            angular.element(popup.element).css("visibility", "hidden");
                            //document.removeChild(popup.element);
                            popup.visible = false;
                            result = true;
                        }
                    });
                }
                return result;
            };

            return popup;
        }]);





        $provide.factory("$modals", ["$log", "$factory", function ($log, $factory) {
            var modals = {};

            modals.items = $factory({ classes: ["Collection", "States"], base_class: "Collection" });
            modals.modal = undefined;

            /**
             * Регистрирует модальное окно
             * @param scope
             */
            modals.register = function (scope) {
                if (scope !== undefined) {
                    modals.modal = scope;
                    $log.log("scope = ", scope);
                }
            };

            /**
             * Показывает модальное окно
             * @param parameters {Object} - Параметры модального окна
             */
            modals.show = function (parameters) {
                modals.modal.init(parameters);
            };

            /**
             * Закрывает модальное окно
             */
            modals.close = function () {
                modals.modal.close();
            };

            return modals;
        }]);


    })
    .run(function ($modules, $popup) {
        $modules.load($popup);
    });


grUi.directive("modal", ["$log", "$window", "$modals", function ($log, $window, $modals) {
    return {
        restrict: "E",
        //scope: {},
        templateUrl: "templates/ui/modals/modals.html",
        link: function (scope, element, attrs, ctrl) {
            scope.showModal = false;
            scope.caption = "";
            scope.template = "";
            scope.showClose = true;
            scope.element = element;
            scope.onClose = undefined;
            var showFog = false;
            var top = undefined;
            var left = undefined;
            var width = undefined;
            var height = undefined;
            var position = undefined;

            $modals.register(scope);

            var recalculatePosition = function () {
                var container = element.children();
                if (width !== undefined)
                    angular.element(container).css("width", width + "px");
                if (height !== undefined)
                    angular.element(container).css("height", height + "px");

                if (position !== undefined) {
                    switch (position) {
                        case "center":
                            angular.element(container).css({
                                top: ($window.innerHeight / 2 - angular.element(container).prop("clientHeight") / 2) + "px",
                                left: ($window.innerWidth / 2 - width / 2) + "px"
                            });
                            break;
                    }
                } else {
                    if (left !== undefined)
                        angular.element(container).css("left", left + "px");
                    if (top !== undefined)
                        angular.element(container).css("top", top + "px");
                }
            };

            scope.init = function (parameters) {
                scope.showModal = false;
                if (parameters !== undefined) {
                    //scope = parameters["scope"] !== undefined ? parameters["scope"] : {};
                    top = parameters["top"] !== undefined ? parameters["top"] : undefined;
                    left = parameters["left"] !== undefined ? parameters["left"] : undefined;
                    width = parameters["width"] !== undefined ? parameters["width"] : undefined;
                    height = parameters["height"] !== undefined ? parameters["height"] : undefined;
                    scope.caption = parameters["caption"] !== undefined ? parameters["caption"] : undefined;
                    position = parameters["position"] !== undefined ? parameters["position"] : undefined;
                    scope.showClose = parameters["closeButton"] !== undefined ? parameters["closeButton"] : false;
                    showFog = parameters["showFog"] !== undefined ? parameters["showFog"] : false;
                    scope.onClose = parameters["onClose"] !== undefined ? parameters["onClose"] : undefined;
                    scope.data = parameters["data"] !== undefined ? parameters["data"] : {};


                    if (showFog === true) {
                        var fog = document.createElement("div");
                        fog.className = "gears-ui-modals-fog";
                        document.body.appendChild(fog);
                    }

                    if (parameters["template"] !== undefined) {
                        if (parameters["template"] === scope.template)
                            scope.show();
                        else
                            scope.template = parameters["template"];
                    }
                }
            };

            scope.show = function () {
                recalculatePosition();
                scope.showModal = true;
            };

            scope.close = function () {
                scope.showModal = false;
                if (showFog === true) {
                    var fog = document.getElementsByClassName("gears-ui-modals-fog");
                    document.body.removeChild(fog[0]);
                    showFog = false;
                }
                if (scope.onClose !== undefined)
                    scope.onClose();
            };

            angular.element($window).bind("resize", function () {
                if (scope.showModal === true)
                    recalculatePosition();
            });

            angular.element(element).bind("resize", function () {
                $log.log("resized");
                if (scope.showModal === true)
                    recalculatePosition();
            });

            element[0].addEventListener("DOMSubtreeModified", function (ev) {
                //$log.log("MODIFIED");
                recalculatePosition();
            }, false);
        }
    }
}]);



grUi.directive("typeahead", ["$log", "$window", "$document", "$popup", function ($log, $window, $document, $popup) {
    return {
        restrict: "A",
        require: "ngModel",
        scope: {
            typeaheadItemsLimit: "@",
            typeaheadDataSource: "=",
            typeaheadModelField: "@",
            typeaheadDisplayField: "@"
        },
        link: function (scope, element, attrs, ctrl) {
            var variants = scope.variants = [];
            var popup = $popup.register(element[0]);


            var getViewValue = function (modelValue) {
                var result = "";
                if (modelValue !== undefined) {
                    angular.forEach(scope.typeaheadDataSource, function (item) {
                        if (item.hasOwnProperty(scope.typeaheadModelField)) {
                            var itemModelValue = item[scope.typeaheadModelField].constructor === Field ? item[scope.typeaheadModelField].value : item[scope.typeaheadModelField];
                            if (itemModelValue === modelValue) {
                                if (item.hasOwnProperty(scope.typeaheadDisplayField)) {
                                    result = item[scope.typeaheadDisplayField].constructor === Field ? item[scope.typeaheadDisplayField].value : item[scope.typeaheadDisplayField];
                                }
                            }
                        }
                    });
                }
                return result;
            };



            scope.$watch("typeaheadDataSource.length", function (newVal, oldVal) {
                if (newVal !== 0) {
                    $log.log("typeahead data source length changed, ", newVal);
                    //$log.log("item view value = , ", getViewValue(ctrl.$modelValue));
                    ctrl.$setViewValue(getViewValue(ctrl.$modelValue));
                    ctrl.$render();
                }
            });


            ctrl.$parsers.push(function (value) {
                if (value !== undefined) {
                    var result = 0;
                    $log.log("parser value = ", value);
                    if (value != "") {
                        angular.forEach(scope.typeaheadDataSource, function (item) {
                            var item_display = "";
                            var item_model = "";
                            if (item.hasOwnProperty(scope.typeaheadDisplayField)) {
                                if (item[scope.typeaheadDisplayField].constructor === Field)
                                    item_display = item[scope.typeaheadDisplayField].value;
                                else
                                    item_display = item[scope.typeaheadDisplayField];
                                if (item_display == value) {
                                    //$log.log("item display = ", item_display);
                                    if (item.hasOwnProperty(scope.typeaheadModelField)) {
                                        if (item[scope.typeaheadModelField].constructor === Field)
                                            result = item[scope.typeaheadModelField].value;
                                        else
                                            result = item[scope.typeaheadModelField];

                                        //$log.log("model value = ", result);
                                    } else
                                        $log.error("$typeahead: Поле '" + scope.typeaheadModelField + "' не найдено");
                                }
                            } else
                                $log.error("$typeahead: Поле '" + scope.typeaheadDisplayField + "' не найдено");

                        });
                    }

                    return result;

                }
            });


            ctrl.$formatters.push(function (value) {
                if (value !== undefined) {
                    $log.log("model value in formatter = ", value);
                    var result = value != 0 ? getViewValue(value) : "";
                    return result;
                }
            });




            var recalculate_position = function () {
                var target_metrics = metrics(element[0]);
                var balloon_metrics = metrics(popup.element);
                angular.element(popup.element).css({
                    width: target_metrics.width  + 12 + "px",
                    top: target_metrics.top - balloon_metrics.height - target_metrics.scrollY + 6 + "px",
                    left: target_metrics.left - 6 + "px"
                });
            };


            var refresh_variants = function () {
                var text = popup.target.value.toString().toLowerCase();
                var content = document.getElementById(popup.target.id + "_typeahead_content");
                content.innerHTML = "";
                scope.variants.splice(0, scope.variants.length);
                var data_length = scope.typeaheadDataSource.length;
                var item_counter = 0;
                for (var i = 0; i < data_length; i++) {
                    var display_value = "";
                    var model_value = "";
                    if (scope.typeaheadDataSource[i].hasOwnProperty(scope.typeaheadDisplayField)) {
                        //$log.log("exists, ", scope.typeaheadDisplayField);
                        if (scope.typeaheadDataSource[i][scope.typeaheadDisplayField].constructor === Field)
                            display_value = scope.typeaheadDataSource[i][scope.typeaheadDisplayField].value;
                        else
                            display_value = scope.typeaheadDataSource[i][scope.typeaheadDisplayField];

                        if (display_value.toString().toLowerCase().indexOf(text) !== -1 && text !== "" && text !== " " && item_counter < scope.typeaheadItemsLimit) {
                            scope.variants.push(display_value);
                            var variant = document.createElement("div");
                            variant.className = "typeahead-item";
                            variant.innerHTML = display_value;
                            variant.onclick = select;
                            content.appendChild(variant);
                            //$log.log(display_value + " matched");
                            item_counter++;
                        }

                    }
                }
                if (scope.variants.length > 0) {
                    recalculate_position();
                    $popup.show(popup.id);
                } else
                    $popup.hide(popup.id);
            };


            var get_text = function () {
                return popup.target.value;
            };



            var select = function (event) {
                //$log.log("selected value = ", event.target.innerHTML);
                //$log.log("model value before = ", ctrl.$modelValue);
                var display_value = event.target.innerHTML;
                ctrl.$setViewValue(display_value);
                popup.target.value = display_value;
                $popup.hide(popup.id);
                //$log.log("model value after = ", ctrl.$modelValue);
            };



            //recalculate_position();


            element.on("focus", function (event) {
                //$log.log("element focused");
                //recalculate_position();
                //if (get_text() !== "")
                //    $popup.show(popup.id);
            });

            element.on("blur", function (event) {

                //if (popup.visible === true) {
                //    preventDefault();
                //}
                //$popup.hide(popup.id);
            });

            element.on("change", function (event) {
            });

            element.on("keyup", function (event) {
                refresh_variants();
            });

            angular.element($window).bind("resize", function (event) {
                //$log.log("window resized");
                recalculate_position();
            });

            angular.element($window).bind("scroll", function (event) {
                $log.log("window scrolled");
                //recalculate_position();
            });


            $document.on("scroll", function (event) {
                $log.log("document scrolled");
            });

        }
    }
}]);



grUi.directive("datepicker", ["$log", function ($log) {
    return {
        restrict: "E",
        scope: {},
        controller: function ($scope) {
            var now = new moment();
            var firstDayInMonth = moment().startOf("month");
            var firstDayInCalendar = new moment(firstDayInMonth).add(((firstDayInMonth.weekday()) * -1), "days");

            var startOfMonth = moment().startOf("month");
            var endOfMonth = moment().endOf("month");
            var daysInMonth = Math.round((moment().endOf("month").unix() - moment().startOf("month").unix()) / 86400);
            var firstDay = startOfMonth.weekday();
            var days = $scope.days = [];




            for (var i = 0; i < 42; i++ ) {
                var temp_moment = new moment(firstDayInCalendar).add(i, "days");
                var day = {
                    number: temp_moment.date(),
                    weekDay: "",
                    title: temp_moment.format("DD MMMM YYYY, dddd"),
                    thisMonth: false
                };
                switch (temp_moment.weekday()) {
                    case 0: day.weekDay = "Вс";
                            break;
                    case 1: day.weekDay = "пн";
                        break;
                    case 2: day.weekDay = "Вт";
                        break;
                    case 3: day.weekDay = "Ср";
                        break;
                    case 4: day.weekDay = "Чт";
                        break;
                    case 5: day.weekDay = "Пт";
                        break;
                    case 6: day.weekDay = "Сб";
                        break;
                };
                day.thisMonth = temp_moment.month() !== now.month() ? false : true;
                days.push(day);
            }
            $log.log("now = ", now.format("DD.MM.YYYY HH:mm"));
            $log.log("start of month = ", moment(startOfMonth).format("DD.MM.YYYY HH:mm"));
            $log.log("end of month of month = ", moment(endOfMonth).format("DD.MM.YYYY HH:mm"));
            $log.log("days in month = ", daysInMonth);
            $log.log("first day in calendar = ", firstDayInCalendar.format("DD.MM.YYYY HH:mm"));
        },
        templateUrl: "templates/gears-ui/datepicker.html"
    }
}]);



grUi.directive("tabs", ["$log", function ($log) {
    return {
        restrict: "E",
        scope: {
            tabsSource: "=",
            onTabSelect: "=",
            class: "@",
            tabsPosition: "@"
        },
        templateUrl: "templates/ui/tabs/tabs.html",
        link: function (scope, element, attr, ctrl) {
            var currentTab = scope.currentTab = "";
            var height = 0;

            scope.onLoadTemplate = function () {
                var container = element.children();
                $log.log("tabs container = ", container);
                var tabs_metrics = metrics(container[0]);
                $log.log("tabs metrics = ", tabs_metrics);
                if (tabs_metrics.height > height) {
                    height = tabs_metrics.height;
                    angular.element(container).css("height", height + "px");
                }
            };

            angular.forEach(scope.tabsSource, function (tab) {
                if (tab.isActive === true)
                    scope.currentTab = tab;
            });

            scope.select = function (tabId) {
                $log.log("select called");
                if (tabId !== undefined) {
                    angular.forEach(scope.tabsSource, function (tab) {
                        if (tab.id === tabId) {
                            tab.isActive = true;
                            scope.currentTab = tab;
                            if (scope.onTabSelect !== undefined)
                                scope.onTabSelect(scope.currentTab);
                        } else
                            tab.isActive = false;
                    });
                }
            };
        }
    }
}]);





