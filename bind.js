/**
 * provide data bind ability
 * @author victor li
 * @date 2015/04/13
 * released under terms of MIT lincese
 */

;(function(global, doc, Sizzle, undefined) {
    
    'use strict';

    var Bind = Bind || {
        scope: {}
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

    function analyseBindTag(html) {
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

    function replaceBindTag(html, tags) {
        var i = 0, len = tags.length, generated = html;
        for (; i < len; i++) {
            var ele = tags[i];
            for (var key in ele) {
                if (Bind.scope[key]) {
                    var reg = new RegExp('\{\{' + key + '\}\}');
                    generated = generated.replace(reg, Bind.scope[key]);
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
            tags = analyseBindTag(html),
            generated = replaceBindTag(html, tags);

        repaint(id, generated);
    };

    Bind.module = function(id, fn) {
        var scope = findScope(id);
        fn(scope);
        init(scope);
    };

    global.Bind = Bind;

})(window, window.document, Sizzle);
