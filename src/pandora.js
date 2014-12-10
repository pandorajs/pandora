(function(window, undefined) {

  'use strict';

  /**
   * Pandora 启动文件
   *
   * @module pandora
   */

  // sea 模块根目录
  var LIB_PATH = '//ue.17173cdn.com/a/lib/';

  var document = window.document;

  // sea
  var seajs = window.seajs;

  // 待处理队列
  var queue = [];

  /**
   * pandora，暴露到全局
   *
   * @class pandora
   */
  var pandora = window.pandora = {

    /**
     * 同 seajs.use
     * 如果 seajs 未加载，则缓存数据到队列，以供延迟执行 seajs.use
     *
     * @mehod use
     * @param  {array}    modules  依赖模块
     * @param  {function} callback 待执行函数
     */
    use: function(modules, callback) {
      if (!seajs) {
        queue.push([modules, callback]);
      } else {
        seajs.use(modules, callback);
        //统计,如果要统计实例化次数，还需从callback中提取new的次数，但循环中反复调用也只能统计一次.
        //window.messageBus && window.messageBus.fire('useModule',modules);
      }
    }

  };

  /**
   * dom ready, from jquery 1.11.1
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
      window.setTimeout( callback );

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
              return window.setTimeout( doScrollCheck, 50 );
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

  // 配置 seajs；处理队列；处理 autoRender
  function init() {
    var task,tmpModules = [];

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
        'floatshare' : 'pandora/share/1.0.0/floatshare',
        'attitude' : 'pandora/attitude/1.0.0/attitude',
        'floating' : 'pandora/floating/1.0.0/floating',
        'floatanchor' : 'pandora/floating/1.0.0/floatanchor',
        'accordion' : 'pandora/accordion/1.0.0/accordion',
        'multiplevote' : 'pandora/vote/1.0.0/multiplevote',
        'singlevote' : 'pandora/vote/1.0.0/singlevote',
        'support' : 'pandora/vote/1.0.0/support',
        'switchable': 'pandora/switchable/1.0.0/switchable',
        'tabs': 'pandora/tabs/1.0.0/tabs',
        'tips': 'pandora/dialog/1.0.0/tips',
        'validate': 'pandora/validate/1.0.0/validate',
        'viewpoint' : 'pandora/viewpoint/1.0.0/viewpoint',
        'gallery' : 'pandora/gallery/1.0.0/gallery',
        'widget': 'pandora/widget/1.0.0/widget',
        'statistics' : 'pandora/statistics/1.0.0/statistics',
        'messagebus' : 'pandora/messagebus/1.0.0/messagebus',

        'handlebars': 'gallery/handlebars/1.3.0/handlebars-runtime'
      },
      map: [
        // 时间戳，用于避免缓存
        [/\.js$/, '.js?@TIMESTAMP']
      ]
    });


    // 处理队列
    while ((task = queue.shift())) {
      seajs.use(task[0], task[1]);
      tmpModules.push(task[0]);
    }

    // domReady，处理 autoRender
    domReady(function() {
      seajs.use(['widget'], function(Widget) {
        Widget.autoRender();
      });
    });
    /*
    seajs.use(['messagebus','statistics'],function(MessageBus, Statistics){
      window.messageBus = new MessageBus();
      new Statistics();
      for(var i=0;i<tmpModules.length; i++){
        window.messageBus.fire('useModule',tmpModules[i]);
      }
    });
   */

  }

  // 侦听脚本加载完毕事件
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

  // 如果 seajs 未存在，加载它
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
