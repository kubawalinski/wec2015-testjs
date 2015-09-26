(function(){
    "use strict";

    describe('reportGenerator service', function() {
        var reportGenerator, $httpBackend, $rootScope, connectionId, roadmapId, url;

        beforeEach(function() {
            connectionId = 1;
            roadmapId = "sampleID";
            url = "../api/costreports/" + roadmapId + "/?connectionId=" + connectionId;

            module("lcc", function($provide){
                $provide.value('Hub', function(name, features){
                    this.updateProgress = features['listeners']['updateProgress'];
                    this.connection = {id: connectionId};
                });
            });

            inject(function (_$rootScope_, _$httpBackend_, _reportGenerator_) {
                $httpBackend = _$httpBackend_;
                reportGenerator = _reportGenerator_;
                $rootScope = _$rootScope_;
            });
        });

        it('should update the progress indicator with the value obtained from SignalR', function () {
            var newProgress = 66;
            expect(reportGenerator.percentageComplete).toEqual(0);
            reportGenerator.hub.updateProgress(newProgress);
            $rootScope.$apply();
            expect(reportGenerator.percentageComplete).toEqual(newProgress);
        });

        it('should reset the progress indicator when report data is loaded successfully', function () {
            var newProgress = 66;
            expect(reportGenerator.percentageComplete).toEqual(0);
            reportGenerator.hub.updateProgress(newProgress);
            $rootScope.$apply();
            expect(reportGenerator.percentageComplete).toEqual(newProgress);
            $httpBackend.whenGET(url).respond(200, ''); //simulate successful http call
            reportGenerator.generateReport(roadmapId);
            $httpBackend.flush();
            expect(reportGenerator.percentageComplete).toEqual(0);
        });

        it('should reset the progress indicator when report data fails to load', function () {
            var newProgress = 66;
            expect(reportGenerator.percentageComplete).toEqual(0);
            reportGenerator.hub.updateProgress(newProgress);
            $rootScope.$apply();
            expect(reportGenerator.percentageComplete).toEqual(newProgress);
            $httpBackend.whenGET(url).respond(500, ''); //simulate failed http call
            reportGenerator.generateReport(roadmapId);
            $httpBackend.flush();
            expect(reportGenerator.percentageComplete).toEqual(0);
        });
    });
})();
