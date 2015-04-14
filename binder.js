/**
 * provide data bind ability
 * 
 * @author victor li
 * @date 2015/04/13
 * released under terms of MIT lincese
 */

;(function(global, doc, Sizzle, undefined) {
    
    'use strict';

    var Binder = Binder || {
        scope: {},
        version: '0.0.1'
    };

    // support specify the scope id binding on these tags
    var tags = ['html', 'body', 'head', 'title', 'div', 'ul', 'li', 'table',
                    'tr', 'td', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'span'];

    /**
     * find scope in page to execute data binding
     * @param id a scope id
     */
    function findScope(id) {

        var i = 0, len = tags.length, scope;

        for (; i < len; i++) {
            var selector = tags[i] + '[bind-scope="' + id + '"]',
                temp = Sizzle(selector);
            if (temp && temp.length) {
                scope = temp[0];
                break;
            }
        }

        return scope;

    };

    function getHtml(scope) {
        return scope.innerHTML;
    };

    function analyseBinderTag(html) {
        var tagReg = /\{\{\w+\}\}/g,
            match = tagReg.exec(html),
            tags = [];

        while (match) {
            var obj = {},
                key = match[0].replace(/\{\{/, '').replace(/\}\}/, '');
            obj[key] = match.index;
            tags.push(obj);

            match = tagReg.exec(html);
        }

        tags.sort(function(a, b) {
            for (var k1 in a) {
                for (var k2 in b) {
                    if (a[k1] > b[k2]) {
                        return false;
                    }
                }
            }

            return true;
        });

        return tags;
    };

    function replaceBinderTag(html, tags, scope) {
        var i = 0, len = tags.length, generated = html;
        for (; i < len; i++) {
            var ele = tags[i];
            for (var key in ele) {
                if (scope[key]) {
                    var reg = new RegExp('\{\{' + key + '\}\}');
                    generated = generated.replace(reg, scope[key]);
                }
            }
        }

        return generated;
    };

    function repaint(scope, generated) {
        scope.innerHTML = generated;
    };

    /**
     * @param id scope id
     * @param scope
     */
    function exec(id, scope) {
        if (!scope['replaced']) {
            var html = getHtml(id),
                tags = analyseBinderTag(html),
                replaced = replaceBinderTag(html, tags, scope);

            scope['replaced']  = replaced;
        }

        var replaced = scope['replaced'];

        repaint(id, replaced);
    };

    /**
     * initialize the Binder
     */
    function init() {
        Binder.scope = {};
    };

    Binder.module = function(id, fn) {
        Binder.scope[id] = {};
        var scope = findScope(id);
        fn(Binder.scope[id]);
        exec(scope, Binder.scope[id]);
    };

    global.Binder = Binder;

})(window, window.document, Sizzle);

