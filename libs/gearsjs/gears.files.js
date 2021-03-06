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
                 * Набор свойств, описывающих папку
                 */
                Folder: {
                    title: new Field({ source: "title" }),
                    path: new Field({ source: "path", value: "", default_value: "" }),
                    isEmpty: new Field({ source: "isEmpty", value: true, default_value: true }),
                    items: $factory({ classes: ["Collection"], base_class: "Collection" }),
                    parentPath: "",
                    isExpanded: false
                },

                FileTree: {
                    items: [],
                    root: [],

                    appendToRoot: function (file) {
                        if (file !== undefined) {
                            this.root.push(file);
                            this.items.push(file);
                        }
                    },

                    appendToFolder: function (path, file) {
                        if (path !== undefined && file !== undefined) {
                            angular.forEach(this.items, function (item) {
                                if (item.path.value === path && item.__class__ === "Folder") {
                                    item.items.append(file);
                                    item.parentPath = path;
                                    item.isExpanded = true;
                                    files.items.items.push(file);
                                }
                            });
                        }
                    },

                    getFolderContent: function (path) {
                        var result = false;
                        if (path !== undefined) {
                            angular.forEach(this.items, function (item) {
                                if (item.__class__ === "Folder" && item.path.value === path) {
                                    $log.log("folder = ", item.title.value);
                                    result = item.items;
                                }
                            });
                        }
                        return result;
                    },

                    expand: function (path) {
                        if (path !== undefined) {
                            angular.forEach(this.items, function (item) {
                                if (item.__class__ === "Folder" && item.path.value === path) {
                                    if (item.items.size() === 0) {
                                        files.scan(path);
                                    }
                                    item.isExpanded = true;
                                }
                            });
                        }
                    },

                    collapse: function (path) {
                        if (path !== undefined) {
                            angular.forEach(this.items, function (item) {
                                if (item.path.value === path) {
                                    item.isExpanded = false;
                                }
                            });
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
                            //result.isExpanded = false;
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
                                    if (path !== undefined)
                                        files.items.appendToFolder(path, temp_file);
                                    else
                                        files.items.appendToRoot(temp_file);
                                    files.onSuccessAppendFile(temp_file);
                                });
                                files.onSuccessScanFolder(data);
                            }
                        }
                    }
                );
            };


            files.add = function () {

            };

            /**
             * Коллбэк, вызываемый при сканированиее папки на наличие вложений
             * @param data {JSON} - Ответ сервера
             */
            files.onSuccessScanFolder = function (data) {
                $log.log("onSuccessScanFolder called, " + data.length + " items recieved");
            };

            /**
             * Коллбэк, вызываемый при добавлении файла, полученного при сканированиее
             * @param file {File} - Добавленный файл
             */
            files.onSuccessAppendFile = function (file) {
                $log.log("onSuccessAppendFile called, " + file.title.value + " added");
            };


            /**
             * Коллбэк, вызываемый при добавлении папки
             */
            files.onSuccessAddFolder = function () {};

            /**
             * Коллбэк, вызываемый при загрузке файла на сервер
             */
            files.onSuccessUploadFile = function () {};

            /**
             * Коллбэк, вызываемый при переименовании файла или папки
             */
            files.onSuccessRename = function () {};


            return files;
        }]);

    })

    .directive("upload", ["$log", "$http", function ($log, $http) {
        return {
            restrict: "A",
            scope: {
                uploadAction: "@"
            },
            link: function (scope, element, attrs) {
                var files = scope.files = [];

                $log.log("attrs = ", attrs);

                element.bind("change", function () {
                    scope.files = element[0].files;

                    scope.$apply();
                    $log.log("upload files = ", scope.files);
                    $log.log("action = ", scope.uploadAction);
                    upload();
                });

                var upload = function () {
                    $http.post(scope.uploadAction, {files: scope.files})
                        .success(function (data) {
                            $log.log(data);
                        }
                    );
                };
            }
        }
    }])
    /*
    .directive('attachable', ["FileUploader", "$log", function(FileUploader, $log) {
        return {
            restrict: 'E',
            replace: true,
            scope: {
                url: "@",
                postData: "=",
                title: "@",
                init: "=",
                onComplete: "="
            },
            template: '<div><label for="upload" class="label-button">{{title}}</label><input type="file" name="upload" id="upload" class="centered" nv-file-select uploader="uploader"/></div>',
            compile: function() {
                return {
                    pre: function(scope, element, attrs) {
                        var uploader = scope.uploader = new FileUploader({
                            url: scope.url
                        });

                        $log.log(uploader);

                        uploader.onAfterAddingFile = function (fileItem) {
                            fileItem.formData = scope.postData;
                            console.info('onAfterAddingFile', fileItem.formData);
                            uploader.url = scope.url;
                            $log.log("url = ", uploader.url);
                            uploader.uploadAll();
                        };

                        uploader.onCompleteItem = function(item, response, status, headers) {
                            if (scope.onComplete !== undefined)
                                scope.onComplete(response);
                            $log.log();
                        };
                    },
                    post: function(scope, element, attrs) {
                        var uploader = scope.uploader = new FileUploader({
                            url: scope.url
                        });

                    }
                };
            }
        }
    }])
    */

    .directive("uploader", ["$log", "$http", "$parse", function ($log, $http, $parse) {
        return {
            restrict: "A",
            scope: {
                uploaderUrl: "@",
                uploaderData: "=",
                uploaderOnCompleteUpload: "=",
                uploaderOnBeforeUpload: "="
            },
            link: function (scope, element, attrs) {
                var fd = new FormData();

                /**
                 * Отслеживаем выбор файла для загрузки
                 */
                element.bind("change", function () {
                    //var fd = new FormData();
                    angular.forEach(element[0].files, function (file) {
                        $log.log(file);
                        fd.append("file", file);
                    });

                    /* Если задан коллбэк onBeforeUpload - выполняем его */
                    $log.log(scope.uploaderOnBeforeUpload);
                    if (scope.uploaderOnBeforeUpload !== undefined) {
                        scope.$apply(scope.uploaderOnBeforeUpload);
                        scope.upload();
                    } else
                        scope.upload();

                    /* Если заданы данные для отправки на сервер - добавляем их в данные формы для отправки */
                    if (scope.uploaderData !== undefined) {
                        $log.log(scope.uploaderData);
                        for (var param in scope.uploaderData) {
                            fd.append(param, scope.uploaderData[param]);
                        }
                    }

                });

                /**
                 * Отправляет данные на сервер
                 */
                scope.upload = function () {
                    element.prop("disabled", "disabled");
                    $http.post(scope.uploaderUrl, fd,
                        {
                            transformRequest: angular.identity,
                            headers: {
                                "Content-Type": undefined
                            }
                        }
                    ).success(function (data) {
                            $log.log(data);
                            element.prop("disabled", "");
                            if (scope.uploaderOnCompleteUpload !== undefined)
                                scope.uploaderOnCompleteUpload(data);
                            fd = new FormData();
                        }
                    );
                };

            }
        }
    }])


    .run(function ($modules, $files, $factory, $log) {
        $modules.load($files);
        $files.items = $factory({ classes: ["FileTree", "States"], base_class: "FileTree" });
        $log.log("items = ", $files.items);
        //$files.scan();
    }
);