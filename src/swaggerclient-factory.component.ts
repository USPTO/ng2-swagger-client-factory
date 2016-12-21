import { Injectable } from '@angular/core';

@Injectable()
export class SwaggerClientFactory {
    
    private Swagger = require('swagger-client');
    private RSVP = require('rsvp');
    private findIndex = require('ponyfill-array-findindex');
    private clients = []; 
    private promises = [];

    constructor() {
    }

    private getCachedClient(basePath:string) {
        let cachedClient = undefined;
        this.clients.some(function(client, idx, arr) {
            if (client.basePath === basePath) {
                cachedClient = client;
                return true;
            }
        });
        return cachedClient;
    }

    /**
     * Adds a swagger client to the HttpService cache for reuse.  If the refresh property
     * is set to true, then it refreshes the client in the cache.
     * 
     * @param {Swagger} client - The swagger resource client delegate
     * @param {boolean} refresh - If true, replaces existing client for same resource
     */
    private addClientToCache(client:any, refresh:boolean) {
        let idx = this.clients.findIndex(function (cachedClient) {
            return(client.basePath === cachedClient.basePath)
        })
        if (idx === -1) {
            this.clients.push(client);
        } else if (idx > -1 && refresh) {
            this.clients.splice(idx, 1, client);
        }

        return client;
    }

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
    private getPromise(basePath: string, refresh:boolean) {
        let that = this;
        let promise = undefined;
        this.promises.some(function(promiseObj, idx, arr) {
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
    }

    /**
     * Removes the promise from the array of pending swagger client instatiations
     * 
     * @param {string} basePath - The base path for the service that is being instatiated.
     */
    private removePromise(basePath:string) {
        let idx = this.promises.findIndex(function (promiseObj) {
            return(promiseObj.basePath === basePath)
        })
        if (idx > -1) {
            this.promises.splice(idx, 1);
        }
    }

    /**
     * Function for retrieving a Swagger client for a specific deployed REST resource.  Once
     * the client is created, it is cached for reuse so that the code doesn't make a call to 
     * the swagger.json for each request for a client.
     * 
     * @param {string} basePath - The base path for the service that  is being instatiated.
     * @param {boolean} refresh - True if the client should be refreshed, false to return the
     *                            cached client if it exists.  
     */
    getSwaggerClient(basePath:string, refresh:boolean) {
        let that = this;
        return new this.RSVP.Promise(function (resolve, reject) {
            let cachedClient = that.getCachedClient(basePath);
            if (cachedClient && !refresh) {
                resolve(cachedClient);
            } else {
                that.getPromise(basePath, refresh).then(function (client) {
                    that.addClientToCache(client, refresh);
                    that.removePromise(basePath);
                    resolve(client);
                })
                .catch(function (error) {
                    reject(error);
                })                    
            }
        });
    }
}
