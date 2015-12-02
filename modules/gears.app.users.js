"use strict";


var users = angular.module("gears.app.users", [])
    .config(function ($provide) {

        /**
         * $users
         * Сервис, содержащий функционал для работы с пользователями системы
         */
        $provide.factory("$users", ["$log", "$http", "$factory", "$rootScope", function ($log, $http, $factory, $rootScope) {
            var users = {};


            /**
             * Наборы свойст и методов, описывающих модели данных
             */
            users.classes = {
                /**
                 * User
                 * Набор свойств, описывающих пользователя
                 */
                User: {
                    id: new Field({ source: "ID", value: 0, default_value: 0 }),
                    groupId: new Field({ source: "USER_GROUP_ID", value: 0, default_value: 0, backupable: true, required: true }),
                    name: new Field({ source: "FNAME", value: "", default_value: "", backupable: true, required: true }),
                    fname: new Field({ source: "SNAME", value: "", default_value: "", backupable: true, required: true}),
                    surname: new Field({ source: "SURNAME", value: "", default_value: "", backupable: true, required: true }),
                    email: new Field({ source: "EMAIL", value: "", default_value: "", backupable: true, required: true }),
                    phone: new Field({ source: "PHONE", value: "", default_value: "", backupable: true }),
                    position: new Field({ source: "POSITION", value: "", default_value: "", backupable: true }),
                    fio: "",
                    short: "",

                    onInitModel: function () {
                        this.fio = this.surname.value + " " + this.name.value + " " + this.fname.value;
                        this.short = this.surname.value + " " + this.name.value.toUpperCase()[0] + ". " + this.fname.value.toString().toUpperCase()[0] + ".";
                    }
                },

                /**
                 * UserGroup
                 * Набор свойст, описывающих группу пользователей
                 */
                UserGroup: {
                    id: new Field({ source: "ID", value: 0, default_value: 0 }),
                    title: new Field({ source: "TITLE", value: "", default_value: "", backupable: true, required: true }),
                    description: new Field({ source: "DESCRIPTION", value: "", default_value: "", backupable: true })
                }
            };


            users.users = $factory({ classes: ["Collection", "States"], base_class: "Collection" });
            users.groups = $factory({ classes: ["Collection", "States"], base_class: "Collection" });

            users.getUserGroups = function () {
                users.groups._states_.loaded(false);
                $http.post("serverside/controllers/users.php", { action: "getUserGroups" })
                    .success(function (data) {
                        if (data !== undefined) {
                            if (data["error_code"] !== undefined) {
                                var db_error = $factory({ classes: ["DBError"], base_class: "DBError" });
                                db_error.init(data);
                                db_error.display();
                            } else {
                                angular.forEach(data, function (group) {
                                    var temp_group = $factory({ classes: ["UserGroup", "Model", "Backup", "States"], base_class: "UserGroup" });
                                    temp_group._model_.fromJSON(group);
                                    temp_group._backup_.setup();
                                    users.groups.append(temp_group);
                                });
                            }
                        }
                        users.groups._states_.loaded(true);
                        $log.log("user groups = ", users.groups.items);
                    }
                );
            };


            users.addGroup = function (group, callback) {
                if (group !== undefined) {
                    var params = {
                        action: "addGroup",
                        data: {
                            title: group.title.value,
                            description: ""
                        }
                    };
                    $http.post("serverside/controllers/users.php", params)
                        .success(function (data) {
                            if (data !== undefined) {
                                if (data["error_code"] !== undefined) {
                                    var db_error = $factory({ classes: ["DBError"], base_class: "DBError" });
                                    db_error.init(data);
                                    db_error.display();
                                } else {
                                    var temp_group = $factory({ classes: ["UserGroup", "Model", "Backup", "States"], base_class: "UserGroup" });
                                    temp_group._model_.fromJSON(data);
                                    temp_group._backup_.setup();
                                    users.groups.append(temp_group);
                                    if (callback !== undefined)
                                        callback(temp_group);
                                }
                            }
                        }
                    );
                }
            };


            users.editGroup = function (group, callback) {
                if (group !== undefined) {
                    var params = {
                        action: "editGroup",
                        data: {
                            groupId: group.id.value,
                            title: group.title.value,
                            description: group.description.value
                        }
                    };
                    $http.post("serverside/controllers/users.php", params)
                        .success(function (data) {
                            if (data !== undefined) {
                                if (data["error_code"] !== undefined) {
                                    var db_error = $factory({ classes: ["DBError"], base_class: "DBError" });
                                    db_error.init(data);
                                    db_error.display();
                                } else {
                                    group._backup_.setup();
                                    if (callback !== undefined)
                                        callback(data);
                                }
                            }
                        }
                    );
                }
            };


            users.deleteGroup = function (groupId, callback) {
                if (groupId !== undefined) {
                    var params = {
                        action: "deleteGroup",
                        data: {
                            groupId: groupId
                        }
                    };
                    $http.post("serverside/controllers/users.php", params)
                        .success(function (data) {
                            if (data !== undefined) {
                                if (data["error_code"] !== undefined) {
                                    var db_error = $factory({ classes: ["DBError"], base_class: "DBError" });
                                    db_error.init(data);
                                    db_error.display();
                                } else {
                                    angular.forEach(users.users.items, function (user) {
                                        if (user.groupId.value === groupId) {
                                            user.groupId.value = 0;
                                        }
                                    });
                                    users.groups.delete("id", groupId);
                                    if (callback !== undefined)
                                        callback(data);
                                }
                            }
                        }
                    );
                }
            };


            users.getUsers = function () {
                users.users._states_.loaded(false);
                $http.post("serverside/controllers/users.php", { action: "getUsers" })
                    .success(function (data) {
                        if (data !== undefined) {
                            if (data["error_code"] !== undefined) {
                                var db_error = $factory({ classes: ["DBError"], base_class: "DBError" });
                                db_error.init(data);
                                db_error.display();
                            } else {
                                angular.forEach(data, function (user) {
                                    var temp_user = $factory({ classes: ["User", "Model", "Backup", "States"], base_class: "User" });
                                    temp_user._model_.fromJSON(user);
                                    users.users.append(temp_user);
                                });
                            }
                            $log.log("users = ", users.users.items);
                        }
                        users.users._states_.loaded(true);
                    }
                );
            };


            users.addUser = function (user, password, callback) {
                if (user !== undefined && password !== undefined) {
                    var params = {
                        action: "addUser",
                        data: {
                            groupId: user.groupId.value,
                            name: user.name.value,
                            fname: user.fname.value,
                            surname: user.surname.value,
                            email: user.email.value,
                            phone: user.phone.value,
                            position: user.position.value,
                            password: password
                        }
                    };
                    $http.post("serverside/controllers/users.php", params)
                        .success(function (data) {
                            if (data !== undefined) {
                                if (data["error_code"] !== undefined) {
                                    var db_error = $factory({ classes: ["DBError"], base_class: "DBError" });
                                    db_error.init(data);
                                    db_error.display();
                                } else {
                                    if (callback !== undefined)
                                        callback(data);
                                }
                            }
                        }
                    );
                }
            };


            users.editUser = function (user, callback) {
                if (user !== undefined) {
                    var params = {
                        action: "editUser",
                        data: {
                            userId: user.id.value,
                            groupId: user.groupId.value,
                            name: user.name.value,
                            fname: user.fname.value,
                            surname: user.surname.value,
                            position: user.position.value,
                            email: user.email.value,
                            phone: user.phone.value
                        }
                    };
                    $http.post("serverside/controllers/users.php", params)
                        .success(function (data) {
                            if (data !== undefined) {
                                if (data["error_code"] !== undefined) {
                                    var db_error = $factory({ classes: ["DBError"], base_class: "DBError" });
                                    db_error.init(data);
                                    db_error.display();
                                } else {
                                    if (callback !== undefined)
                                        callback(data);
                                }
                            }
                        }
                    );
                }
            };


            users.deleteUser = function (userId, callback) {
                if (userId !== undefined) {
                    var params = {
                        action: "deleteUser",
                        data: {
                            userId: userId
                        }
                    };
                    $http.post("serverside/controllers/users.php", params)
                        .success(function (data) {
                            if (data !== undefined) {
                                if (data["error_code"] !== undefined) {
                                    var db_error = $factory({ classes: ["DBError"], base_class: "DBError" });
                                    db_error.init(data);
                                    db_error.display();
                                } else {
                                    if (callback !== undefined)
                                        callback(data);
                                }
                            }
                        }
                    );
                }
            };


            users.countUsersInGroup = function (groupId) {
                if (groupId !== undefined) {
                    var result = 0;
                    angular.forEach(users.users.items, function (user) {
                        if (user.groupId.value === groupId)
                            result++;
                    });
                    return result;
                }
            };

            return users;
        }]);
    })
    .run(function ($modules, $users, $menu, $rootScope) {
        $modules.load($users);
        $rootScope.users = $users;
        $users.groups._states_.loaded(false);
        //$users.getUserGroups();
        //$users.getUsers();
        $menu.add({
            id: "users",
            title: "Пользователи",
            description: "Пользователи системы",
            url: "#/users",
            template: "templates/users/users.html",
            controller: "UsersController",
            icon: "resources/img/icons/user-group.png"
        });
    }
);
