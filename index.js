/*jslint node: true, forin: true, jslint white: true, newcap: true*/
/*
 * wrappify
 * author : Takeshi Iwana
 * https://github.com/iwatakeshi
 * license : MIT
 * Code heavily borrowed from Adam Draper
 * https://github.com/adamwdraper
 */

(function() {
  'use strict';

  var wrappify,
    hasModule = (typeof module !== 'undefined' && module.exports);

  function Wrappify(core) {
    'use strict';
    this.core = core;
  }

  Wrappify.prototype.express = function() {
    return this.core.ship.bind(this.core);
  };

  Wrappify.prototype.hapi = function(plugin, options, next) {
    var core = this.core;

    function ship(plugin, option, next) {
      plugin.ext('onPreResponse', function(request, reply) {
        core.ship.bind(core)(request);
        reply.continue();
      });
      return next();
    }

    return {
      register: ship,
      options: {}
    }
  };
  wrappify = function(core) {
    return new Wrappify(core);
  };

  /************************************
      Exposing wrappify
  ************************************/

  // CommonJS module is defined
  if (hasModule) {
    module.exports = wrappify;
  }

  /*global ender:false */
  if (typeof ender === 'undefined') {
    // here, `this` means `window` in the browser, or `global` on the server
    // add `wrappify` as a global object via a string identifier,
    // for Closure Compiler 'advanced' mode
    this.wrappify = wrappify;
  }

  /*global define:false */
  if (typeof define === 'function' && define.amd) {
    define([], function() {
      return wrappify;
    });
  }
}).call(this);