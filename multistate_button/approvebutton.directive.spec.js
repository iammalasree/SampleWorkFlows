describe("Common: Approve Button Directive", function () {
	'use strict';

	var $scope, scope, el, ctrl, $compile, $rootScope;

  beforeEach(function() {
    angular.mock.module('sc.common');
    angular.mock.module('scui.templates');
  });
	
  beforeEach(inject(function ($injector) {
    $compile = $injector.get('$compile');
    $rootScope = $injector.get('$rootScope');
    $scope = $rootScope.$new();
  }));

  var compileButton = function(markup) {
  	el = angular.element(markup);
		$compile(el)($scope);
		$scope.$digest();
		return el;
  }

  it('should have default values', function() {
    compileButton('<div sc-approve-button></div>');
    
    expect(el.find('.start-confirm').text()).toEqual('Approve');
    expect(el.find('.action-confirm').text()).toEqual('Confirm');
    expect(el.find('.process-confirm span').text()).toEqual('Processing');
    expect(el.find('.approved-confirm span').text()).toEqual('Approved');
    expect(el.find('.denied-confirm span').text()).toEqual('Error');
  });

	it('should set button text from config', function() {
		$scope.btnConfig = {
			startText: 'Test Approve',
			confirmText: 'Test Confirm',
			processingText: 'Test Processing',
			doneText: 'Test Approved',
      errorText: 'Test Error'
		};

		compileButton('<div sc-approve-button config="btnConfig"></div>');
		
		expect(el.find('.start-confirm').text()).toEqual('Test Approve');
		expect(el.find('.action-confirm').text()).toEqual('Test Confirm');
		expect(el.find('.process-confirm span').text()).toEqual('Test Processing');
		expect(el.find('.approved-confirm span').text()).toEqual('Test Approved');
    expect(el.find('.denied-confirm span').text()).toEqual('Test Error');
	});

  it('should set button widths', function() {
    $scope.btnConfig = {
      startText: ['Test Approve', 100],
      confirmText: ['Test Confirm', 110],
      processingText: ['Test Processing', 120],
      doneText: ['Test Approved', 105],
      errorText: ['Test Error', 115]
    };

    compileButton('<div sc-approve-button config="btnConfig"></div>');

    ctrl = el.controller('scApproveButton');
    expect(ctrl.config.startTextWidth).toEqual(100);
    expect(ctrl.config.confirmTextWidth).toEqual(110);
    expect(ctrl.config.processingTextWidth).toEqual(120);
    expect(ctrl.config.doneTextWidth).toEqual(105);
    expect(ctrl.config.errorTextWidth).toEqual(115);
  });

	it('should be disabled', function() {
		$scope.btnConfig = {
			startText: "Disabled"
		};
		$scope.disabled = true;
		compileButton('<div sc-approve-button config="btnConfig" disabled="disabled"></div>')
	});

	it('should have some callbacks', function() {
		$scope.btnConfig = {
			startText: 'hello',
			onInit: function() {
			}
		};

		el = compileButton('<div sc-approve-button config="btnConfig"></div>')

		ctrl = el.controller('scApproveButton');

		// ctrl.startFn();

	})


})