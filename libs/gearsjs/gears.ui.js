"use strict";


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
                var top = 0, left = 0;
                while (element) {
                    top = top + parseFloat(element.offsetTop);
                    left = left + parseFloat(element.offsetLeft);
                    element = element.offsetParent;
                }
                return {top: Math.round(top), left: Math.round(left)};
            }


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
                        width: angular.element(temp_popup.target).prop("clientWidth") + 2 + "px",
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
                            $log.log("element height = ", angular.element(popup.element).css("height"));
                            angular.element(popup.element).css({
                                left: pos.left + "px",
                                top: pos.top - popup.element.clientHeight + 5 + "px",
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
    })
    .run(function ($modules, $popup) {
        $modules.load($popup);
    });

grUi.directive("typeahead", ["$log", "$popup", function ($log, $popup) {
    return {
        restrict: "A",
        scope: {
            typeaheadItemsLimit: "=",
            typeaheadDataSource: "="
        },
        controller: function ($scope) {
            var items = $scope.items = [];
            items[0] = "element 1";
            items[1] = "element 2";
            items[2] = "element 3";
        },
        link: function (scope, element, attrs, ctrl) {
            var popup = $popup.register(element[0]);
            $log.log("typeaheadItemsLimit = ", scope.typeaheadItemsLimit);
            $log.log("typeaheadDataSource = ", scope.typeaheadDataSource);

            var select = function (event) {
                $log.log("selected value = ", event.target.innerHTML);
            };

            function refresh () {
                $log.log("target = ", popup.target);
                var content = document.getElementById(popup.target.id + "_typeahead_content");
                content.innerHTML = "";
                for (var item in scope.typeaheadDataSource) {
                    $log.log("item = ", scope.typeaheadDataSource[item]);
                    var variant = document.createElement("div");
                    variant.className = "typeahead-item";
                    variant.innerHTML = scope.typeaheadDataSource[item].display;
                    variant.onclick = select;
                    content.appendChild(variant);
                }
            };

            refresh();

            scope.$watch("typeaheadDataSource.length", function (value) {
                $log.log("updated ", value);
               refresh();
            });

            element.on('mousedown', function(event) {

            });

            element.on("focus", function (event) {
                $log.log("element focused");
                $popup.show(popup.id);
            });

            element.on("blur", function (event) {
                $log.log("element focused out");
                //$popup.hide(popup.id);
            });

        }
    }
}]);

    grUi.directive("tabs", ["$log", function ($log) {
        return {
            restrict: "E",
            scope: {
                caption: "@"
            },
            transclude: true,

            controller: function ($scope) {
                var tabs = $scope.tabs = [];
                //tabs.push({title: "test"});

                $scope.add = function (tab) {
                    if (tab !== undefined) {
                        this.tabs.push(tab);
                    }
                    $log.log("tabs = ", tabs);
                };

            },

            template: "<ul>{{caption}}<li ng-repeat='tab in tabs'>{{ tab.title }}</li></ul>",
            link: function (scope, element, attributes, ctrl) {
                $log.log("TABS DIRECTIVE HERE");
                $log.log("caption = ", scope.caption);
                $log.log(ctrl);
            }
        }
}]);

grUi.directive("tab", ["$log", function ($log) {
    return {
        restrict: "E",
        require: "^tabs",
        //transclude: true,
        scope: {
            title: "@"
        },
        //template: "jhjh",
        link: function (scope, element, attributes, tabsCtrl) {
            if (tabsCtrl === undefined)
                $log.log("no tabsCtrl");

            $log.log("TAB DIRECTIVE HERE");
            tabsCtrl.add(scope);
            $log.log(scope);
        }
    }
}]);



grUi.directive("typeahead", ["$log", function ($log) {
    return {
        restrict: "E",
        scope: {
            placeholder: "@"
        },
        controller: function ($scope) {
            var label = $scope.label = "testlabel";
            var title = $scope.title = "Очистить";

            $scope.$watch("label", function (newVal, oldVal) {
               $log.log("oldVal = ", oldVal);
                $log.log("newVal = ", newVal);
                if (newVal === "") {
                    this.title = "";
                } else {
                    this.title = "Очистить";
                }
                $log.log("title = ", title);
            });

            $scope.clear = function () {
                $log.log("clear called");
                this.label = "";
            };
        },

        templateUrl: "templates/gears-ui/typeahead.html"
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



