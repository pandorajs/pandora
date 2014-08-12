(function(window, undefined) {

  var libPath = '//ue.17173cdn.com/a/lib/';

  function init() {
    window.seajs.config({
      base: libPath,
      alias: {
        '$': 'jquery/jquery/1.11.1/jquery',
        'jquery': 'jquery/jquery/1.11.1/jquery',

        'alert': 'pandora/dialog/1.0.0/alert',
        // 请使用 Widget.autoRender
        // 下一版取消支持独立的 autoRender 调用
        'autorender': 'pandora/widget/1.0.0/autorender',
        'base': 'pandora/base/1.0.0/base',
        'changyan' : 'pandora/changyan/1.0.0/changyan',
        'class': 'pandora/class/1.0.0/class',
        'confirm': 'pandora/dialog/1.0.0/confirm',
        'dialog': 'pandora/dialog/1.0.0/dialog',
        // 加载 css 文本
        'importstyle' : 'pandora/importstyle/1.0.0/importstyle',
        'locker': 'pandora/locker/1.0.0/locker',
        'mood' : 'pandora/mood/1.0.0/mood',
        'overlay': 'pandora/overlay/1.0.0/overlay',
        'select': 'pandora/select/1.0.0/select',
        'share' : 'pandora/share/1.0.0/share',
        'switchable': 'pandora/switchable/1.0.0/switchable',
        'tabs': 'pandora/tabs/1.0.0/tabs',
        'tips': 'pandora/dialog/1.0.0/tips',
        'validate': 'pandora/validate/1.0.0/validate',
        'viewpoint' : 'pandora/viewpoint/1.0.0/viewpoint',
        'widget': 'pandora/widget/1.0.0/widget',

        'handlebars': 'gallery/handlebars/1.3.0/handlebars-runtime'
      }
    });

    window.seajs.use('widget', function(Widget) {
      Widget.autoRender();
    });
  }

  function listen(node, callback) {
    var supportOnload = 'onload' in node;

    function onload() {
      node.onload = node.onerror = node.onreadystatechange = null;
      head.removeChild(node);
      node = null;
      callback();
    }

    if (supportOnload) {
      node.onload = onload;
    } else {
      node.onreadystatechange = function() {
        if (/loaded|complete/.test(node.readyState)) {
          onload();
        }
      };
    }
  }

  if (typeof window.seajs === 'undefined') {
    var doc = window.document,
      head = doc.head || doc.getElementsByTagName('head')[0] || doc.documentElement,
      baseElement = head.getElementsByTagName('base')[0],
      node = doc.createElement('script');

    node.charset = 'utf-8';

    listen(node, init);

    node.async = true;
    node.src = libPath + 'seajs/sea.js';

    baseElement ?
      head.insertBefore(node, baseElement) :
      head.appendChild(node);
  } else {
    init();
  }

})(this);
