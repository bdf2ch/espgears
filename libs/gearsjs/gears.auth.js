"use strict";



/**
 * system.auth
 * Модуль авторизации
 */
var grAuth = angular.module("gears.auth", ["ngCookies", "ngRoute", "gears", "gears.data"])
    .config(function ($provide) {


        /**
         * $session
         * Сервис сессии текущего пользователя
         */
        $provide.factory("$session", ["$log", "$cookies", "$http", "$factory", "$storage", "$cookieStore", function ($log, $cookies, $http, $factory, $storage, $cookieStore) {
            var session = {};

            /**
             * Описание моделей данных
             */
            session.classes = {
                /**
                 * AppUser
                 * Набор свойств, описывающих текущего пользователя приложения
                 */
                AppUser: {
                    id: new Field({ source: "ID", value: 0, default_value: 0, backupable: true }),
                    groupId: new Field({ source: "USER_GROUP_ID", value: 0, default_value: 0, backupable: true }),
                    name: new Field({ source: "FNAME", value: "", default_value: "", backupable: true }),
                    fname: new Field({ source: "SNAME", value: "", default_value: "", backupable: true }),
                    surname: new Field({ source: "SURNAME", value: "", default_value: "", backupable: true }),
                    email: new Field({ source: "EMAIL", value: "", default_value: "", backupable: true }),
                    phone: new Field({ source: "PHONE", value: "", default_value: "", backupable: true }),
                    position: new Field({ source: "POSITION", value: "", default_value: "", backupable: true }),
                    fio: "",
                    permissions: {},

                    onInitModel: function () {
                        this.fio = this.surname.value + " " + this.name.value + " " + this.fname.value;
                    }
                },

                /**
                 * AppSession
                 * Набор свойст, описывающих текущую сессию приложения
                 */
                AppSession: {
                    token: new Field({ source: "TOKEN", value: 0, default_value: 0, backupable: true }),
                    started: new Field({ source: "STARTED", value: 0, default_value: 0, backupable: true }),
                    expires: new Field({ source: "EXPIRES", value: 0, default_value: 0, backupable: true })
                },

                /**
                 * PermissionRule
                 * Набор свойств и методов, описывающих правило доступа к данным
                 */
                PermissionRule: {
                    id: new Field({ source: "ID", value: 0, default_value: 0, backupable: true }),
                    parentId: new Field({ source: "PARENT_ID", value: 0, default_value: 0, backupable: true }),
                    code: new Field({ source: "CODE", value: "", default_value: "", backupable: true }),
                    title: new Field({ source: "TITLE", value: "", default_value: "", backupable: true }),
                    url: new Field({ source: "URL", value: "", default_value: "", backupable: true })
                },

                /**
                 * UserPermission
                 * Набор свойств и методов, описывающих право доступа пользователя к данным
                 */
                UserPermission: {
                    id: new Field({ source: "ID", value: 0, default_value: 0, backupable: true }),
                    permissionId: new Field({ source: "PERMISSION_ID", value: 0, default_value: 0, backupable: true }),
                    permissionCode: new Field({ source: "CODE", value: "", default_value: "", backupable: true }),
                    userId: new Field({ source: "USER_ID", value: 0, default_value: 0, backupable: true }),
                    enabled: new Field({ source: "ENABLED", value: false, default_value: false, backupable: true }),

                    onRestoreBackup: function () {
                        this.enabled.value = this.enabled.value === 1 ? true : false;
                    }
                }
            };


            /**
             * Приватные переменные сервиса
             */
            var currentUser = undefined;       // Пользователь приложения
            var currentSession = undefined;    // Пользовательская скссия приложения
            var sessionData = {};
            var permissions = {};

            /**
             * Коллбэки сервиса
             */
            session.onSuccessUserLogIn = function () {};
            session.onFailureUserLogIn = function () {};
            session.onSuccessUserLogOut = function () {};
            session.onFailureUserLogOut = function () {};
            session.onSuccessChangeUserPassword = function () {};
            session.onFailureChangeUserPassword = function () {};


            session.get = function () {
                return currentSession;
            };


            session.set = function (sess) {
                if (sess !== undefined) {
                    if (sess.__class__ !== undefined && sess.__class__ === "AppSession") {
                        currentSession = sess;
                    }
                }
            };


            session.fromAuthorizationResponse = function (data) {
                if (data !== undefined) {
                    if (data.token !== undefined && data.token !== "fail") {
                        currentSession = $factory({ classes: ["AppSession", "Model", "Backup"], base_class: "AppSession" });
                        //currentSession._model_.fromJSON(data);
                        currentSession._model_.fromAnother(data);
                        currentSession._backup_.setup();
                        $cookies.appsession = currentSession.token.value;
                        if (!$storage.set("appsession", session.get()._backup_.toString()))
                            $log.error("$session: Не удалось сохранить данные сессии в localStorage");
                    } else
                        session.onFailureUserLogIn();

                    if (data.id !== undefined && parseInt(data.id) !== 0) {
                        currentUser = $factory({ classes: ["AppUser", "Model", "Backup", "States"], base_class: "AppUser" });
                        //currentUser._model_.fromJSON(data);
                        currentUser._model_.fromAnother(data);
                        currentUser._backup_.setup();
                        if (!$storage.set("appuser", session.user.get()._backup_.toString()))
                            $log.error("$session: Не удалось сохранить данные пользователя приложения в localStorage");
                    } else
                        session.onFailureUserLogIn();

                    if (data.permissions !== undefined && data.permissions.length !== 0) {
                        var permissions = [];
                        angular.forEach(data.permissions, function (permission) {
                            var temp_permission = $factory({ classes: ["UserPermission", "Model", "Backup", "States"], base_class: "UserPermission" });
                            temp_permission._model_.fromJSON(permission);
                            temp_permission._backup_.setup();
                            permissions.push(temp_permission._backup_.data);
                        });
                        if (!$storage.set("userpermissions", JSON.stringify(permissions)))
                            $log.error("$session: Не удалось сохранить данные о правилах доступа к данным в localStorage");
                    } else
                        session.onFailureUserLogIn();

                    if (currentSession !== undefined && currentUser !== undefined)
                        session.onSuccessUserLogIn();
                } else
                    session.onFailureUserLogIn();
            };


            session.close = function (callback) {
                var params = {
                    action: "logOut",
                    data: {
                        sessionToken: session.get().token.value
                    }
                };
                $http.post("serverside/controllers/authorization.php", params)
                    .success(function (data) {
                        if (data !== undefined) {
                            $log.log(JSON.parse(data));
                            if (JSON.parse(data) === "success") {
                                $cookieStore.remove("appsession");
                                $storage.delete("appuser");
                                $storage.delete("appsession");
                                $storage.delete("userpermissions");
                                session.onSuccessUserLogOut();
                                if (callback !== undefined)
                                    callback(data);
                            }
                        } else
                            session.onFailureUserLogOut();
                    }
                );
            };


            session.appData = {

                get: function (dataName) {
                    var result = false;
                    if (dataName !== undefined) {
                        if (sessionData[dataName] !== undefined) {
                            result = sessionData[dataName];
                        }
                    }
                    return result;
                },

                set: function (dataName, data) {
                    var result = false;
                    if (dataName !== undefined && data !== undefined) {
                        sessionData[dataName] = data;
                        result = true;
                    }
                    return result;
                }

            };


            /**
             * Объект, содержащий методы для работы с текущим пользователем приложения
             */
            session.user = {

                /**
                 * Возвращает текущего пользователя приложения
                 * @returns {CurrentUser / undefined} - Возвращает текущего пользователя приложения
                 */
                get: function () {
                    return currentUser;
                },

                set: function (user) {
                    if (user !== undefined) {
                        if (user.__class__ !== undefined && user.__class__ === "AppUser") {
                            currentUser = user;
                        }
                    }
                },

                changePassword: function (password) {
                    if (password !== undefined && password !== "") {
                        var params = {
                            action: "changePassword",
                            data: {
                                userId: session.user.get().id.value,
                                password: password
                            }
                        };
                        $http.post("serverside/controllers/authorization.php", params)
                            .success(function (data) {
                                if (data !== undefined) {
                                    if (data["error_code"] !== undefined) {
                                        var db_error = $factory({ classes: ["DBError"], base_class: "DBError" });
                                        db_error.init(data);
                                        db_error.display();
                                        session.onFailureChangeUserPassword();
                                    } else {
                                        if (JSON.parse(data) === "success") {
                                            session.onSuccessChangeUserPassword();
                                        } else
                                            session.onFailureChangeUserPassword();
                                    }
                                }
                            }
                        );
                    }
                },

                /**
                 * Сохраняет данные текущего пользователя на сервере
                 * @returns {boolean} - Возвращает флаг, успешно ли завершена процедура
                 */
                save: function () {
                    var result = false;
                    if (session.user.loggedIn() === true) {
                        var user = session.user.get();
                        var params = {
                            action: "edit_user",
                            data: {
                                id: user.id.value,
                                name: user.name.value,
                                fname: user.fname.value,
                                surname: user.surname.value,
                                email: user.email.value,
                                phone: user.phone.value
                            }
                        };
                        $http.post("serverside/controllers/authorization.php", params)
                            .success(function (data) {
                                if (data !== undefined) {
                                    if (data["error_code"] === undefined) {
                                        $log.log(data);
                                        session.onSuccessEditUser(data);
                                        $cookies.appUser = currentUser._model_.toString();
                                        currentUser._states_.editing(false);
                                        currentUser._states_.changed(false);
                                        currentUser._backup_.setup();
                                        result = true;
                                    } else {
                                        var db_error = $factory({ classes: ["DBError"], base_class: "DBError" });
                                        db_error.init(data);
                                        db_error.display();
                                    }
                                }
                            }
                        );
                    }
                    return result;
                }

            };


            session.permissions = {
                get: function (code) {
                    if (code !== undefined) {
                        for (var permission in permissions) {
                            if (permission === code)
                                return permissions[permission];
                        }
                        return false;
                    } else {
                        return permissions;
                    }
                },

                set: function (perm) {
                    if (perm !== undefined) {
                        permissions = perm;
                    }
                }
            };



            session.onStart = function () {
                if ($storage.isDataExists("appuser") === true) {
                    var temp_user = $factory({ classes: ["AppUser", "Model", "Backup", "States"], base_class: "AppUser" });
                    temp_user._backup_.data = JSON.parse($storage.get("appuser"));
                    temp_user._backup_.restore();
                    session.user.set(temp_user);
                }
                if ($storage.isDataExists("appsession") === true) {
                    var temp_session = $factory({ classes: ["AppSession", "Model", "Backup", "States"], base_class: "AppSession" });
                    temp_session._backup_.data = JSON.parse($storage.get("appsession"));
                    temp_session._backup_.restore();
                    session.set(temp_session);
                }
                if ($storage.isDataExists("userpermissions") === true) {
                    var parsed_permissions = {};
                    angular.forEach(JSON.parse($storage.get("userpermissions")), function (permission) {
                        var temp_permission = $factory({ classes: ["UserPermission", "Model", "Backup", "States"], base_class: "UserPermission" });
                        temp_permission._backup_.data = permission;
                        temp_permission._backup_.restore();
                        parsed_permissions[temp_permission.permissionCode.value] = temp_permission;
                    });

                    session.permissions.set(parsed_permissions);
                    $log.log("PERMISSIONS = ", session.permissions.get());
                }
            };



            return session;
        }]);


        /**
         * $authorization
         * Сервис авторизации
         */
        $provide.factory("$authorization", ["$log", "$http", "$session", "$factory", function ($log, $http, $session, $factory) {
            var auth = {};

            auth.username = "";                     // Имя пользователя
            auth.password = "";                     // Пароль пользователя
            auth.errors = {
                username: [],                       // Массив ошибок имени пользователя
                password: []                        // Массив ошибок пароля пользователя
            };


            /**
             * Приватные переменные сервиса
             */
            var isInRemindPasswordMode = false;
            var isSendingInProgress = false;
            var isPasswordSent = false;


            /**
             * Коллбэки сервиса
             */
            auth.onSuccessLogIn = function () {};
            auth.onFailureLogIn = function () {};
            auth.onSuccessRemindPassword = function () {};
            auth.onFailureRemindPassword = function () {};


            /**
             * Валидация имени пользователя и пароля
             */
            auth.logIn = function () {
                auth.errors.username.splice(0, auth.errors.username.length);
                auth.errors.password.splice(0, auth.errors.password.length);

                if (auth.username === "")
                    auth.errors.username.push("Вы не указали имя пользователя");
                if (auth.password === "")
                    auth.errors.password.push("Вы не указали пароль");

                if (auth.errors.username.length === 0 && auth.errors.password.length === 0) {
                    isSendingInProgress = true;
                    var params = {
                        action: "logIn",
                        data: {
                            username: auth.username,
                            password: auth.password
                        }
                    };
                    $http.post("serverside/controllers/authorization.php", params)
                        .success(function (data) {
                            if (data !== undefined) {
                                $log.log(data);
                                if (data["error_code"] !== undefined) {
                                    var db_error = $factory({classes: ["DBError"], base_class: "DBError"});
                                    db_error.init(data);
                                    db_error.display();
                                } else {
                                    if (data.token !== undefined && (data.token === "fail")) {
                                        auth.errors.username.push("Пользователь не найден");
                                        auth.onFailureLogIn()
                                    } else {
                                        $session.fromAuthorizationResponse(data);
                                        auth.onSuccessLogIn();
                                    }
                                }
                            } else
                                auth.onFailureLogIn();
                            isSendingInProgress = false;
                        }
                    );
                }

            };


            auth.remindPassword = function () {
                auth.errors.username.splice(0, auth.errors.username.length);
                auth.errors.password.splice(0, auth.errors.password.length);

                if (auth.username === "")
                    auth.errors.username.push("Вы не указали имя пользователя");

                if (auth.errors.username.length === 0 && auth.errors.password.length === 0) {
                    isSendingInProgress = true;
                    var params = {
                        action: "remindPassword",
                        data: {
                            username: auth.username
                        }
                    };
                    $http.post("serverside/controllers/authorization.php", params)
                        .success(function (data) {
                            if (data !== undefined) {
                                $log.log(data);
                                if (data["error_code"] !== undefined) {
                                    var db_error = $factory({classes: ["DBError"], base_class: "DBError"});
                                    db_error.init(data);
                                    db_error.display();
                                } else {
                                    if (JSON.parse(data) === "fail") {
                                        auth.errors.username.push("Пользователь не найден");
                                        auth.onFailureRemindPassword();
                                    } else {
                                        isPasswordSent = true;
                                        auth.password = "";
                                        auth.onSuccessRemindPassword();
                                    }
                                }
                            } else
                                auth.onFailureRemindPassword();
                            isSendingInProgress = false;
                        }
                    );
                }
            };


            auth.reset = function () {
                auth.username = "";
                auth.password = "";
                auth.errors.username.splice(0, auth.errors.username.length);
                auth.errors.password.splice(0, auth.errors.password.length);
            };



            auth.remindPasswordMode = function (flag) {
                if (flag !== undefined && typeof flag === "boolean") {
                    auth.errors.username.splice(0, auth.errors.username.length);
                    auth.errors.password.splice(0, auth.errors.password.length);
                    isPasswordSent = false;
                    isInRemindPasswordMode = flag;
                }
                return isInRemindPasswordMode;
            };


            auth.isSendingInProgress = function () {
                return isSendingInProgress;
            };

            auth.isPasswordSent = function () {
                return isPasswordSent;
            };

            return auth;
        }]);

    }
)
    .run(function ($modules, $rootScope, $authorization, $session) {
        $modules.load($authorization);
        $modules.load($session);
        //$session.init();
        $rootScope.authorization = $authorization;
        $rootScope.session = $session;
    });



/**
 * Контроллер формы авторизации пользователя
 */
grAuth.controller("AuthorizationController", ["$log", "$scope", "$authorization", function ($log, $scope, $authorization) {
    $scope.auth = $authorization;
}]);
