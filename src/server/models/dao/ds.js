'use strict';

var ds = module.exports = {};
function * requestDs(ctx, httpOptions) {
    httpOptions.servername = servername;
    var data = null;
    try {
        data = yield request(ctx, servername, httpOptions);
    } catch (e) {
        logger.warn({
            logid: ctx.state.logid,
            errorMessage: e.message,
            stack: e['statck'],
            test: 'abcdefg'
        });
        ctx.throw(ctx.config['error']['backend_request_error']);
    }
    try {
        data = JSON.parse(data);
    } catch (e) {
        ctx.throw(ctx.config['error']['backend_parse_error']);
    }
    if (data['status'] && parseInt(data['status']) === 1) {
        return data;
    } else if (data['status']) {
        ctx.throw(mapErrorCode(data['status'], ctx, {
            req: httpOptions,
            res: data
        }, {ext: data.ext}));
    }
    ctx.throw(ctx.config['error']['backend_unknown_error']);
    return null;
}

