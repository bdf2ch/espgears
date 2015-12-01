"use strict";



/**
 * system.auth
 * Модуль авторизации
 */
var grAuth = angular.module("gears.auth", ["ngCookies", "ngRoute", "gears"])
    .config(function ($provide) {


        /**
         * $session
         * Сервис сессии текущего пользователя
         */
        $provide.factory("$session", ["$log", "$cookies", "$http", "$factory", function ($log, $cookies, $http, $factory) {
            var session = {};


            /**
             * Описание моделей данных
             */
            session.classes = {
                /**
                 * CurrentUser
                 * Набор свойств, описывающих текущего пользователя приложения
                 */
                AppUser: {
                    id: new Field({ source: "id", value: 0, default_value: 0 }),
                    name: new Field({ source: "name", value: "", default_value: "", backupable: true }),
                    fname: new Field({ source: "fname", value: "", default_value: "", backupable: true }),
                    surname: new Field({ source: "surname", value: "", default_value: "", backupable: true }),
                    email: new Field({ source: "email", value: "", default_value: "", backupable: true }),
                    phone: new Field({ source: "phone", value: "", default_value: "", backupable: true })
                },

                /**
                 * CurrentSession
                 * Набор свойст, описывающих текущую сессию приложения
                 */
                AppSession: {
                    token: new Field({ source: "TOKEN", value: 0, default_value: 0 }),
                    //userId: new Field({ source: "user_id", value: 0, default_value: 0 }),
                    started: new Field({ source: "STARTED", value: 0, default_value: 0 }),
                    expires: new Field({ source: "EXPIRES", avalue: 0, default_value: 0 }),

                    onInitModel: function () {
                        $log.log("CURRENT SESSION INIT FUNCTION");
                        //this.startedAt = new moment().unix();
                    }
                }
            };


            /**
             * Приватные переменные сервиса
             */
            var currentUser = undefined;               // Пользователь
            var currentSession = undefined;
            var sessionId = undefined;                 // Идентификатор сессии
            var startedAt = 0;                  // Время начала сессии в формате Unix
            var isLoggedIn = false;


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


                /**
                 * Устанавливает пользователя текущей сессии
                 * @param newUser {CurrentUser} - Объект, описывающий текущего пользователя приложения
                 * @returns {CurrentUser / boolean} - Возвращает текущего пользователя приложения
                 */
                set: function (newUser) {
                    var result = false;
                    if (newUser !== undefined) {
                        if (newUser.__class__ !== undefined) {
                            if (newUser.__class__ === "AppUser") {
                                currentUser = newUser;
                                //$cookies.appUser = currentUser._model_.toString();
                                isLoggedIn = true;
                                result = currentUser;
                                session.onSuccessSetUser();
                            }
                        }
                    }
                    return result;
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
                },

                /**
                 * Возвращает флаг, авторизован ли пользователь в приложении
                 * @returns {boolean} - Возвращает флаг, авторизован ли пользователь в приложении
                 */
                loggedIn: function () {
                    return isLoggedIn;
                },

                /**
                 * Завершает сеанс текущего пользователя приложения
                 * @returns {boolean} - Возвращает флаг, успешно ли завершилась процедура
                 */
                logOut: function () {
                    if (isLoggedIn === true) {
                        currentUser = undefined;
                        currentSession = undefined;
                        $cookies.appUser = undefined;
                        isLoggedIn = false;
                        session.onSuccessUserLogOut();
                    }
                    return isLoggedIn;
                }

            };


            /**
             * Объект, содержащий методы дял работы с текущей сессией пользователя приложения
             */
            session.session = {
                /**
                 * Возвращает текущую сессию пользователя приложения
                 * @returns {undefined}
                 */
                get: function () {
                    return session;
                },

                close: function () {

                }
            };


            /**
             * Колбэк, вызывающийся при установке пользователя в результате вызова user.set()
             */
            session.onSuccessSetUser = function () {
                $log.log("user.set() callback");
            };

            /**
             * Колбэк, вызываемый при инициализации пользователя из cookie
             */
            session.onSuccessInitUser = function () {
                $log.log("init user callback");
            };


            /**
             * Колбэк, вызывающийся при изменении данных пользователя
             * @param data {object} - Данные, которые вернул сервер в результате вызова user.edit()
             */
            session.onSuccessEditUser = function (data) {
                $log.log("user.edit() callback");
            };


            /**
             * Колбэк, вызываемый при
             */
            session.onSuccessUserLogOut = function () {
                $log.log("user.logOut() callback");
            };


            /**
             * Инициализирует сервис
             */
            session.init = function (data) {
                if (data !== undefined) {
                    if (data["session"] !== undefined && data["session"]["token"] !== "fail") {
                        currentSession = $factory({ classes: ["AppSession", "Model"], base_class: "AppSession" });
                        currentSession._model_.fromJSON(data["session"]);
                        $cookies.espsessionid = currentSession.token.value;
                    }
                    if (data["user"] !== undefined) {
                        currentUser = $factory({ classes: ["AppUser", "Model", "Backup", "States"], base_class: "AppUser" });
                        currentUser._model_.fromJSON(data["user"]);
                        currentUser._backup_.setup();
                    }
                }
                session.onSuccessInitUser();
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
                                        var temp_user = $factory({ classes: ["CurrentUser", "Model", "Backup", "States"], base_class: "CurrentUser" });
                                        temp_user._model_.fromJSON(data["user"]);
                                        temp_user._backup_.setup();
                                        $session.user.set(temp_user);
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
