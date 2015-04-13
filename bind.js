/**
 * provide data bind ability
 * @author victor li
 * @date 2015/04/13
 * released under terms of MIT lincese
 */

;(function(global, doc) {
    
    'use strict';
    var scope = {};

    var sc = doc.getElementById('scope');
    var html = sc.innerHTML;
    var cp = html;
    scope.title = 'demo test';
    scope.name = 'victor';
    var reg = /\{\{\w+\}\}/g;
    var a = reg.exec(html);
    var re = [];
    while (a) {
        var o = {};
        var k = a[0].substr(2, a[0].length - 4);
        o[k]= a.index;
        re.push(o);
        //console.log(a);
        a = reg.exec(html);
    }

    re.sort(function(a, b) {
        for (var k1 in a) {
            for (var k2 in b) {
                if (a[k1] > b[k2]) {
                    return false;
                }
            }
        }
        return true;
    });
    //console.log(re);
    //console.log(reg.exec(html));
    //console.log(scope.innerHTML);

    var d = '';

    for (var i = 0; i < re.length; i++) {
        for (var k in re[i]) {
            if (scope[k]) {
                console.log(scope[k]);
                cp = cp.replace('{{' + k + '}}', scope[k]);
                
            }
        }
    }

    sc.innerHTML = cp;
    //console.log(d);

})(window, window.document);