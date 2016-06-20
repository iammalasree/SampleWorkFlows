'use strict';

angular.module('common')
    .factory('spinnerService', spinnerService);

spinnerService.$inject = ['$rootScope'];
function spinnerService($rootScope) {
    return {
        show: show,
        hide: hide
    };

    function show(config) {
        $rootScope.$broadcast('spinner-show', config);
    }

    function hide() {
        $rootScope.$broadcast('spinner-hide');
    }

}