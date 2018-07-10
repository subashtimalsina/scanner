/*
 *
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 *
*/

describe("compass", function () {
    var compass = require('cordova/plugin/compass'),
        utils = require('cordova/utils'),
        exec = require('cordova/exec');

    beforeEach(function() {
        exec.reset();
    });

    describe("when getting the current heading", function () {
        it("throws an error and doesn't call exec when no success callback given", function () {
            expect(function() { compass.getCurrentHeading() }).toThrow();
        });

        it("throws an error and doesn't call exec when success isn't a function", function () {
            expect(function() { compass.getCurrentHeading(12) }).toThrow();
        });

        it("throws an error and doesn't call exec when error isn't a function", function () {
            var func = function () {};
            expect(function() { compass.getCurrentHeading(func, 12) }).toThrow();
        });

        it("calls exec", function () {
            var s = function () {},
                f = function () {};

            compass.getCurrentHeading(s, f);
            expect(exec).toHaveBeenCalledWith(jasmine.any(Function), jasmine.any(Function), "Compass", "getHeading", [undefined]);
        });
    });

    describe("watch heading", function () {
        beforeEach(function () { 
            spyOn(window, "setInterval").andReturn("def");
        });

        it("throws an error and doesn't call exec when no success callback given", function () {
            expect(function() { compass.watchHeading() }).toThrow();
        });

        it("throws an error and doesn't call exec when success isn't a function", function () {
            expect(function() { compass.watchHeading(12) }).toThrow();
        });

        it("throws an error and doesn't call exec when error isn't a function", function () {
            var func = function () {};
            expect(function() { compass.watchHeading(func, 12) }).toThrow();
        });

        it("generates and returns a uuid for the watch", function () {
            spyOn(utils, "createUUID").andReturn(1234);

            var result = compass.watchHeading(function () {});
            expect(result).toBe(1234);
        });

        describe("setting the interval", function () {
            it("is 100 when not provided", function () {
                compass.watchHeading(function () {});
                expect(window.setInterval).toHaveBeenCalledWith(jasmine.any(Function), 100);
            });

            it("is 100 when options provided with no frequency", function () {
                compass.watchHeading(function () {}, null, {});
                expect(window.setInterval).toHaveBeenCalledWith(jasmine.any(Function), 100);
            });

            it("is the provided value", function () {
                compass.watchHeading(function () {}, null, {frequency: 200});
                expect(window.setInterval).toHaveBeenCalledWith(jasmine.any(Function), 200);
            });
        });

        it("gets the compass value for the given interval", function () {
            var success = jasmine.createSpy(),
                fail = jasmine.createSpy();

            compass.watchHeading(success, fail);

            //exec the interval callback!
            window.setInterval.mostRecentCall.args[0]();
            expect(exec).toHaveBeenCalledWith(jasmine.any(Function), jasmine.any(Function), "Compass", "getHeading", [undefined]);
        });
    });

    describe("when clearing the watch", function () {
        beforeEach(function () {
            spyOn(window, "clearInterval");
        });

        it("doesn't clear anything if the timer doesn't exist", function () {
            compass.clearWatch("Never Gonna Give you Up");
            expect(window.clearInterval).not.toHaveBeenCalled();
        });

        it("can be called with no args", function () {
            compass.clearWatch();
            expect(window.clearInterval).not.toHaveBeenCalled();
        });
    });
});
