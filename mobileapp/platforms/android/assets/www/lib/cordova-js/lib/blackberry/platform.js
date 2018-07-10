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

module.exports = {
    id: "blackberry",
    runtime: function () {
        if (navigator.userAgent.indexOf("BB10") > -1) {
            return 'qnx';
        }
        else if (navigator.userAgent.indexOf("PlayBook") > -1) {
            return 'air';
        }
        else if (navigator.userAgent.indexOf("BlackBerry") > -1) {
            return 'java';
        }
        else {
            console.log("Unknown user agent?!?!? defaulting to java");
            return 'java';
        }
    },
    initialize: function() {
        var builder = require('cordova/builder'),
            platform = require('cordova/plugin/' + this.runtime() + '/platform');

        builder.buildIntoButDoNotClobber(platform.defaults, window);
        builder.buildIntoAndClobber(platform.clobbers, window);
        builder.buildIntoAndMerge(platform.merges, window);
        platform.initialize();
    }
};
