/* eslint-disable func-names, space-before-function-paren, no-var, prefer-rest-params, wrap-iife, no-console, quotes, prefer-template, max-len */
/* global u2f */

(function() {
  var bind = function(fn, me) { return function() { return fn.apply(me, arguments); }; };

  this.U2FError = (function() {
    function U2FError(errorCode, u2fFlowType) {
      this.errorCode = errorCode;
      this.message = bind(this.message, this);
      this.httpsDisabled = window.location.protocol !== 'https:';
      this.u2fFlowType = u2fFlowType;
    }

    U2FError.prototype.message = function() {
      if (this.errorCode === u2f.ErrorCodes.BAD_REQUEST && this.httpsDisabled) {
        return 'U2F仅适用于启用HTTPS的网站。有关详细信息，请与管理员联系。';
      } else if (this.errorCode === u2f.ErrorCodes.DEVICE_INELIGIBLE) {
        if (this.u2fFlowType === 'authenticate') return '此设备尚未向我们注册。';
        if (this.u2fFlowType === 'register') return '此设备已在我们的注册。';
      }
      return "与您的设备通信时出现问题。";
    };

    return U2FError;
  })();
}).call(this);
