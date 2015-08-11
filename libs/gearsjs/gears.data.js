"use strict";


var grData = angular.module("gears.data", [])
    .config(function ($provide) {


        /**
         * $storage
         * Сервис для доступа к localStorage
         */
        $provide.factory("$storage", ["$log", "$window", function ($log, $window) {
            var storage = {};

            storage.isLocalStorageEnabled = false;              // Флаг, сигнализирующий, доступен ли localStorage


            /**
             * Проверяет, доступен ли localStorage
             * @returns {boolean}
             */
            storage.init = function () {
                var result = false;
                if ($window.localStorage !== undefined) {
                    storage.isLocalStorageEnabled = true;
                    result = true;
                }
                return result;
            };


            /**
             * Возвращает флаг, существуют ли данные с именем dataName в localStorage
             * @param dataName {String} - Наименование данных
             * @returns {boolean}
             */
            storage.isDataExists = function (dataName) {
                var result = false;
                if (storage.isLocalStorageEnabled === true) {
                    if (dataName !== undefined) {
                        if ($window.localStorage[dataName] !== undefined)
                            result = true;
                    }
                }
                return result;
            };


            /**
             * Возвращает данные с именем dataName из localStorage
             * @param dataName {String} - Наименование данных
             * @returns {boolean}
             */
            storage.get = function (dataName) {
                var result = false;
                if (storage.isLocalStorageEnabled === true) {
                    if (dataName !== undefined) {
                        if (storage.isDataExists(dataName) === true) {
                            result = $window.localStorage[dataName];
                        }
                    }
                }
                return result;
            };


            /**
             * Сохраняет данные data с именем dataName в localStorage
             * @param dataName {String} - Наименование данных
             * @param data {Object} - Данные, которые требуется поместить в localStorage
             */
            storage.set = function (dataName, data) {
                var result = false;
                if (storage.isLocalStorageEnabled === true) {
                    if (dataName !== undefined && data !== undefined) {
                        $window.localStorage[dataName] = data.toString();
                        result = true;
                    }
                }
                return result;
            };

            return storage;
        }]);



        /**
         * $vcs
         * Сервис контроля версий данных
         */
        $provide.factory("$vcs", ["$log", "$cookies", "$http", "$storage", function ($log, $cookies, $http, $storage) {
            var vcs = {};

            vcs.items = [];
            vcs.localVersions = undefined;       // Объект с информацией о локальных версиях данных
            vcs.remoteVersions = undefined;      // Объект с информацией об удаленных версиях данных
            vcs.sendingInProgress = false;       // Флаг состояния отправки данных на сервер


            /**
             * Инициализация сервиса
             * @returns {boolean / Object}
             */
            vcs.init = function () {
                var result = true;
                vcs.localVersions = {};
                vcs.remoteVersions = {};

                /* Проверяем, доступен ли localStorage */
                if ($storage.isLocalStorageEnabled === true) {
                    /* Проверяем, есть ли в localStorage информация о версиях данных */
                    if ($storage.isDataExists("$vcs_versions") === true) {
                        vcs.localVersions = JSON.parse($storage.get("$vcs_versions"));
                        result = vcs.localVersions;
                    }
                }

                /* Если в куках есть информация о версиях данных на сервере */
                if ($cookies.vcs_versions !== undefined) {
                    vcs.remoteVersions = JSON.parse($cookies.vcs_versions);
                }

                return result;
            };


            vcs.add = function () {

            };


            /**
             * Возвращает версию данных из объекта vcs.localVersions
             * @param dataId - Идентификатор данных
             * @returns {boolean / Number} - Возвращает версию данных, либо false в случае, если данных dataId нет
             */
            vcs.getLocalVersion = function (dataId) {
                var result = false;
                if (vcs.localVersions !== undefined) {
                    if (dataId !== undefined) {
                        if (vcs.localVersions[dataId] !== undefined) {
                            result = parseInt(vcs.localVersions[dataId]);
                        }
                    }
                }
                return result;
            };


            /**
             * Возвращает версию данных из объекта vcs.remoteVersions
             * @param dataId - Идентификатор данных
             * @returns {boolean / Number} - Возвращает версию данных, либо false в случае, если данных dataId нет
             */
            vcs.getRemoteVersion = function (dataId) {
                var result = false;
                if (vcs.remoteVersions !== undefined) {
                    if (dataId !== undefined) {
                        if (vcs.remoteVersions[dataId] !== undefined) {
                            result = parseInt(vcs.remoteVersions[dataId]);
                        }
                    }
                }
                return result;
            };


            /**
             * Устанавливает версию данных из локального объекта vcs.versions
             * @param dataId - Идентификатор данных
             * @param version - Версия данных
             * @returns {boolean} - Возвращает флаг выполнения/не выполнения установки версии данных
             */
            vcs.setLocalVersion = function (dataId, version) {
                var result = false;
                if (vcs.localVersions !== undefined) {
                    if (dataId !== undefined && version !== undefined) {
                        if (vcs.localVersions[dataId] !== undefined) {
                            vcs.localVersions[dataId] = version;
                            /* Если доступен localStorage - сохраняем в него информацию о версиях данных */
                            if ($storage.isLocalStorageEnabled === true) {
                                $storage.set("$vcs_versions", vcs.localVersions);
                            }
                            result = true;
                        }
                    }
                }
                return result;
            };


            /**
             * Отправляет информацию о версиях данных на сервер контроллеру
             */
            vcs.send = function (dataId) {
                var result = false;
                vcs.sendingInProgress = true;
                $http.post("", vcs.localVersions)
                    .success(function (data) {
                        /* Если сервер не вернул ошибку */
                        if (parseInt(data) !== -1) {
                            /* Если доступен localStorage - сохраняем в него информацию о версиях данных */
                            if ($storage.isLocalStorageEnabled === true) {
                                $storage.set("$vcs_versions", vcs.localVersions);
                                //$storage.set("$vcs_data", );
                            }
                            vcs.sendingInProgress = false;
                            result = true;
                        }
                    }
                );
                return result;
            };

            return vcs;
        }]);

    }).run(function ($storage) {
        $storage.init();
    });