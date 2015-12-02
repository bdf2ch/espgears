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
                    id: new Field({ source: "ID", value: 0, default_value: 0 }),
                    groupId: new Field({ source: "USER_GROUP_ID", value: 0, default_value: 0, backupable: true }),
                    name: new Field({ source: "FNAME", value: "", default_value: "", backupable: true }),
                    fname: new Field({ source: "SNAME", value: "", default_value: "", backupable: true }),
                    surname: new Field({ source: "SURNAME", value: "", default_value: "", backupable: true }),
                    email: new Field({ source: "EMAIL", value: "", default_value: "", backupable: true }),
                    phone: new Field({ source: "PHONE", value: "", default_value: "", backupable: true }),
                    position: new Field({ source: "POSITION", value: "", default_value: "", backupable: true }),
                    fio: "",

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
                }
            };


            /**
             * Приватные переменные сервиса
             */
            var currentUser = undefined;       // Пользователь приложения
            var currentSession = undefined;    // Пользовательская скссия приложения


            /**
             * Коллбэки сервиса
             */
            session.onSuccessUserLogIn = function () {};
            session.onFailureUserLogIn = function () {};
            session.onSuccessUserLogOut = function () {};
            session.onFailureUserLogOut = function () {};


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


            session.fromResponse = function (data) {
                if (data !== undefined) {
                    if (data["TOKEN"] !== undefined && data["TOKEN"] !== "fail") {
                        currentSession = $factory({ classes: ["AppSession", "Model", "Backup"], base_class: "AppSession" });
                        currentSession._model_.fromJSON(data);
                        currentSession._backup_.setup();
                        $cookies.appsession = currentSession.token.value;
                        if (!$storage.set("appsession", session.get()._backup_.toString()))
                            $log.error("$session: Не удалось сохранить данные сессии в localStorage");
                    } else
                        session.onFailureUserLogIn();

                    if (data["ID"] !== undefined && parseInt(data["ID"]) !== 0) {
                        currentUser = $factory({ classes: ["AppUser", "Model", "Backup", "States"], base_class: "AppUser" });
                        currentUser._model_.fromJSON(data);
                        currentUser._backup_.setup();
                        if (!$storage.set("appuser", session.user.get()._backup_.toString()))
                            $log.error("$session: Не удалось сохранить данные пользователя приложения в localStorage");
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
                                $storage.set("appuser", undefined);
                                $storage.set("appsession", undefined);
                                session.onSuccessUserLogOut();
                                if (callback !== undefined)
                                    callback(data);
                            }
                        } else
                            session.onFailureUserLogOut();
                    }
                );
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
            auth.sendingInProgress = false;         // Флаг, сигнализирующий, что выполняется отправка данных на сервер
            auth.isAuthSuccessed = false;           // Флаг, сигнализирующий, что авторизация завершилась успешно
            auth.isAuthFailed = false;              // Флаг, сигнализирующий, что авторизация завершилась ошибкой
            auth.inRemindPasswordMode = false;       // Флаг, сигнализирующий, что активирован режим напоминания пароля
            auth.errors = {
                username: [],                       // Массив ошибок имени пользователя
                password: []                        // Массив ошибок пароля пользователя
            };


            /**
             * Валидация имени пользователя и пароля
             */
            auth.logIn = function (callback) {
                /* Сброс флагов состояний */
                auth.isAuthSuccessed = false;
                auth.isAuthFailed = false;

                /* Очистка массивов с ошибками */
                auth.errors.username.splice(0, auth.errors.username.length);
                auth.errors.password.splice(0, auth.errors.password.length);

                if (auth.inRemindPasswordMode === true) {
                    /* Проверка корректности ввода имени пользователя */
                    if (auth.username === "")
                        auth.errors.username.push("Вы не указали имя пользователя");
                } else {
                    /* Проверка корректности ввода имени пользователя */
                    if (auth.username === "")
                        auth.errors.username.push("Вы не указали имя пользователя");

                    /* Проверка корректности ввода пароля */
                    if (auth.password === "")
                        auth.errors.password.push("Вы не указали пароль");
                }

                /* Если ошибок нет, то отправляем данные на сервер */
                if (auth.errors.username.length === 0 && auth.errors.password.length === 0 )
                    auth.send(callback);
            };

            auth.reset = function () {
                auth.username = "";
                auth.password = "";
                auth.errors.username.splice(0, auth.errors.username.length);
                auth.errors.password.splice(0, auth.errors.password.length);
            };


            /**
             * Отправляет имя пользователя и пароль на сервер
             */
            auth.send = function (callback) {
                var act = auth.inRemindPasswordMode === true ? "remindPassword" : "logIn";
                var params = {
                    action: act,
                    data: {
                        username: auth.username,
                        password: auth.password
                    }
                };
                auth.sendingInProgress = true;
                $http.post("serverside/controllers/authorization.php", params)
                    .success(function (data) {
                        if (data !== undefined) {
                            $log.log(data);

                            if (data["error_code"] === undefined) {
                                if (parseInt(data) === -1) {
                                    auth.errors.username.push("Пользователь не найден");
                                    auth.isAuthFailed = true;
                                } else {
                                    if (data["user"] !== undefined) {
                                        var temp_user = $factory({ classes: ["AppUser", "Model", "Backup", "States"], base_class: "AppUser" });
                                        temp_user._model_.fromJSON(data);
                                        temp_user._backup_.setup();
                                        $session.user = temp_user;
                                        auth.isAuthSuccessed = true;
                                    }
                                    //if (data["data"] !== undefined) {
                                        callback(data);
                                    //}
                                }
                            } else {
                                var db_error = $factory({ classes: ["DBError"], base_class: "DBError" });
                                db_error.init(data);
                                db_error.display();
                                auth.isAuthFailed = true;
                            }

                        }
                        auth.sendingInProgress = false;
                    })
            };


            auth.remindPasswordMode = function () {
                auth.errors.username.splice(0, auth.errors.username.length);
                auth.errors.password.splice(0, auth.errors.password.length);
                auth.inRemindPasswordMode = !auth.inRemindPasswordMode;
                return auth.inRemindPasswordMode;
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
