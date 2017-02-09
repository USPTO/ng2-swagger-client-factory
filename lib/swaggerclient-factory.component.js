"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require("@angular/core");
var SwaggerClientFactory = (function () {
    function SwaggerClientFactory() {
        this.Swagger = require('swagger-client');
        this.RSVP = require('rsvp');
        this.arrayFindIndex = require('array-find-index');
        this.clients = [];
        this.promises = [];
    }
    SwaggerClientFactory.prototype.getCachedClient = function (basePath) {
        var cachedClient = undefined;
        this.clients.some(function (client, idx, arr) {
            if (client.basePath === basePath) {
                cachedClient = client;
                return true;
            }
        });
        return cachedClient;
    };
    SwaggerClientFactory.prototype.addClientToCache = function (client, refresh) {
        var idx = this.arrayFindIndex(this.clients, function (cachedClient) { return client.basePath === cachedClient.basePath; });
        if (idx === -1) {
            this.clients.push(client);
        }
        else if (idx > -1 && refresh) {
            this.clients.splice(idx, 1, client);
        }
        return client;
    };
    SwaggerClientFactory.prototype.getPromise = function (basePath, refresh) {
        var that = this;
        var promise = undefined;
        this.promises.some(function (promiseObj, idx, arr) {
            if (promiseObj.basePath === basePath) {
                promise = promiseObj.promise;
                return true;
            }
        });
        if (!promise || refresh) {
            promise = new this.Swagger({
                url: basePath + '/swagger.json',
                usePromise: true
            });
            this.promises.push({
                'basePath': basePath,
                'promise': promise
            });
        }
        return promise;
    };
    SwaggerClientFactory.prototype.removePromise = function (basePath) {
        var idx = this.arrayFindIndex(this.promises, function (promiseObj) { return promiseObj.basePath === basePath; });
        if (idx > -1) {
            this.promises.splice(idx, 1);
        }
    };
    SwaggerClientFactory.prototype.getSwaggerClient = function (basePath, refresh) {
        var that = this;
        return new this.RSVP.Promise(function (resolve, reject) {
            var cachedClient = that.getCachedClient(basePath);
            if (cachedClient && !refresh) {
                resolve(cachedClient);
            }
            else {
                that.getPromise(basePath, refresh).then(function (client) {
                    that.addClientToCache(client, refresh);
                    that.removePromise(basePath);
                    resolve(client);
                })
                    .catch(function (error) {
                    reject(error);
                });
            }
        });
    };
    return SwaggerClientFactory;
}());
SwaggerClientFactory = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [])
], SwaggerClientFactory);
exports.SwaggerClientFactory = SwaggerClientFactory;
//# sourceMappingURL=swaggerclient-factory.component.js.map