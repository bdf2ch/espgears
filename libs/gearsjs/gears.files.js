"use strict";



var grFiles = angular.module("gears.files", [])
    .config(function ($provide) {

        $provide.factory("$files", ["$log", "$http", "$factory", function ($log, $http, $factory) {
            var files = {};

            files.classes = {
                /**
                 * File
                 * Набор свойств, описывающих файл
                 */
                File: {
                    title: new Field({ source: "title", value: "", default_value: "", backupable: true, required: true }),
                    size: new Field({ source: "size", value: 0, default_value: 0 }),
                    path: new Field({ source: "path", value: "", default_value: "" })
                },

                /**
                 * Folder
                 * Набор свойст, описывающих папку
                 */
                Folder: {
                    title: new Field({ source: "title" }),
                    path: new Field({ source: "path", value: "", default_value: "" }),
                    items: $factory({ classes: ["Collection"], base_class: "Collection" })
                },

                FileTree: {
                    items: [],

                    append: function (path, item) {
                        if (path !== undefined && item !== undefined) {
                            var length = this.items.length;
                            for (var i = 0; i < length; i++) {
                                if (this.items[i].path.value === path) {
                                    this.items[i].items.append(item);
                                }
                            }
                        }
                    },

                    delete: function (path, item) {

                    }
                }

            };

            files.scan = function () {

            };

            return files;
        }]);

    })
    .run(function ($modules, $files) {

    }
);