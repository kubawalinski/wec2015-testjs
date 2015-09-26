(function(){
    "use strict";

    describe("autosave service", function () {
        var persistenceMock, notificationMock, data;

        beforeEach(module(function ($provide) {
            persistenceMock = jasmine.createSpyObj("persistence", ["save"]);
            notificationMock = jasmine.createSpyObj("notification", ["success"]);
            persistenceMock.isSavingRequired = function(){ return true; };
            $provide.value("persistence", persistenceMock);
            $provide.value("notification", notificationMock);
        }));

        beforeEach(inject(function ($injector) {
            data = $injector.get("data");
            data.model = { name : "model name" } ;
        }));

        it("should save after 10 seconds have passed and not before", inject(function ($interval, autosave) {
            $interval.flush(2000);
            expect(persistenceMock.save).not.toHaveBeenCalled();
            $interval.flush(2000);
            expect(persistenceMock.save).not.toHaveBeenCalled();
            $interval.flush(2000);
            expect(persistenceMock.save).not.toHaveBeenCalled();
            $interval.flush(2000);
            expect(persistenceMock.save).not.toHaveBeenCalled();
            $interval.flush(2000);
            expect(persistenceMock.save).toHaveBeenCalled();
        }));

        it("should display success notification after saving", inject(function ($interval, autosave) {
            $interval.flush(10000);
            expect(persistenceMock.save).toHaveBeenCalled();
            expect(notificationMock.success).toHaveBeenCalled();
        }));

        it("should save exactly 2 times after 20 seconds have passed", inject(function ($interval, autosave) {
            $interval.flush(20000);
            expect(persistenceMock.save.callCount).toBe(2);
        }));

        it("should save with the name from the model if specified", inject(function ($interval, autosave) {
            $interval.flush(10000);
            expect(persistenceMock.save).toHaveBeenCalledWith(data.model.name, data.model);
        }));

        it("should save with a temp name if name was not provided in the model", inject(function ($interval, autosave) {
            data.model.name = null;
            $interval.flush(10000);
            expect(data.model.name).toMatch(/^temp\d+/);
        }));

        it("should not save if it is not required", inject(function ($interval, autosave) {
            persistenceMock.isSavingRequired = function() { return false; };
            $interval.flush(10000);
            expect(persistenceMock.save).not.toHaveBeenCalled();
        }));
    });
})();
