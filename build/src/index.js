/**
 * Returns a middleware selected by another
 * middleware.
 *
 * @param {(number|function)} selector
 *   If a number, the middleware at position number will be executed, else the next middleware will be
 *   executed first. If the selector is a function it will be executed with the req,
 *   res, and next arguments. The return of the function will be used as the
 *   selector.
 * @param {function[]} middlewares
 *   The middlewares to select.
 *
 * @return {function}
 *   The middleware selected.
 *
 * @example
 *   // Will select a middleware based on the request application/json accept
 *   // header.
 *   app.use(require('express-middleware-select')(
 *     function (req, res, next) {
 *       if (req.get('accept') === 'application/json') return 1;
 *       else return 2
 *     },
 *     [function (req, res, next) {
 *       console.log('Mime type is application/json');
 *       next()
 *     }, function (req, res, next) {
 *       console.log('Mime type is not application/json');
 *       next();
 *     }]
 *  ));
 */
export const select = (selector, middlewares) => (req, res, next, ...rest) => {
    let middleware, index;
    if (typeof selector === "number") {
        index = selector;
        if (index < 0 || index > middlewares.length - 1)
            throw new Error("The selector is out of bounds");
        middleware = middlewares[index];
    }
    else if (typeof selector === "function") {
        index = selector(req, res, next, ...rest);
        if (index < 0 || index > middlewares.length - 1)
            throw new Error("The selector function returns a number that is out of bounds");
        middleware = middlewares[index];
    }
    else {
        throw new Error("The selector shoul be either a number or a function that return a number");
    }
    if (middleware)
        return middleware(req, res, next, ...rest);
    else
        return next();
};
