(function() {
    "use strict";

    describe('financialRiskEstimator service', function () {

        it("should return undefined when not initialised with cost sensitivity data", inject(function ($injector) {
            var estimator = $injector.get("financialRiskEstimator");
            expect(estimator.getCost(45)).not.toBeDefined();
        }));

        describe("estimatedCost", function () {
            var estimator;

            beforeEach(inject(function ($injector) {
                estimator = $injector.get("financialRiskEstimator");

                estimator.setCostSensitivityData([
                    {"percentage": 40, "cost": 1000 },
                    {"percentage": 20, "cost": 2000 },
                    {"percentage": 30, "cost": 3000 },
                    {"percentage": 10, "cost": 5000 }
                ]);
            }));

            it("should be 1000 for target percentage below 40", function () {
                expect(estimator.getCost(35)).toEqual(1000);
            });

            it("should be 1000 for target percentage equal to 40", function () {
                expect(estimator.getCost(40)).toEqual(1000);
            });

            it("should be 2000 for target percentage equal to 41", function () {
                expect(estimator.getCost(41)).toEqual(2000);
            });

            it("should be 2000 for target percentage in (40, 60)", function () {
                expect(estimator.getCost(54)).toEqual(2000);
            });

            it("should be 2000 for target percentage equal to 60", function () {
                expect(estimator.getCost(60)).toEqual(2000);
            });

            it("should be 3000 for target percentage equal to 61", function () {
                expect(estimator.getCost(61)).toEqual(3000);
            });

            it("should be 3000 for target percentage in (60, 90)", function () {
                expect(estimator.getCost(88)).toEqual(3000);
            });

            it("should be 3000 for target percentage equal to 90", function () {
                expect(estimator.getCost(90)).toEqual(3000);
            });

            it("should be 5000 for target percentage equal to 91", function () {
                expect(estimator.getCost(91)).toEqual(5000);
            });

            it("should be 5000 for target percentage in (90, 100)", function () {
                expect(estimator.getCost(98)).toEqual(5000);
            });

            it("should be 5000 for target percentage equal to 100", function () {
                expect(estimator.getCost(100)).toEqual(5000);
            });
        });
    });
})();
