(function(){
    "use strict";

    describe('notification service', function() {

        var testMessage = 'This is a test message for notification service unit tests';

        var rootScope;
        beforeEach(inject(function($injector) {
            rootScope = $injector.get('$rootScope');
            spyOn(rootScope, '$broadcast');
        }));

        it("should broadcast info event when info method called", inject(function(notification) {
            notification.info(testMessage);
            expect(rootScope.$broadcast).toHaveBeenCalledWith('notification', {type: "info", message: testMessage});
        }));

        it("should broadcast success event when success method called", inject(function(notification) {
            notification.success(testMessage);
            expect(rootScope.$broadcast).toHaveBeenCalledWith('notification', {type: "success", message: testMessage});
        }));

        it("should broadcast error event when error method called", inject(function(notification) {
            notification.error(testMessage);
            expect(rootScope.$broadcast).toHaveBeenCalledWith('notification', {type: "error", message: testMessage});
        }));
    });
})();
