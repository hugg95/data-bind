/**
 * provide data bind ability
 * 
 * @author victor li
 * @date 2015/04/13
 * released under terms of MIT lincese
 */

;(function(global, doc, $, undefined) {
    
    'use strict';

    var Binder = Binder || {
        scope: {},
        version: '0.0.1'
    };

    // support specify the scope id binding on these tags
    var tags = ['html', 'body', 'head', 'title', 'div', 'ul', 'li', 'table',
                    'tr', 'td', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'span'],
        labels = {
            scopeLabel: 'data-scope',
            bindLabel: 'data-bind'
        };

    /**
     * find scope in page to execute data binding
     *
     * @param id scope id, specified using "in-scope"
     */
    function findScope(id) {

        var scope, 
            selector = '[' + labels.scopeLabel + '="' + id + '"]',
            temp = $(selector);

        if (temp && temp.length) {
            scope = temp[0];
        }

        return scope;

    };

    function getHtml(context) {
        return context.innerHTML;
    };

    function findBinderMarks(html) {
        var tagReg = /\{\{\w+\}\}/g,
            match = tagReg.exec(html),
            marks = [];

        while (match) {
            var obj = {},
                key = match[0].replace(/\{\{/, '').replace(/\}\}/, '');
            obj[key] = match.index;
            marks.push(obj);

            match = tagReg.exec(html);
        }

        marks.sort(function(a, b) {
            for (var k1 in a) {
                for (var k2 in b) {
                    if (a[k1] > b[k2]) {
                        return false;
                    }
                }
            }

            return true;
        });

        return marks;
    };

    function findBinderLabels(context) {
        var result = [], 
            selector = '[' + labels['bindLabel'] + ']',
            nodes = $(selector, context);

        if (nodes && nodes.length) {
            var i = 0, len = nodes.length;
            for (; i < len; i++) {
                var node = nodes[i],
                    name = node.attributes[labels.bindLabel].value;
                
                node.innerText = '{{' + name + '}}';
            }
        }

        return context;

    };

    function replaceBinderMarks(html, tags, scope) {
        var i = 0, len = tags.length, replaced = html;
        for (; i < len; i++) {
            var ele = tags[i];
            for (var key in ele) {
                if (scope[key]) {
                    var reg = new RegExp('\{\{' + key + '\}\}');
                    replaced = replaced.replace(reg, scope[key]);
                }
            }
        }

        return replaced;
    };

    function repaint(scope, replaced) {
        scope.innerHTML = replaced;
    };

    /**
     * @param id scope id
     * @param scope
     */
    function execute(context, scope) {
        
        context = findBinderLabels(context);

        if (!scope['replaced']) {
            var html = getHtml(context),
                tags = findBinderMarks(html),
                replaced = replaceBinderMarks(html, tags, scope);

            scope['replaced']  = replaced;
        }

        var replaced = scope['replaced'];

        repaint(context, replaced);
    };

    /**
     * initialize the Binder
     */
    function init() {
        Binder.scope = {};
    };

    /**
     * 
     */
    Binder.module = function(id, fn) {
        if (!fn || typeof fn !== 'function') {
            throw new Error('fn must be a valid Function instance');
        }

        var context = findScope(id),
            scope = {};

        scope[id] = null;
        
        fn(scope);
        execute(context, scope);
    };

    global.Binder = Binder;

})(window, window.document, jQuery);

