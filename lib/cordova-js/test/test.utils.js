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

describe("utils", function () {
    var utils = require('cordova/utils');

    describe("utils.arrayIndexOf", function() {
        it("should return -1 when not found", function() {
            expect(utils.arrayIndexOf([1,2,3], 4)).toBe(-1);
        });
        it("should return 0 for first item", function() {
            expect(utils.arrayIndexOf([1,2,3], 1)).toBe(0);
        });
        it("should return 2 for last item", function() {
            expect(utils.arrayIndexOf([1,2,3], 3)).toBe(2);
        });
        it("should return index of first occurance", function() {
            expect(utils.arrayIndexOf([1,2,1], 1)).toBe(0);
        });
    });

    describe("utils.arrayRemove", function() {
        it("should return true when removed.", function() {
            var a = [1, 2, 3];
            expect(utils.arrayRemove(a, 2)).toBe(true);
            expect(a).toEqual([1, 3]);
        });
        it("should return false when item was not there.", function() {
            var a = [1, 2, 3];
            expect(utils.arrayRemove(a, 4)).toBe(false);
            expect(a).toEqual([1, 2, 3]);
        });
        it("should remove only first occurance", function() {
            var a = [1, 2, 1];
            expect(utils.arrayRemove(a, 1)).toBe(true);
            expect(a).toEqual([2, 1]);
        });
    });

    describe("when cloning", function () {
        it("can clone an array", function () {
            var orig = [1, 2, 3, {four: 4}, "5"];

            expect(utils.clone(orig)).toEqual(orig);
            expect(utils.clone(orig)).not.toBe(orig);
        });

        it("can clone null", function () {
            expect(utils.clone(null)).toBeNull();
        });

        it("can clone undefined", function () {
            expect(utils.clone(undefined)).not.toBeDefined();
        });

        it("can clone a function", function () {
            var f = function () { return 4; };
            expect(utils.clone(f)).toBe(f);
        });

        it("can clone a number", function () {
            expect(utils.clone(4)).toBe(4);
        });

        it("can clone a string", function () {
            expect(utils.clone("why")).toBe("why");
        });

        it("can clone a date", function () {
            var d = Date.now();
            expect(utils.clone(d)).toBe(d);
        });

        it("can clone an object", function () {

            var orig = {
                a: {
                    b: {
                        c: "d"
                    },
                },
                e: "f",
                g: "unit"
            },
            expected = {
                a: {
                    b: {
                        c: "d"
                    },
                },
                e: "f",
                g: "unit"
            };

            expect(utils.clone(orig)).toEqual(expected);
        });
    });

    describe("when closing around a function", function () {
        it("calls the original function when calling the closed function", function () {
            var f = jasmine.createSpy();
            utils.close(null, f)();
            expect(f).toHaveBeenCalled();
        });

        it("uses the correct context for the closed function", function () {
            var context = {};
            utils.close(context, function () {
                expect(this).toBe(context);
            })();
        });

        it("passes the arguments to the closed function", function () {
            utils.close(null, function (arg) {
                expect(arg).toBe(1);
            })(1);
        });

        it("overrides the arguments when provided", function () {
            utils.close(null, function (arg) {
                expect(arg).toBe(42);
            }, [42])(16);
        });
    });

    it("can create a uuid", function () {
        var uuid = utils.createUUID();
        expect(uuid).toMatch(/^(\{{0,1}([0-9a-fA-F]){8}-([0-9a-fA-F]){4}-([0-9a-fA-F]){4}-([0-9a-fA-F]){4}-([0-9a-fA-F]){12}\}{0,1})$/);
        expect(uuid).not.toEqual(utils.createUUID());
    });
    
    describe("vformat() method", function () {
        it("handles passing nothing", function() {
            expect(utils.format()).toBe("")
        })

        it("handles empty args", function() {
            expect(utils.vformat("abc",[])).toBe("abc")
        })

        it("handles empty args and format char", function() {
            expect(utils.vformat("ab%oc",[])).toBe("ab%oc")
        })

        it("handles one arg", function() {
            expect(utils.vformat("a%sb", ["-"])).toBe("a-b")
        })

        it("handles two args", function() {
            expect(utils.vformat("a%sb%sc", ["-","_"])).toBe("a-b_c")
        })
    })
        
    describe("format() method", function () {
        it("handles passing nothing", function() {
            expect(utils.format()).toBe("")
        })

        it("handles the empty string", function() {
            expect(utils.format("")).toBe("")
        })

        it("handles null", function() {
            expect(utils.format(null)).toBe("")
        })
        
        it("handles undefined", function() {
            expect(utils.format(undefined)).toBe("")
        })
        
        it("handles NaN", function() {
            expect(utils.format(1/'x')).toBe('NaN')
        })
        
        it("handles Infinity", function() {
            expect(utils.format(1/0)).toBe('Infinity')
        })
        
        it("handles ('x')", function() {
            expect(utils.format('x')).toBe('x')
        })
        
        it("handles ('x',1)", function() {
            expect(utils.format('x',1)).toBe('x')
        })
        
        it("handles ('%d',1)", function() {
            expect(utils.format('%d',1)).toBe('1')
        })

        it("handles ('%d','x')", function() {
            expect(utils.format('%d','x')).toBe('x')
        })

        it("handles ('%s %s %s',1,2,3)", function() {
            expect(utils.format('%s %s %s',1,2,3)).toBe('1 2 3')
        })

        it("handles ('1%c2%c3',1,2,3)", function() {
            expect(utils.format('1%c2%c3',1,2,3)).toBe('123')
        })

        it("handles ('%j',{a:1})", function() {
            expect(utils.format('%j',{a:1})).toBe('{"a":1}')
        })
        
        it("handles ('%d: %o',1, {b:2})", function() {
            expect(utils.format('%d: %j',1, {b:2})).toBe('1: {"b":2}')
        })
        
        it("handles ('%j',function(){})", function() {
            expect(utils.format('%j',function(){})).toBe('')
        })
        
        it("handles ('%s',function(){})", function() {
            expect(utils.format('%s',function(){})).toBe('function (){}')
        })
        
        it("handles ('1%%2%%3',4)", function() {
            expect(utils.format('1%%2%%3',1)).toBe('1%2%3')
        })
        
        it("handles ('1%x2%y3',4,5)", function() {
            expect(utils.format('1%x2%y3',4,5)).toBe('14253')
        })
        
        var cycler
        
        beforeEach(function(){
            cycler = {a: 1}
            cycler.cycler = cycler
        })
        
        it("handles cyclic objects as format string", function() {
            expect(utils.format(cycler)).toBe("[object Object]")
        })
        
        it("handles cyclic objects as object arg", function() {
            expect(utils.format("%o",cycler)).toMatch(/^error JSON\.stringify\(\)ing argument:/)
        })
        
        it("handles cyclic objects as string arg", function() {
            expect(utils.format("%s",cycler)).toBe("[object Object]")
        })

    })
    
});