const aws = require('aws-sdk');

var utils = {
  guid: function () {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
              .toString(16)
              .substring(1);
        };
        return s4() + s4() + '-' + s4() + '-' 
             + s4() + '-' + s4() + '-'
             + s4() + s4() + s4();
    },
    apiResponse: function (message) {
        //TODO: if message is object, stringifu
        var response = {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Origin" : "*" // Required for CORS support to work
            },
            body: message
        };
        return response;
    },
    apiJsonResponse: function (obj) {
        //not implemented yet
    },
    flipTable: function (consoleLog) {
        var ft = '(╯°□°）╯ ︵ ┻━┻';
        if (consoleLog) { console.log(ft); }
        return ft;
    },
    isArray: function (obj) {
        return Array.isArray(obj);
    },
    isObject: function (obj) {
        return obj !== null && typeof obj === 'object';
    },
    toESDate: function (dte) {
        var yr = dte.getFullYear()+'';
        var mth = (dte.getMonth() + 1)+'';
        if (mth.length === 1) mth = '0' + mth;
        var dy = dte.getDate()+'';
        if (dy.length === 1) dy = '0' + dy;
        var hr = dte.getHours()+'';
        if (hr.length === 1) hr = '0' + hr;
        var min = dte.getMinutes()+'';
        if (min.length === 1) min = '0' + min;
        var sec = dte.getSeconds()+'';
        if (sec.length === 1) sec = '0' + sec;
        return yr + '-' + mth + '-' + dy + 'T' + hr + ":" + min + ':' + sec;
    },
    phraseToTag: function (phrase) {
        return phrase.toLowerCase().replace(/ /g, '-');
    },
    startsWith: function (findThis, here) {
      return here.substr(0, findThis.length) === findThis;
    },
    templatize: function (obj, tpl, pathPrefix) {
        var utils = this;
        var t = tpl;
        pathPrefix = pathPrefix || '';
        if (utils.startsWith('.', pathPrefix)) {
            pathPrefix = pathPrefix.substring(1);
        }
        for (var p in obj) {
            var val = obj[p];
            if (val !== null && typeof val === 'object') {
                t = utils.templatize(val, t, pathPrefix + '.' + p);
            } else {
                var re = new RegExp('#' + (pathPrefix.length === 0 ? '' : pathPrefix + '.') + p + '#', 'gi');
                t = t.replace(re, val);
            }
        }
        return t;
    },

    

    makeSignedRequestPromise: function (options) { // returns response as string
        /*
        options: {
            method: 'POST'
            domain: domain
            path: '/', // uri w/o domain
            data: data,
            service: 'es'
            nodata: false
        }
        */
        options.method = options.method || 'POST';
        options.service = options.service || 'es';
        options.data = options.data || {};

        var endpoint = new aws.Endpoint(options.domain.replace('https://', '').replace('http://', ''));
        var creds = new aws.EnvironmentCredentials('AWS');

        var req = new aws.HttpRequest(endpoint);
        req.method = options.method;
        req.path = options.path;
        req.region = utils.vars.region;
        var dataAsString = ''
        if (typeof options.data === 'string' || options.data instanceof String) {
            dataAsString = options.data;
        } else {
            dataAsString = JSON.stringify(options.data);
        }
        if (options.method.toLowerCase() !== 'get' && !options.nodata) {
            req.body = dataAsString;
        }
        req.headers['presigned-expires'] = false;
        req.headers['Host'] = endpoint.host;
        req.host = endpoint.host;
        
        // sign request (Sigv4)
        var signer = new aws.Signers.V4(req, options.service);
        signer.addAuthorization(creds, new Date());
        
        return new Promise ((resolve, reject) => {
            var nodeHttpClient = new aws.NodeHttpClient();
            nodeHttpClient.handleRequest(req, null, (httpResp) => {
                var body = []; //'';
                httpResp.on('data', (chunk) => {
                    //body += chunk.toString();
                    body.push(chunk);
                });
                httpResp.on('end', () => {
                    body = Buffer.concat(body).toString();
                    resolve(body);
                });
            }, (err) => {
                utils.flipTable(true);
                console.log('makeNodeRequest-Error: ' + err);
                reject(err);
            });
        });
    }
};

module.exports = utils;
