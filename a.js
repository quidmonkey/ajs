/* ========================================================================
 * a.js v0.1.0
 * A Lightweight, JavaScript Module System
 *
 * Copyright (c) 2014 Abraham Walters (ninjaspankypants.com)
 * https://github.com/quidmonkey/ajs
 *
 * Author: Abraham Walters
 * Website: http://ninjaspankypants.com/
 *
 * Released under the MIT license
 * https://github.com/quidmonkey/ajs/blob/master/LICENSE
 * ------------------------------------------------------------------------ */
(function (global) {'use strict';
  var modules = {};
  var unloadedModules = [];
  
  function cacheA (name, module) {
    if (modules[name]) {
      throw new Error ('~~~~ ajs: Attempting to register duplicate module name: ' + name);
    }
    modules[name] = module;
  }

  function cacheAnUnloaded (name, dependenciesList, closure) {
    var circularDependency = isCircularDepedency(name, dependenciesList);
    
    if (circularDependency) {
      throw new Error('~~~~ ajs: Unable to load ' + name + '. It shares a circular dependency with ' + circularDependency);
    }

    unloadedModules.push({
      name: name,
      dependenciesList: dependenciesList,
      closure: closure
    });
  }

  function checkForAnUnloaded (name) {
    var unloadedCache = unloadedModules.slice(0);
    var i;
    var unloadedModule;

    for (i = 0; i < unloadedCache.length; i++) {
      unloadedModule = unloadedCache[i];

      if (unloadedModule.dependenciesList.indexOf(name) !== -1) {
        a(unloadedModule.name, unloadedModule.dependenciesList, unloadedModule.closure);
        deleteFromUnloadedModules(unloadedModule);
      }
    }
  }

  function deleteFromUnloadedModules (unloadedModule) {
    var index = unloadedModules.indexOf(unloadedModule);
    unloadedModules.splice(index, 1);
  }

  function getDependencies (dependenciesList) {
    var params = [];
    var i;
    var module;

    for (i = 0; i < dependenciesList.length; i++) {
      module = getA(dependenciesList[i]);
      if (module) {
        params.push(module);
      } else {
        return null;
      }
    }

    return params;
  }

  function isCircularDepedency (name, dependenciesList) {
    var i;
    var unloadedModule;

    for (i = 0; i < unloadedModules.length; i++) {
      unloadedModule = unloadedModules[i];

      if (
        unloadedModule.dependenciesList.indexOf(name) !== -1 &&
        dependenciesList.indexOf(unloadedModule.name) !== -1
      ) {
        return unloadedModule.name;
      }
    }

    return false;
  }

  function removeGlobal (obj) {
    var key;

    for (key in global) {
      if (global.hasOwnProperty(key)) {
        if (global[key] === obj) {
          delete global[key];
          return;
        }
      }
    }
  }

  global.a = global.an = function a () {
    var args = arguments;
    var closure;
    var dependenciesList;
    var name;
    var module;
    var params;

    // Parse overridden function signature.
    if (args.length === 2) {
      closure = args[1];
      dependenciesList = [];
      name = args[0];
    } else {
      closure = args[2];
      dependenciesList = args[1];
      name = args[0];
    }

    params = getDependencies(dependenciesList);

    // Module has unloaded dependencies, so defer
    // loading until all dependencies have been loaded.
    if (!params) { 
      cacheAnUnloaded(name, dependenciesList, closure);
      return;
    }

    // Create module!
    module = closure.apply({}, params);

    cacheA(name, module);

    // Check to see if other modules can be
    // loaded which had this module as a dependency.
    checkForAnUnloaded(name);

    return module;
  };

  // Log out and return the list of unloaded modules.
  // This is useful for debugging why a module did not load.
  global.debugUnloaded = function debugUnloaded () {
    var i;

    console.log('~~~~ ajs: Debug Mode - Unloaded Modules');

    for (i = 0; i < unloadedModules.length; i++) {
      console.log(
        (i + 1) + ') Namespace: ' + unloadedModules[i].name +
        ' with Dependencies: ' + unloadedModules[i].dependenciesList.toString()
      );
    }

    return unloadedModules;
  };

  global.deleteA = global.deleteAn = function deleteA (name) {
    delete modules[name];
  };

  global.getA = global.getAn = function getA (name) {
    return modules[name];
  };

  global.registerA = global.registerAn = function registerA (name, libraryObj) {
    removeGlobal(libraryObj);
    cacheA(name, libraryObj);
  };

})(this);
