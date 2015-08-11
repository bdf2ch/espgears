"use strict";


var grUi = angular.module("gears.ui", []);


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