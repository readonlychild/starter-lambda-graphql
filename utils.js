const aws = require('aws-sdk');
const fs = require('fs');
const { nanoid } = require('nanoid');

var utils = {
    guid: function () {
        return nanoid();
    },
    apiResponse: function (message) {
        if (this.isObject(message)) message = JSON.stringify(message);
        var response = {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Origin": "*" // Required for CORS support to work
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
        var yr = dte.getFullYear() + '';
        var mth = (dte.getMonth() + 1) + '';
        if (mth.length === 1) mth = '0' + mth;
        var dy = dte.getDate() + '';
        if (dy.length === 1) dy = '0' + dy;
        var hr = dte.getHours() + '';
        if (hr.length === 1) hr = '0' + hr;
        var min = dte.getMinutes() + '';
        if (min.length === 1) min = '0' + min;
        var sec = dte.getSeconds() + '';
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

    gql: {
        readSchema: function (path) {
            let schema = '';
            let filenames = fs.readdirSync(path);
            filenames.forEach((name) => {
                console.log(name);
                let content = fs.readFileSync(`${path}/${name}`);
                schema += content;
            });
            return schema;
        },
        readResolvers: function (path) {
            let resolvers = { Query: {}, Mutation: {} };
            let forqueries = fs.readdirSync(`${path}/Query`);
            forqueries.forEach((name) => {
                console.log('query:', name);
                resolvers.Query[name.replace('.js', '')] = require(`${path}/Query/${name}`);
            });
            let formutants = fs.readdirSync(`${path}/Mutation`);
            formutants.forEach((name) => {
                console.log('mutant:', name);
                resolvers.Mutation[name.replace('.js', '')] = require(`${path}/Mutation/${name}`);
            });
            return resolvers;
        }
    },
    Discord: {
        hooks: {
            critical: ''
        },
        colors: {
            primary: 3447003,
            secondary: 6061232,
            success: 3527738,
            danger: 16711680,
            warning: 16770877,
            info: 8428749,
            light: 13881293,
            dark: 6440788,
            white: 16777215,
            black: 0
        },
        getEmbed: function () {
            var e = {};
            e.setTitle = function (title) {
                e.title = title;
                return e;
            };
            e.setAuthor = function (author, icon) {
                e.author = {};
                e.author.name = author;
                if (icon) e.author.icon_url = icon;
                return e;
            }
            e.setDescription = function (description) {
                e.description = description;
                return e;
            };
            e.setThumbnail = function (url) {
                if (!url) return e;
                e.thumbnail = { url: url };
                return e;
            };
            e.setWarning = function () {
                e.thumbnail = { url: 'https://cdn3.iconfinder.com/data/icons/humano2/128x128/status/dialog-warning.png' }
                return e;
            };
            e.setError = function () {
                e.thumbnail = { url: 'https://cdn3.iconfinder.com/data/icons/ose/Error.png' }
                return e;
            };
            e.setInfo = function () {
                e.thumbnail = { url: 'https://cdn2.iconfinder.com/data/icons/humano2/128x128/actions/document-properties.png' }
                return e;
            };
            e.setSuccess = function () {
                e.thumbnail = { url: 'https://cdn0.iconfinder.com/data/icons/small-n-flat/24/678134-sign-check-128.png' }
                return e;
            };
            e.setImage = function (url) {
                e.image = { url: url };
                return e;
            };
            e.setUrl = function (url) {
                e.url = url;
                return e;
            };
            e.addField = function (name, value, inline) {
                e.fields = e.fields || [];
                inline = inline || false;
                e.fields.push({ name: name, value: value, inline: inline });
                return e;
            };
            e.setColor = function (color) {
                e.color = color;
                return e;
            };
            e.setFooter = function (footer, icon) {
                e.footer = {};
                e.footer.text = footer;
                if (icon) e.footer.icon_url = icon;
                return e;
            };
            e.stamp = function () {
                e.timestamp = new Date();
                return e;
            };
            return e;
        },
        notify: function (hook, embed, options) {
            options = options || {};
            var hookurl = hook;
            axios.post(hookurl, {
                username: options.username || 'watcher',
                avatar_url: options.avatar_url || 'https://www.readonlychild.com/discord/misc/u_watcher.png',
                embeds: [
                    embed
                ]
            })
                .catch((err) => {
                    console.log('webhook posting ERR:', err.message);
                });
            console.log('utils.Discord.notify sent.');
        }
    }
};

module.exports = utils;
