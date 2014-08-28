(function(window, undefined) {

  'use strict';

  // sea 模块根目录
  var LIB_PATH = '//ue.17173cdn.com/a/lib/';

  var document = window.document;

  // sea
  var seajs = window.seajs;

  // 待处理队列
  var queue = [
    // [['widget'], function(Widget) {
    //   Widget.autoRender();
    // }]
  ];

  var pandora = window.pandora = {
    use: function(modules, callback) {
      if (!seajs) {
        queue.push([modules, callback]);
      } else {
        seajs.use(modules, callback);
      }
    }
  };

  /**
   * from jquery 1.11.1
   */
  function domReady(callback) {
    var isReady = false;

    /**
     * Clean-up method for dom ready events
     */
    function detach() {
      if ( document.addEventListener ) {
        document.removeEventListener( 'DOMContentLoaded', completed, false );
        window.removeEventListener( 'load', completed, false );

      } else {
        document.detachEvent( 'onreadystatechange', completed );
        window.detachEvent( 'onload', completed );
      }
    }

    /**
     * The ready event handler and self cleanup method
     */
    function completed() {
      // readyState === 'complete' is good enough for us to call the dom ready in oldIE
      if ( document.addEventListener || event.type === 'load' || document.readyState === 'complete' ) {
        detach();
        callback();
      }
    }
    // Catch cases where $(document).ready() is called after the browser event has already occurred.
    // we once tried to use readyState 'interactive' here, but it caused issues like the one
    // discovered by ChrisS here: http://bugs.jquery.com/ticket/12282#comment:15
    if ( document.readyState === 'complete' ) {
      // Handle it asynchronously to allow scripts the opportunity to delay ready
      setTimeout( callback );

    // Standards-based browsers support DOMContentLoaded
    } else if ( document.addEventListener ) {
      // Use the handy event callback
      document.addEventListener( 'DOMContentLoaded', completed, false );

      // A fallback to window.onload, that will always work
      window.addEventListener( 'load', completed, false );

    // If IE event model is used
    } else {
      // Ensure firing before onload, maybe late but safe also for iframes
      document.attachEvent( 'onreadystatechange', completed );

      // A fallback to window.onload, that will always work
      window.attachEvent( 'onload', completed );

      // If IE and not a frame
      // continually check to see if the document is ready
      var top = false;

      try {
        top = window.frameElement === null && document.documentElement;
      } catch(e) {}

      if ( top && top.doScroll ) {
        (function doScrollCheck() {
          if ( !isReady ) {

            try {
              // Use the trick by Diego Perini
              // http://javascript.nwbox.com/IEContentLoaded/
              top.doScroll('left');
            } catch(e) {
              return setTimeout( doScrollCheck, 50 );
            }

            // detach all dom ready events
            detach();

            // and execute any waiting functions
            callback();
          }
        })();
      }
    }
  }

  // pandora.open = pandora.use;

  function init() {
    var task;

    seajs = window.seajs;

    seajs.config({
      base: LIB_PATH,
      alias: {
        '$': 'jquery/jquery/1.11.1/jquery',
        'jquery': 'jquery/jquery/1.11.1/jquery',

        'alert': 'pandora/dialog/1.0.0/alert',
        'article': 'pandora/article/1.0.0/article',
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

    // 处理队列
    while ((task = queue.shift())) {
      seajs.use(task[0], task[1]);
    }

    // domReady，处理 autoRender
    domReady(function() {
      seajs.use(['widget'], function(Widget) {
        Widget.autoRender();
      });
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

  if (!seajs) {
    var doc = window.document,
      head = doc.head || doc.getElementsByTagName('head')[0] || doc.documentElement,
      baseElement = head.getElementsByTagName('base')[0],
      node = doc.createElement('script');

    node.charset = 'utf-8';

    listen(node, init);

    node.async = true;
    node.src = LIB_PATH + 'seajs/sea.js';

    baseElement ?
      head.insertBefore(node, baseElement) :
      head.appendChild(node);
  } else {
    init();
  }

})(this);
