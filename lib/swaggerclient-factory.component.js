"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require('@angular/core');
var SwaggerClientFactory = (function () {
    function SwaggerClientFactory() {
        this.Swagger = require('swagger-client');
        this.RSVP = require('rsvp');
        this.findIndex = require('ponyfill-array-findindex');
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
    /**
     * Adds a swagger client to the HttpService cache for reuse.  If the refresh property
     * is set to true, then it refreshes the client in the cache.
     *
     * @param {Swagger} client - The swagger resource client delegate
     * @param {boolean} refresh - If true, replaces existing client for same resource
     */
    SwaggerClientFactory.prototype.addClientToCache = function (client, refresh) {
        var idx = this.clients.findIndex(function (cachedClient) {
            return (client.basePath === cachedClient.basePath);
        });
        if (idx === -1) {
            this.clients.push(client);
        }
        else if (idx > -1 && refresh) {
            this.clients.splice(idx, 1, client);
        }
        return client;
    };
    /**
     * Initializes a new Swagger client by setting up a promise.  If an existing
     * promise has already been created, then the pre-existing promise is returned
     * so that only one call is made to get the swagger.json client definition. If
     * the refresh property is set to true, then a new promise is created even if
     * there is a pre-existing promise for the same resource.
     *
     * @param {string} basePath - The base path for the service that is being instatiated.
     * @param {boolean} refresh - If true, then a new swagger client is created even if
     *                            another swagger client request is still in flight as well.
     */
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
    /**
     * Removes the promise from the array of pending swagger client instatiations
     *
     * @param {string} basePath - The base path for the service that is being instatiated.
     */
    SwaggerClientFactory.prototype.removePromise = function (basePath) {
        var idx = this.promises.findIndex(function (promiseObj) {
            return (promiseObj.basePath === basePath);
        });
        if (idx > -1) {
            this.promises.splice(idx, 1);
        }
    };
    /**
     * Function for retrieving a Swagger client for a specific deployed REST resource.  Once
     * the client is created, it is cached for reuse so that the code doesn't make a call to
     * the swagger.json for each request for a client.
     *
     * @param {string} basePath - The base path for the service that  is being instatiated.
     * @param {boolean} refresh - True if the client should be refreshed, false to return the
     *                            cached client if it exists.
     */
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
    SwaggerClientFactory = __decorate([
        core_1.Injectable()
    ], SwaggerClientFactory);
    return SwaggerClientFactory;
}());
exports.SwaggerClientFactory = SwaggerClientFactory;
//# sourceMappingURL=swaggerclient-factory.component.js.map