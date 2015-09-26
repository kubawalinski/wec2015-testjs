(function(){
    "use strict";

    describe('trimTo filter', function() {
        it('should leave shorter string without trimming if limit is bigger', inject(function(trimToFilter) {
            var trimmedResult = trimToFilter("shorter string", 50);

            expect(trimmedResult).toEqual("shorter string");
        }));

        it('should leave empty string untouched', inject(function(trimToFilter) {
            var trimmedResult = trimToFilter("", 2);

            expect(trimmedResult).toEqual("");
        }));

        it('should return empty string if undefined is passed as input', inject(function(trimToFilter){
            var trimmedResult = trimToFilter(undefined, 2);

            expect(trimmedResult).toEqual("");
        }));

        it('should return empty string if null is passed as input', inject(function(trimToFilter){
            var trimmedResult = trimToFilter(null, 2);

            expect(trimmedResult).toEqual("");
        }));

        it('should trim too long string excluding 5 chars needed for brackets and dots', inject(function(trimToFilter) {
            var trimmedResult = trimToFilter("this has 28 characters in it", 17);

            expect(trimmedResult).toEqual("this has 28 (...)");
        }));
    });

    describe('range filter', function() {
        it('should return an array with the requested number of elements', inject(function(rangeFilter) {
            var numberOfElements = 10;
            var selectedRange = rangeFilter([], numberOfElements);

            expect(selectedRange.length).toEqual(numberOfElements);
        }));

        it('should return an empty array when requested length is 0', inject(function(rangeFilter) {
            var selectedRange = rangeFilter([], 0);

            expect(selectedRange.length).toEqual(0);
        }));
    });

    describe('currencyConverter filter', function() {
        var data;

        beforeEach(inject(function ($injector) {
            data = $injector.get("data");

            data.model = {
                currencySymbol: "@@",
                currencyExchangeRate: "2.54"
            };
        }));

        it('should return the currency symbol specified at the beginning of the result', inject(function(currencyConverterFilter) {
            var symbol = "#$%";
            var result = currencyConverterFilter(100, symbol, 1);

            expect(result.substring(0, symbol.length)).toEqual(symbol);
        }));

        it('should return the symbol from data service at the beginning of the result if currency symbol is not specified as a parameter', inject(function(currencyConverterFilter) {
            var result = currencyConverterFilter(100);

            expect(result.substring(0, data.model.currencySymbol.length)).toEqual(data.model.currencySymbol);
        }));

        it('should return the $ symbol at the beginning of the result if currency symbol is not specified in data service', inject(function(currencyConverterFilter) {
            data.model.currencySymbol = "";
            var result = currencyConverterFilter(100);

            expect(result.substring(0, 1)).toEqual("$");
        }));

        it('should return the currency symbol specified at the end of the result when requested', inject(function(currencyConverterFilter) {
            var symbol = "#$%";
            var result = currencyConverterFilter(100, symbol, 1, true);

            expect(result.substring(result.length - symbol.length)).toEqual(symbol);
        }));

        it('should return the symbol from data service at the end of the result when requested if currency symbol is not specified as a parameter', inject(function(currencyConverterFilter) {
            var result = currencyConverterFilter(100, "", 1, true);

            expect(result.substring(result.length - data.model.currencySymbol.length)).toEqual(data.model.currencySymbol);
        }));

        it('should return the $ symbol at the end of the result when requested if currency symbol is not specified in data service', inject(function(currencyConverterFilter) {
            data.model.currencySymbol = "";
            var result = currencyConverterFilter(100, "", 1, true);

            expect(result.substring(result.length - 1)).toEqual("$");
        }));

        it('should multiply the amount by the specified exchange rate', inject(function(currencyConverterFilter) {
            var amount = 100;
            var exchangeRate = 2.16;
            var result = currencyConverterFilter(amount, "", exchangeRate);
            var numericResult = Number(result.replace(/[^0-9\.-]+/g,""));

            expect(numericResult).toEqual(amount * exchangeRate);
        }));

        it('should multiply the amount by the specified exchange rate from the data service if no parameter is passed', inject(function(currencyConverterFilter) {
            var amount = 100;
            var result = currencyConverterFilter(amount);
            var numericResult = Number(result.replace(/[^0-9\.-]+/g,""));

            expect(numericResult).toEqual(amount * data.model.currencyExchangeRate);
        }));

        it('should multiply the amount by the default exchange rate of 1 if no exchange rate is specified in the parameters or data service ', inject(function(currencyConverterFilter) {
            var amount = 100;
            data.model.currencyExchangeRate = undefined;
            var result = currencyConverterFilter(amount);
            var numericResult = Number(result.replace(/[^0-9\.-]+/g,""));

            expect(numericResult).toEqual(amount);
        }));
    });
})();
