(function(){
    "use strict";

    describe('notification-box directive', function() {
        var $compile;
        var $rootScope;
        var notificationBox;

        beforeEach(module('components/notification/notification-box.html'));

        beforeEach(inject(function(_$compile_, _$rootScope_){
            $compile = _$compile_;
            $rootScope = _$rootScope_;
            notificationBox = $compile("<notification-box></notification-box>")($rootScope);
            $rootScope.$digest();
        }));

        describe('when receiving a notification message', function(){
            var testMessage = 'This is a test message for notification service unit tests';

            var broadcastMessageAndCheckMarkup = function(notification, messageType){
                notification[messageType](testMessage);
                $rootScope.$apply();
                expect(notificationBox.html()).toContain(testMessage);
                expect(notificationBox[0].children[1].className).toContain(messageType);
            };

            it("renders the message and sets 'info' class when info message was broadcasted", inject(function(notification) {
                broadcastMessageAndCheckMarkup(notification, "info");
            }));

            it("renders the message and sets 'error' class when error message was broadcasted", inject(function(notification) {
                broadcastMessageAndCheckMarkup(notification, "error");
            }));

            it("renders the message and sets 'success' class when info success was broadcasted", inject(function(notification) {
                broadcastMessageAndCheckMarkup(notification, "success");
            }));

            it("hides the notification after some time", inject(function(notification, $timeout) {
                var messageType = "info";
                broadcastMessageAndCheckMarkup(notification, messageType);
                $timeout.flush();
                expect(notificationBox.html()).not.toContain(testMessage);
                expect(notificationBox[0].children[1].className).not.toContain(messageType);
            }));
        });
    });
})();
