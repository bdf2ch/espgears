"use strict";


var grShop = angular.module("gears.shop", [])
    .config(function ($provide) {

        /********************
         * $cart
         * Сервис, определяющий функционал корзины покупок пользователя
         ********************/
        $provide.factory("$cart", ["$log", "$factory", function ($log, $factory) {
            var cart = {};


            /**
             * Наборы свойст и методов, описывающих модели данных
             */
            cart.classes = {
                /**
                 * Набор классов и методов, описывающих элемент корзины покупок
                 */
                CartItem: {
                    productId: 0,
                    price: 0,
                    amount: 1,

                    init: function (parameters) {
                        if (parameters !== undefined) {
                            for (var param in parameters) {
                                if (this.hasOwnProperty(param) !== param !== "amount")
                                    this[param] = parameters[param];
                            }
                            this.amount = 1;
                        }
                    }
                }
            };


            /**
             * Переменные сервиса
             */
            cart.items = $factory({ classes: ["Collection"], base_class: "Collection" });
            var totalPrice = 0;
            var totalAmount = 0;


            /**
             * Добавляет элемент в корзину покупок
             * @param item {Any} - Объект, описывающий покупку
             * @returns {number} - Возвращает количество элементов в корзине покупок
             */
            cart.add = function (productId, productPrice) {
                var result = false;
                if (productId !== undefined && productPrice !== undefined) {
                    var cart_item = cart.items.find("productId", productId);
                    if (cart_item !== false) {
                        cart_item.amount++;
                    } else {
                        cart_item = $factory({ classes: ["CartItem"], base_class: "CartItem" });
                        cart_item.init({ productId: productId, price: productPrice });
                        cart.items.append(cart_item);
                    }
                    totalAmount++;
                    totalPrice += productPrice;
                    result = totalAmount;
                } else
                    $log.error("$cart: Не указан идентификатор продукта или цена продукта");
                return result;
            };


            /**
             * Удаляет элемент из корзины
             * @param productId - Идентификатор элемента корзины покупок
             * @returns {number} - Возвращает количество элементов в корзине покупок, в противном случае - false
             */
            cart.delete = function (productId) {
                var result = false;
                if (productId !== undefined) {
                    var product = cart.items.find("productId", productId);
                    if (product !== false) {
                        if (product.amount > 1)
                            product.amount--;
                        else
                            cart.items.delete("productId", productId);
                        totalAmount--;
                        totalPrice -= product.price;
                        result = cart.amount();
                    }
                } else
                    $log.error("$cart: Не указан идентификатор элемента корзины покупок");
                return result;
            };


            /**
             * Возвращает общее количество элементов в корзине покупок
             * @returns {number} - Возвращает количество элементов в корзине покупок
             */
            cart.amount = function () {
                return totalAmount;
            };


            /**
             * Возвращает общую стоимость элемнтов в корзине покупок
             * @returns {number} - Возвращает общую стоимость элементов в корзине покупок
             */
            cart.price = function () {
                return totalPrice;
            };


            cart.clear = function () {
                cart.items.clear();
                totalPrice = 0;
                totalAmount = 0;
            };

            return cart;
        }]);





        /********************
         * $order
         * Сервис, определюящий функционал заказа пользователя
         ********************/
        $provide.factory("$order", [function () {
            var order = {};

            return order;
        }]);

    })
    .run(function ($rootScope, $modules, $cart) {
        $modules.load($cart);
        $rootScope.cart = $cart;
    });
