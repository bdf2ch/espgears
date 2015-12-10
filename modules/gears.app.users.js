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
                    isDeleted: new Field({ source: "IS_DELETED", value: false, default_value: false }),
                    fio: "",
                    short: "",

                    onInitModel: function () {
                        this.fio = this.surname.value + " " + this.name.value + " " + this.fname.value;
                        this.short = this.surname.value + " " + this.name.value.toUpperCase()[0] + ". " + this.fname.value.toString().toUpperCase()[0] + ".";
                        this.isDeleted.value = this.isDeleted.value === 0 ? false : true;
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
            users.permissions = $factory({ classes: ["Collection", "States"], base_class: "Collection" });

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


            users.getPermissions = function (userId, callback) {
                if (userId !== undefined) {
                    var params = {
                        action: "getPermissions",
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


            users.editPermission = function (userId, permission, callback) {
                if (userId !== undefined && permission !== undefined) {
                    var params = {
                        action: "setPermission",
                        data: {
                            userId: userId,
                            permissionData: permission.data.value,
                            enabled: permission.enabled.value === true ? 1 : 0
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
                                        callback(permission, data);
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
        $users.users._states_.loaded(false);
        //$users.getUserGroups();
        //$users.getUsers();

        /*
        $menu.add({
            id: "users",
            title: "Пользователи",
            description: "Пользователи системы",
            url: "#/users",
            template: "templates/users/users.html",
            controller: "UsersController",
            icon: "resources/img/icons/user-group.png"
        });
        */
    }
);



/**
 * UsersController
 * Контроллер раздела пользователей системы
 */
users.controller("UsersController", ["$log", "$scope", "$location", "$users", "$application", "$modals", "$factory", "$session", function ($log, $scope, $location, $users, $application, $modals, $factory, $session) {
    $scope.users = $users;
    $scope.app = $application;

    $scope.gotoAddUser = function () {
        $location.url("/new-user");
    };

    $scope.selectGroup = function (groupId) {
        if (groupId !== undefined) {
            angular.forEach($scope.users.groups.items, function (group) {
                if (group.id.value === groupId) {
                    if (group._states_.selected() === true) {
                        group._states_.selected(false);
                        $application.currentUserGroup = undefined;
                    } else {
                        group._states_.selected(true);
                        $application.currentUserGroup = group;
                        $log.log("group " + $users.groups.find("id", groupId).title.value + " selected");
                    }
                } else {
                    group._states_.selected(false);
                }
            });
        }
    };

    $scope.selectUser = function (userId) {
        if (userId !== undefined) {
            angular.forEach($scope.users.users.items, function (user) {
                if (user.id.value === userId) {
                    if (user._states_.selected() === true) {
                        user._states_.selected(false);
                        $application.currentUser = undefined;
                        $application.currentUserPermissions.clear();
                    } else {
                        user._states_.selected(true);
                        $application.currentUser = user;
                        $application.currentUserPermissions.clear();
                        $application.currentUserPermissions._states_.loaded(false);
                        $users.getPermissions(userId, $scope.onSuccessGetUserPermissions);
                        $log.log("user " + $users.users.find("id", userId).fio + " selected");
                    }
                } else {
                    user._states_.selected(false);
                }
            });
        }
    };

    $scope.addGroup = function () {
        $modals.show({
            width: 400,
            position: "center",
            caption: "Новая группа пользователей",
            showFog: true,
            template: "templates/modals/new-user-group.html"
        });
    };

    $scope.editGroup = function (event) {
        event.stopPropagation();
        $modals.show({
            width: 400,
            position: "center",
            caption: "Редактирование группы пользователей",
            showFog: true,
            closeButton: false,
            template: "templates/modals/edit-user-group.html"
        });
    };

    $scope.deleteGroup = function (event) {
        event.stopPropagation();
        $modals.show({
            width: 400,
            position: "center",
            caption: "Удаление группы пользователей",
            showFog: true,
            closeButton: true,
            template: "templates/modals/delete-user-group.html"
        });
    };


    $scope.addUser = function () {
        $modals.show({
            width: 500,
            position: "center",
            caption: "Добавление пользователя",
            showFog: true,
            template: "templates/modals/new-user.html"
        });
    };


    $scope.editUser = function (event) {
        event.stopPropagation();
        $modals.show({
            width: 500,
            position: "center",
            caption: "Редактирование пользователя",
            showFog: true,
            closeButton: true,
            template: "templates/modals/edit-user.html"
        });
    };


    $scope.deleteUser = function (event) {
        event.stopPropagation();
        $modals.show({
            width: 400,
            position: "center",
            caption: "Удаление пользователя",
            showFog: true,
            closeButton: true,
            template: "templates/modals/delete-user.html"
        });
    };

    $scope.onSuccessDeleteUser = function (moment) {
        $log.log("user deleted, moment = ", moment);
        $users.users.delete("id", $application.currentUser.id.value);
        $application.currentUser = undefined;
    };

    $scope.onSuccessGetUserPermissions = function (data) {
        if (data !== undefined) {
            angular.forEach(data, function (permission) {
                var temp_permission = $factory({ classes: ["UserPermission", "Model", "Backup", "States"], base_class: "UserPermission" });
                temp_permission._model_.fromJSON(permission);
                temp_permission._backup_.setup();
                temp_permission._backup_.restore();
                $application.currentUserPermissions.append(temp_permission);
            });
            $application.currentUserPermissions._states_.loaded(true);
            $log.log("user permissions = ", $application.currentUserPermissions.items);
        }
    };

    $scope.onChangePermission = function (permission) {
        if (permission !== undefined) {
            $log.log("permission value = ", permission.enabled.value);
            permission._states_.loading(true);
            $users.editPermission($session.user.get().id.value, permission, $scope.onSuccessEditPermission);
        }
    };

    $scope.onSuccessEditPermission = function (permission, data) {
        if (permission !== undefined && data !== undefined) {
            permission._states_.loading(false);
            var temp_permission = $factory({ classes: ["UserPermission", "Model", "Backup", "States"], base_class: "UserPermission" });
            temp_permission._model_.fromJSON(data);
            temp_permission._backup_.setup();
            temp_permission._backup_.restore();
            permission.enabled.value = temp_permission.enabled.value;
            //$application.currentUserPermissions.delete("data", permission.data.value);
            //$application.currentUserPermissions.append(temp_permission);
            $log.log("new permission = ", data);
        }
    };
}]);


users.controller("UserController", ["$log", "$scope", "$users", "$session", "$modals", "$window", function ($log, $scope, $users, $session, $modals, $window) {
    $scope.users = $users;
    $scope.session = $session;

    $scope.onSuccessCloseSession = function () {
        $window.location.reload();
    };

    $scope.changePassword = function () {
        $modals.show({
            width: 400,
            position: "center",
            caption: "Изменение пароля",
            showFog: true,
            template: "templates/modals/edit-user-password.html"
        });
    };
}]);


users.controller("EditUserPasswordModalController", ["$log", "$scope", "$modals", "$session", function ($log, $scope, $modals, $session) {
    $scope.password = "";
    $scope.passwordRepeat = "";
    $scope.isLoading = false;
    $scope.isChanged = false;
    $scope.errors = [];

    $scope.onSuccessChangePassword = function () {
        $modals.close();
        $scope.password = "";
        $scope.passwordRepeat = "";
        $scope.errors.splice(0, $scope.errors.length);
        $scope.isLoading = false;
        $scope.isChanged = false;
        $log.log("password changed");
    };

    $scope.validate = function () {
        $scope.errors.splice(0, $scope.errors.length);
        if ($scope.password === "")
            $scope.errors.push("Вы не ввели пароль");
        if ($scope.passwordRepeat === "")
            $scope.errors.push("Вы не ввели пароль повторно");
        if ($scope.password !== "" && $scope.passwordRepeat !== "") {
            if ($scope.password !== $scope.passwordRepeat) {
                $scope.errors.push("Введенные пароли не совпадают");
            }
        }
        if ($scope.errors.length === 0) {
            $scope.isLoading = true;
            $session.onSuccessChangeUserPassword = $scope.onSuccessChangePassword;
            $session.user.changePassword($scope.password);
        }
    };

    $scope.cancel = function () {
        $modals.close();
        $scope.password = "";
        $scope.passwordRepeat = "";
        $scope.errors.splice(0, $scope.errors.length);
        $scope.isLoading = false;
        $scope.isChanged = false;
    };
}]);
