'use strict';

var approveButtonDirective = require('./approvebutton.directive');

module.exports = angular.module('approveApp')

  .directive('approveApp', approveButtonDirective)

  .name;
