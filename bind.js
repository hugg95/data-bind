/**
 * provide data bind ability
 * @author victor li
 * @date 2015/04/13
 * released under terms of MIT lincese
 */

;(function(global, doc, Sizzle, undefined) {
    
    'use strict';

    var Bind = Bind || {
        scope: {
            init: function() {

            }
        }
    };

    function findScope() {
        var tag = ['html', 'body', 'head', 'title', 'div', 'ul', 'li', 'table',
                    'tr', 'td', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'span'],
            i = 0,
            len = tag.length,
            scope;

        for (; i < len; i++) {
            var temp = Sizzle(tag[i] + '[bind-scope]');
            if (temp && temp.length) {
                scope = temp;
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
                for (k2 in b) {
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

    function init() {
        var scope = findScope(),
            html = getHtml(scope),
            tags = analyseBindTag(html);
    };

    global.Bind = Bind;

})(window, window.document, Sizzle);
