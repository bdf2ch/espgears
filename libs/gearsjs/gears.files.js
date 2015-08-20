"use strict";



var grFiles = angular.module("gears.files", [])
    .config(function ($provide) {

        $provide.factory("$files", ["$log", "$http", "$factory", function ($log, $http, $factory) {
            var files = {};

            files.classes = {
                /**
                 * File
                 * ����� �������, ����������� ����
                 */
                File: {
                    title: new Field({ source: "title", value: "", default_value: "", backupable: true, required: true }),
                    size: new Field({ source: "size", value: 0, default_value: 0 }),
                    path: new Field({ source: "path", value: "", default_value: "" })
                },

                /**
                 * Folder
                 * ����� ������, ����������� �����
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


            files.items = $factory({ classes: ["Collection", "States"], base_class: "Collection" });


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
                                        files.items.append(temp_file);
                                    });
                                    $log.log("files answer = ", files.items.items);
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
    .run(function ($modules, $files) {
        $modules.load($files);
        $files.scan();
    }
);