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

    function findScope(id) {
        var tag = ['html', 'body', 'head', 'title', 'div', 'ul', 'li', 'table',
                    'tr', 'td', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'span'],
            i = 0,
            len = tag.length,
            scope;

        for (; i < len; i++) {
            var selector = tag[i] + '[bind-scope="' + id + '"]',
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

    function replaceBinderTag(html, tags) {
        var i = 0, len = tags.length, generated = html;
        for (; i < len; i++) {
            var ele = tags[i];
            for (var key in ele) {
                if (Binder.scope[key]) {
                    var reg = new RegExp('\{\{' + key + '\}\}');
                    generated = generated.replace(reg, Binder.scope[key]);
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
     */
    function init(id) {
        var html = getHtml(id),
            tags = analyseBinderTag(html),
            generated = replaceBinderTag(html, tags);

        repaint(id, generated);
    };

    /**
     * clear data in scope
     */
    function clear() {
        Binder.scope = {};
    };

    Binder.module = function(id, fn) {
        clear();
        var scope = findScope(id);
        fn(Binder.scope);
        init(scope);
    };

    global.Binder = Binder;

})(window, window.document, Sizzle);

