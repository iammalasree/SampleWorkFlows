
describe('SSN mask filter', function () {
  'use strict';

  var $filter;

  beforeEach(function() {
    angular.mock.module('sc.common');
    inject(function (_$filter_) {
      $filter = _$filter_;
    });
  });

  it('should return SSN with Dashes and N/A based on the Input SSN', function () {
    expect($filter('ssnDashFilter')('*****6789')).toEqual('XXX-XX-6789');
    expect($filter('ssnDashFilter')('N/A')).toEqual('N/A');
    expect($filter('ssnDashFilter')(undefined)).toEqual('N/A');
  });

  it('should use a custom empty message', function () {
    expect($filter('ssnDashFilter')('*****6789', 'msg')).toEqual('XXX-XX-6789');
    expect($filter('ssnDashFilter')('N/A', 'msg')).toEqual('msg');
    expect($filter('ssnDashFilter')(undefined, 'msg')).toEqual('msg');
  });
});