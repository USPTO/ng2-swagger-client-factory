export declare class SwaggerClientFactory {
    private Swagger;
    private RSVP;
    private findIndex;
    private clients;
    private promises;
    constructor();
    private getCachedClient(basePath);
    /**
     * Adds a swagger client to the HttpService cache for reuse.  If the refresh property
     * is set to true, then it refreshes the client in the cache.
     *
     * @param {Swagger} client - The swagger resource client delegate
     * @param {boolean} refresh - If true, replaces existing client for same resource
     */
    private addClientToCache(client, refresh);
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
    private getPromise(basePath, refresh);
    /**
     * Removes the promise from the array of pending swagger client instatiations
     *
     * @param {string} basePath - The base path for the service that is being instatiated.
     */
    private removePromise(basePath);
    /**
     * Function for retrieving a Swagger client for a specific deployed REST resource.  Once
     * the client is created, it is cached for reuse so that the code doesn't make a call to
     * the swagger.json for each request for a client.
     *
     * @param {string} basePath - The base path for the service that  is being instatiated.
     * @param {boolean} refresh - True if the client should be refreshed, false to return the
     *                            cached client if it exists.
     */
    getSwaggerClient(basePath: string, refresh: boolean): any;
}
