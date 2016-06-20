'use strict';

module.exports = approveButtonDirective;

approveButtonDirective.$inject = ['$timeout'];

function approveButtonDirective($timeout) {

	return {
		restrict: "EA",
		scope: {
			config: '=?',
			reset: '=?',
			disabled: '=?',

			// These hooks can be passed through 'config' param
			// but are also avaialbe here for backwards portability
			onInit: '&',
			onConfirm: '&',
			onCancel: '&'
		},
		templateUrl: 'scripts/common/approvebutton/approvebutton.html',
		link: linkFn,
		controller: ApproveButtonController,
		controllerAs: 'BtnCtrl',
		bindToController: true
	}

	function linkFn(scope, el, attr, ctrl)
	{
		// support for old way of assigning callback hooks
		if (angular.isDefined(attr.onInit)) {
			ctrl.config.onInit = ctrl.onInit;
		}
		if (angular.isDefined(attr.onConfirm)) {
			ctrl.config.onConfirm = ctrl.onConfirm;
		}
		if (angular.isDefined(attr.onCancel)) {
			ctrl.config.onCancel = ctrl.onCancel;
		}

		// UI	
		var btnContainer = el.find('.btn-confirm__approve');
		var startBtnUI = el.find('.start-confirm');
		var confirmBtnUI = el.find('.action-confirm');
		var processBtnUI = el.find('.process-confirm');
		var doneBtnUI = el.find('.approved-confirm');
		var errorBtnUI = el.find('.denied-confirm');
		var carousel = el.find('.carousel-confirm');
		var cancelBtn = el.find('.cancel-btn');
		var cancelBtnUI = cancelBtn.find('span');
    var disableBtnUI = el.find('.btn-confirm__disabled--text');

    var startTextWidth;
		var confirmTextWidth;
		var processingTextWidth;
		var doneTextWidth;
		var errorTextWidth;

		function calculateWidths() {
			var padding = 10;
			var textMargin = 15;

			startTextWidth = (ctrl.config.startTextWidth) ? ctrl.config.startTextWidth : startBtnUI.width() + padding;
			confirmTextWidth = (ctrl.config.confirmTextWidth) ? ctrl.config.confirmTextWidth : confirmBtnUI.width() + padding;
			processingTextWidth = (ctrl.config.processingTextWidth) ? ctrl.config.processingTextWidth : processBtnUI.width() + padding;
			doneTextWidth = (ctrl.config.doneTextWidth) ? ctrl.config.doneTextWidth : doneBtnUI.width() + padding;
			errorTextWidth = (ctrl.config.errorTextWidth) ? ctrl.config.errorTextWidth : errorBtnUI.width() + padding;

			// Carousel steps
			ctrl.steps = {};
			ctrl.steps.confirm = startTextWidth + textMargin;
			ctrl.steps.processing = ctrl.steps.confirm + confirmTextWidth + textMargin;
			ctrl.steps.approved = ctrl.steps.processing + processingTextWidth + textMargin;
			ctrl.steps.denied = ctrl.steps.approved + doneTextWidth + textMargin;

			btnContainer.width( startTextWidth );
			startBtnUI.width( startTextWidth );
			confirmBtnUI.width( confirmTextWidth );
			processBtnUI.width( processingTextWidth );
			doneBtnUI.width( doneTextWidth );
			errorBtnUI.width( errorTextWidth );
      disableBtnUI.width(startTextWidth);
    }

		$timeout(calculateWidths);

		ctrl.resetFn = function() {
			ctrl.state = 'init';
			ctrl.reset = false;
			carousel.css('marginLeft', 0);
			btnContainer.width( startTextWidth );
			cancelBtn.css('width', 0);
		}

		ctrl.startFn = function() {
			ctrl.state = 'confirm';
			scope.$apply();
			ctrl.config.onInit();
			cancelBtn.animate({width:'120px'}, 350);
			carousel.css('marginLeft', -(ctrl.steps.confirm));
			btnContainer.width( confirmTextWidth );
		}

		ctrl.cancelFn = function(e) {
			ctrl.state = 'init';
			ctrl.config.onCancel();
			cancelBtn.animate({width:'0px'},350);
			carousel.css('marginLeft', 0);
			btnContainer.width( startTextWidth );
		}

		ctrl.confirmFn = function() {
			ctrl.state = 'processing';
			scope.$apply();
			cancelBtn.animate({width:'0px'},350);
			carousel.css('marginLeft', -(ctrl.steps.processing));
			btnContainer.width( processingTextWidth );

			ctrl.config.onConfirm().then(
				function(){
					ctrl.state = 'success';
					carousel.css('marginLeft', -(ctrl.steps.approved));
					btnContainer.width( doneTextWidth );
				},
				function() {
					ctrl.state = 'fail';
					carousel.css('marginLeft', -(ctrl.steps.denied));
					btnContainer.width( errorTextWidth );
					// if fail, then reset button
					$timeout(ctrl.resetFn, 2000);
				}
			);
		}


		// Events
		startBtnUI.bind('click', ctrl.startFn);
		cancelBtnUI.bind('click', ctrl.cancelFn);
		confirmBtnUI.bind('click', ctrl.confirmFn);

		// wathers
		scope.$watch(function(){return ctrl.reset}, function(value) {
			if (value) {
				ctrl.resetFn();
			}
		});
	};

}

ApproveButtonController.$inject = ['$scope', '$timeout', '$q', 'lodash'];

function ApproveButtonController($scope, $timeout, $q, _) {
	var vm = this;

	var defaults = {
		startText: 'Approve',
		confirmText: 'Confirm',
		processingText: 'Processing',
		doneText: 'Approved',
		errorText: 'Error',
		onInit: function() {},
		onCancel: function() {},
		onConfirm: function() {
			var defer = $q.defer();
			$timeout(defer.resolve, 2000);
			return defer.promise;
		}
	};

	if (!vm.config) {
		vm.config = defaults;
	}

	_.each(['start','confirm','processing','done', 'error'], function(i) {
		if (_.isArray(vm.config[i+'Text'])) {
			vm.config[i+'TextWidth'] = vm.config[i+'Text'][1];
			vm.config[i+'Text'] = vm.config[i+'Text'][0];
		}
		else {
				// check if defaults are needed
			if (!vm.config[i+'Text']) {
				vm.config[i+'Text'] = defaults[i+'Text'];
			}	
		}
	});
}

