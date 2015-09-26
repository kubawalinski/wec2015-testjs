(function(){
    "use strict";

    describe('costReport service', function() {

        describe('loadReport', function() {
            var deferredGenerate, $rootScope, mockReportGenerator, mockNotification, testData, costReport, mockRoadmap, mockPersistence, deferredSave;

            var fakeModel = {
                name: "fake",
                identifier: "fakeId",
                currentYear: 2001
            };

            beforeEach(function() {
                mockNotification = {
                    error: jasmine.createSpy(),
                    success: jasmine.createSpy()
                };

                mockReportGenerator = {};

                mockRoadmap = {
                    getDto: function(model) { return null; }
                };

                mockPersistence = {};

                module("lcc", function($provide){
                    $provide.value('reportGenerator', mockReportGenerator);
                    $provide.value('notification', mockNotification);
                    $provide.value('Roadmap', mockRoadmap);
                    $provide.value('persistence', mockPersistence);
                });

                inject(function ($q, _$rootScope_, _costReport_) {
                    $rootScope = _$rootScope_;
                    costReport = _costReport_;
                    costReport.prepareReport = jasmine.createSpy();

                    mockReportGenerator.generateReport = function(id){
                        deferredGenerate = $q.defer();
                        return deferredGenerate.promise;
                    };

                    mockPersistence.save = function(identifier, model) {
                        deferredSave = $q.defer();
                        return deferredSave.promise;
                    };

                    spyOn(mockPersistence, 'save').andCallThrough();
                });
            });

            it('should set the reportLoaded flag after successfully loading the report data', function () {
                expect(costReport.reportLoaded).toBeFalsy();
                costReport.loadReport();
                deferredSave.resolve();
                $rootScope.$apply();
                deferredGenerate.resolve({data: fakeModel});
                $rootScope.$apply();
                expect(costReport.reportLoaded).toBeTruthy();
            });

            it('should notify success after successfully loading the report data', function () {
                costReport.loadReport();
                deferredSave.resolve();
                $rootScope.$apply();
                deferredGenerate.resolve({data: fakeModel});
                $rootScope.$apply();
                expect(mockNotification.success).toHaveBeenCalled();
            });

            it('should prepare report data for displaying after successfully loading it', function () {
                costReport.loadReport();
                deferredSave.resolve();
                $rootScope.$apply();
                deferredGenerate.resolve({data: fakeModel});
                $rootScope.$apply();
                expect(costReport.prepareReport).toHaveBeenCalledWith(fakeModel);
            });

            it('should not set the reportLoaded flag after failing to load the report data', function () {
                expect(costReport.reportLoaded).toBeFalsy();
                costReport.loadReport();
                deferredSave.resolve();
                $rootScope.$apply();
                deferredGenerate.reject();
                $rootScope.$apply();
                expect(costReport.reportLoaded).toBeFalsy();
            });

            it('should notify error after failing to load the report data', function () {
                costReport.loadReport();
                deferredSave.resolve();
                $rootScope.$apply();
                deferredGenerate.reject();
                $rootScope.$apply();
                expect(mockNotification.error).toHaveBeenCalled();
            });

            it('should not prepare report data for displaying when loading failed', function () {
                costReport.loadReport();
                deferredSave.resolve();
                $rootScope.$apply();
                deferredGenerate.reject();
                $rootScope.$apply();
                expect(costReport.prepareReport).not.toHaveBeenCalled();
            });

            it('should save report before generation', function() {
                costReport.loadReport();
                deferredSave.resolve();
                $rootScope.$apply();
                deferredGenerate.resolve({data: fakeModel});
                $rootScope.$apply();
                expect(mockPersistence.save).toHaveBeenCalled();
            });
        });




        describe("isCurrentReportOutdated", function() {
            var $rootScope, costReport, mockReportGenerator, mockNotification, mockPersistence, deferred, deferredSave, mockRoadmap, mockData;

            beforeEach(function() {
                mockReportGenerator = {};
                mockPersistence = {};
                mockRoadmap = {
                    getDto: function(model) { return _.cloneDeep(model); }
                };

                mockData = {};

                module("lcc", function($provide){
                    $provide.value('reportGenerator', mockReportGenerator);
                    $provide.value('persistence', mockPersistence);
                    $provide.value('Roadmap', mockRoadmap);
                    $provide.value('data', mockData);
                });

                mockData.model = {
                    name: "test",
                    data: [1, 2, 3, 4],
                    child: { value: "5555" }
                };

                inject(function ($q, _$rootScope_, _costReport_) {
                    $rootScope = _$rootScope_;
                    costReport = _costReport_;

                    costReport.prepareReport = function() {};

                    mockReportGenerator.generateReport = function(id){
                        deferred = $q.defer();
                        return deferred.promise;
                    };

                    mockPersistence.save = function(identifier, model) {
                        deferredSave = $q.defer();
                        return deferredSave.promise;
                    };
                });
            });

            it('should return true when no reports have been generated', function(){
                var isOutdated = costReport.isCurrentReportOutdated();
                expect(isOutdated).toEqual(true);
            });

            it('should return false when the roadmap has not changed since the last report generation', function(){
                costReport.loadReport();
                deferredSave.resolve();
                $rootScope.$apply();
                deferred.resolve({data: { name: 'dummy roadmap'}});
                $rootScope.$apply();
                var isOutdated = costReport.isCurrentReportOutdated();
                expect(isOutdated).toEqual(false);
            });

            it('should return true when the roadmap has changed since the last report generation', function(){
                costReport.loadReport();
                deferredSave.resolve();
                $rootScope.$apply();
                deferred.resolve({data: 'dummy'});
                $rootScope.$apply();
                mockData.model.child.value = 1000;
                var isOutdated = costReport.isCurrentReportOutdated();
                expect(isOutdated).toEqual(true);
            });
        });

        describe('reportDownload', function() {
            var deferred, mockReportGenerator, costReport, mockRoadmap, mockModal;

            beforeEach(function() {
                mockReportGenerator = {};
                mockModal = {};

                module("lcc", function($provide){
                    $provide.value('reportGenerator', mockReportGenerator);
                    $provide.value('Roadmap', mockRoadmap);
                    $provide.value('$modal', mockModal);
                });

                inject(function ($q, _$rootScope_, _costReport_) {
                    costReport = _costReport_;

                    mockModal.open = function() {
                        deferred = $q.defer();
                        return {
                            result: deferred.promise
                        };
                    };

                    mockReportGenerator.generateReport = function(id){
                        deferred = $q.defer();
                        return deferred.promise;
                    };

                    spyOn(mockModal, 'open').andCallThrough();
                });
            });

            it('should show confirmation dialog if roadmap was changed before reportDownload', function () {
                costReport.isCurrentReportOutdated = function() { return true; };

                costReport.downloadReport();

                expect(mockModal.open).toHaveBeenCalled();
            });

            it('should directly call URL if report is up to date', function () {
                costReport.isCurrentReportOutdated = function() { return false; };

                costReport.downloadReport();

                expect(mockModal.open).not.toHaveBeenCalled();
            });
        });
    });
})();
