KISSY.add('modelproxy', (S, IO) => {
  function Proxy(options) {
    this._opt = options;
  }
  Proxy.prototype = {
    request(params, callback, errCallback) {
      IO({
        url: `${Proxy.base}/${this._opt.id}`,
        data: params,
        type: this._opt.method,
        dataType: this._opt.dataType,
        success: callback,
        error: errCallback,
      });
    },
    getOptions() {
      return this._opt;
    },
  };

  Proxy.objects = {};

  Proxy.create = function (id) {
    if (this.objects[id]) {
      return this.objects[id];
    }
    const options = this._interfaces[id];
    if (!options) {
      throw new Error(`No such interface id defined: ${
                  id}, please check your interface configuration file`);
    }
    return this.objects[id] = new this(options);
  },

    Proxy.configBase = function (base) {
      if (this.base) return;
      this.base = (base || '').replace(/\/$/, '');
      const self = this;
        // load interfaces definition.
      IO({
        url: `${this.base}/$interfaces`,
        async: false,
        type: 'get',
        dataType: 'json',
        success(interfaces) {
          self.config(interfaces);
        },
        error(err) {
          throw err;
        },
      });
    };

  Proxy.config = function (interfaces) {
    this._interfaces = interfaces;
  };

  Proxy.getInterfaceIdsByPrefix = function (pattern) {
    if (!pattern) return [];
    let ids = [],
      map = this._interfaces,
      len = pattern.length;
    for (const id in map) {
      if (id.slice(0, len) == pattern) {
        ids.push(id);
      }
    }
    return ids;
  };

  function ModelProxy(profile) {
    if (!profile) return;

    if (typeof profile === 'string') {
      if (/^(\w+\.)+\*$/.test(profile)) {
        profile = Proxy
                    .getInterfaceIdsByPrefix(profile.replace(/\*$/, ''));
      } else {
        profile = [profile];
      }
    }
    if (profile instanceof Array) {
      let prof = {},
        methodName;
      for (let i = profile.length - 1; i >= 0; i--) {
        methodName = profile[i];
        methodName = methodName
                                .substring(methodName.lastIndexOf('.') + 1);
        if (!prof[methodName]) {
          prof[methodName] = profile[i];
        } else {
          methodName = profile[i].replace(/\./g, '_');
          prof[methodName] = profile[i];
        }
      }
      profile = prof;
    }

    for (const method in profile) {
      this[method] = (function (methodName, interfaceId) {
        const proxy = Proxy.create(interfaceId);
        return function (params) {
          params = params || {};
          if (!this._queue) {
            this._queue = [];
          }
          this._queue.push({
            params,
            proxy,
          });
          return this;
        };
      }(method, profile[method]));
    }
  }

  ModelProxy.prototype = {
    done(f, ef) {
      if (typeof f !== 'function') return;

      if (!this._queue) {
        f.apply(this);
        return;
      }
      this._sendRequestsParallel(this._queue, f, ef);

      this._queue = null;
      return this;
    },
    _sendRequestsParallel(queue, callback, errCallback) {
      let args = [],
        self = this;

      let cnt = queue.length;

      for (let i = 0; i < queue.length; i++) {
        (function (reqObj, k) {
          reqObj.proxy.request(reqObj.params, (data) => {
            args[k] = data;
            --cnt || callback.apply(self, args);
          }, (err) => {
            errCallback = errCallback || self._errCallback;
            if (typeof errCallback === 'function') {
              errCallback(err);
            } else {
              console.error('Error occured when sending request ='
                                , reqObj.proxy.getOptions(), '\nCaused by:\n', err);
            }
          });
        }(queue[i], i));
      }
    },
    error(f) {
      this._errCallback = f;
    },
  };

  ModelProxy.create = function (profile) {
    return new this(profile);
  };

  ModelProxy.configBase = function (path) {
    Proxy.configBase(path);
  };

  return ModelProxy;
}, { requires: ['io'] });
