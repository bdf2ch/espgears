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
                    path: new Field({ source: "path", value: "", default_value: "" }),
                    url: new Field({ source: "url", value: "", default_value: "" }),
                    parentPath: ""
                },

                /**
                 * Folder
                 * Набор свойст, описывающих папку
                 */
                Folder: {
                    title: new Field({ source: "title" }),
                    path: new Field({ source: "path", value: "", default_value: "" }),
                    isEmpty: new Field({ source: "isEmpty", value: true, default_value: true }),
                    items: $factory({ classes: ["Collection"], base_class: "Collection" })

                    //_init_: function () {
                    //    $log.log("isEmpty = ", this.isEmpty);
                    //}
                },

                FileTree: {
                    items: [],
                    root: [],

                    appendToRoot: function (item) {
                        if (item !== undefined) {
                            this.root.push(item);
                        }
                    },

                    delete: function (path, item) {

                    }
                }

            };


            //files.items = $factory({ classes: ["FileTree", "States"], base_class: "FileTree" });


            var parseFile = function (data) {
                var result = false;
                if (data !== undefined) {
                    switch (data["isDirectory"]) {
                        case true:
                            result = $factory({ classes: ["Folder", "Model", "Backup", "States"], base_class: "Folder" });
                            break;
                        case false:
                            result = $factory({ classes: ["File", "Model", "Backup", "States"], base_class: "File" });
                            break;
                    }
                    result._model_.fromJSON(data);
                    result._backup_.setup();
                }
                return result;
            };


            files.scan = function (path) {
                if (path !== undefined) {
                    var params = {
                        action: "scan",
                        data: {
                            path: path
                        }
                    };
                    $http.post("serverside/controllers/gears.files.php", params)
                        .success(function (data) {
                            if (data !== undefined) {
                                if (data["error_type"] !== undefined) {
                                    //var db_error = $factory({ classes: ["DBError"], base_class: "DBError" });
                                    //db_error.init(data);
                                    //db_error.display();
                                    $log.error("FSError");
                                } else {
                                    angular.forEach(data, function (file) {
                                        var temp_file = parseFile(file);
                                        //files.items.append(temp_file);
                                        $log.log("file = ", temp_file);
                                    });

                                }
                            }
                        }
                    );
                } else {
                    $http.post("serverside/controllers/gears.files.php", { action: "scan" })
                        .success(function (data) {
                            if (data !== undefined) {
                                if (data["error_type"] !== undefined) {
                                    //var db_error = $factory({ classes: ["DBError"], base_class: "DBError" });
                                    //db_error.init(data);
                                    //db_error.display();
                                    $log.error("FSError");
                                } else {
                                    angular.forEach(data, function (file) {
                                        var temp_file = parseFile(file);
                                        files.items.appendToRoot(temp_file);
                                    });
                                    $log.log("files answer = ", files.items.root);
                                }
                            }
                        }
                    );
                }
            };


            files.add = function () {

            };

            return files;
        }]);

    })
    .run(function ($modules, $files, $factory, $log) {
        $modules.load($files);
        $files.items = $factory({ classes: ["FileTree", "States"], base_class: "FileTree" });
        $log.log("items = ", $files.items);
        $files.scan();
    }
);