'use strict';

angular.module('spinner')
    .directive('spinner', spinner);

function spinner() {
    return {
        restrict: 'EA',
        templateUrl: 'scripts/common/spinner/spinner.html',
        controller: spinnerControllerFn,
        controllerAs: 'spinnerCtrl',
        bindToController: true
    };
}

SpinnerControllerFn.$inject = ['$scope'];
function spinnerControllerFn($scope) {
    var spinnerCtrl = this;

    $scope.$on('spinner-show', function (eventObj, config) {
        SpinnerCtrl.config = config;
        SpinnerCtrl.show = true;
    });

    $scope.$on('spinner-hide', hide);

    $scope.$on('$destroy', hide);

    function hide() {
        scSpinnerCtrl.show = false;
    }
}
