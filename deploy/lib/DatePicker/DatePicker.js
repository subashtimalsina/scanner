/*
Copyright © 2012, GlitchTech Science
All rights reserved.

Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:

    Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
    Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

/**
 * @name gts.DatePicker
 *
 * @author Matthew Schott <glitchtechscience@gmail.com>
 *
 * Calendar date picker for EnyoJS. Shows a calendar.
 * When the selected date changes, the onSelect event is called with the current values as a date object.
 * Using getValue or setValue will get or set the datetime with a Date object. Setting a new value will change the view date.
 * Using getViewDate or setViewDate will get or set the display datetime with a Date object.
 *
 * @class
 * @version 2.2 (2012/11/10)
 *
 * @requies Enyo (https://github.com/enyojs/enyo)
 * @requies Onyx (https://github.com/enyojs/onyx)
 * @requies g11n (https://github.com/enyojs/g11n)
 * @requies Layout/Fittable (https://github.com/enyojs/layout)
 */
enyo.kind({
	name: "gts.DatePicker",
	kind: "enyo.Control",

	classes: "gts-calendar",

    /** @public */
    published: {
		/** @lends gts.DatePicker# */

		/**
		 * Currently selected date
		 * @type Date object
		 * @default current date
		 */
		value: null,

		/**
		 * Current locale used for formatting (see enyo g11n)
		 * @type string
		 * @default g11n locale detection
		 */
		locale: "",

		/**
		 * Disables changing the value (NYI)
		 * @type boolean
		 * @default false
		 */
		disabled: false,

        /**
         * Disables disabled the out-of-month buttons
         * @type boolean
         * @default false
         */
        disableExtraDays: false,

		/**
		 * Currently shown month
		 * @type Date object
		 * @default current date
		 */
		viewDate: null,

        /**
         * List of specail date boxes that are colored or disabled.
         * This should be formated as an object whose keys are dates 
         * represented as an RFC2822 date. Each of these keys should point to
         * another object specifying desired class and indicating
         * if the date button should be disabled.
         * ex: 
            this.specialDates = 
                {
                    "Sat June 06, 2009": {
                        "class": "onyx-red", 
                        "disable" : false
                    },
                    "Thu Aug 18, 2011": {
                        "class": "onyx-green",
                        "disable" : true
                    }
                };
         * There is a helper function addSpecialDates() that will accept a range
         * of dates fromatted in a way that Date.parse() can interperate.
         * @type object
         * @default null
         */
        specialDates: null,

        /**
         * Class of "today's" button 
         * @type string
         * @default "onyx-affirmative"
         */
        todayClass: "onyx-affirmative",

        /**
         * Class of selected button
         * @type string
         * @default "onyx-blue"
         */
        selectClass: "onyx-blue",


        /**
         * Class of out-of-month buttons
         * @type string
         * @default "onyx-dark"
         */
        otherMonthClass: "onyx-dark",

		/**
		 * Format of day of week (see enyo g11n)
		 * @type string
		 * @default "medium"
		 */
		dowFormat: "medium",

		/**
		 * Format of month in header (see enyo g11n)
		 * @type string
		 * @default "MMMM"
		 */
		monthFormat: "MMMM",

        /**
         * Format of year in header (see enyo g11n)
         * @type string
         * @default "yyyy"
         */
        yearFormat: "yyyy"
	},

    statics: {
        //Fallback formats for non-g11n
        months: {
                "M": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
                "MM": ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"],
                "MMM": ["Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec"],
                "MMMM": ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
            },
        days: {
                "weekstart": 0,
                "medium": [ "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat" ],
                "long": [ "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday" ]
            }
    },

	events: {
		onSelect: ""
	},

	/** @private */
    dateClasses: "",

	components: [
		{
			kind: "FittableColumns",
			components: [
				{
					kind: "onyx.Button",
					content: "<<",

					ontap: "monthBack"
				}, {
					name: "monthLabel",
					tag: "strong",

					classes: "month-label",
					fit: true
				}, {
					kind: "onyx.Button",
					content: ">>",

					ontap: "monthForward"
				}
			]
		},

		//Calendar week header
		{
			classes: "date-row day-of-week",
			components: [
				{
					name: "sunday",

					content: "Sun",
					classes: "week-label"
				}, {
					name: "monday",
					content: "Mon",
					classes: "week-label"
				}, {
					name: "tuesday",
					content: "Tue",
					classes: "week-label"
				}, {
					name: "wednesday",
					content: "Wed",
					classes: "week-label"
				}, {
					name: "thursday",
					content: "Thu",
					classes: "week-label"
				}, {
					name: "friday",
					content: "Fri",
					classes: "week-label"
				}, {
					name: "saturday",
					content: "Sat",
					classes: "week-label"
				}
			]
		},

		//Calendar dates (6 rows of 7 cols)
		{
			classes: "date-row",
			components: [
				{
					name: "row0col0",
					kind: "onyx.Button",
					ontap: "dateHandler"
				}, {
					name: "row0col1",
					kind: "onyx.Button",
					ontap: "dateHandler"
				}, {
					name: "row0col2",
					kind: "onyx.Button",
					ontap: "dateHandler"
				}, {
					name: "row0col3",
					kind: "onyx.Button",
					ontap: "dateHandler"
				}, {
					name: "row0col4",
					kind: "onyx.Button",
					ontap: "dateHandler"
				}, {
					name: "row0col5",
					kind: "onyx.Button",
					ontap: "dateHandler"
				}, {
					name: "row0col6",
					kind: "onyx.Button",
					ontap: "dateHandler"
				}
			]
		}, {
			classes: "date-row",
			components: [
				{
					name: "row1col0",
					kind: "onyx.Button",
					ontap: "dateHandler"
				}, {
					name: "row1col1",
					kind: "onyx.Button",
					ontap: "dateHandler"
				}, {
					name: "row1col2",
					kind: "onyx.Button",
					ontap: "dateHandler"
				}, {
					name: "row1col3",
					kind: "onyx.Button",
					ontap: "dateHandler"
				}, {
					name: "row1col4",
					kind: "onyx.Button",
					ontap: "dateHandler"
				}, {
					name: "row1col5",
					kind: "onyx.Button",
					ontap: "dateHandler"
				}, {
					name: "row1col6",
					kind: "onyx.Button",
					ontap: "dateHandler"
				}
			]
		}, {
			classes: "date-row",
			components: [
				{
					name: "row2col0",
					kind: "onyx.Button",
					ontap: "dateHandler"
				}, {
					name: "row2col1",
					kind: "onyx.Button",
					ontap: "dateHandler"
				}, {
					name: "row2col2",
					kind: "onyx.Button",
					ontap: "dateHandler"
				}, {
					name: "row2col3",
					kind: "onyx.Button",
					ontap: "dateHandler"
				}, {
					name: "row2col4",
					kind: "onyx.Button",
					ontap: "dateHandler"
				}, {
					name: "row2col5",
					kind: "onyx.Button",
					ontap: "dateHandler"
				}, {
					name: "row2col6",
					kind: "onyx.Button",
					ontap: "dateHandler"
				}
			]
		}, {
			classes: "date-row",
			components: [
				{
					name: "row3col0",
					kind: "onyx.Button",
					ontap: "dateHandler"
				}, {
					name: "row3col1",
					kind: "onyx.Button",
					ontap: "dateHandler"
				}, {
					name: "row3col2",
					kind: "onyx.Button",
					ontap: "dateHandler"
				}, {
					name: "row3col3",
					kind: "onyx.Button",
					ontap: "dateHandler"
				}, {
					name: "row3col4",
					kind: "onyx.Button",
					ontap: "dateHandler"
				}, {
					name: "row3col5",
					kind: "onyx.Button",
					ontap: "dateHandler"
				}, {
					name: "row3col6",
					kind: "onyx.Button",
					ontap: "dateHandler"
				}
			]
		}, {
			classes: "date-row",
			components: [
				{
					name: "row4col0",
					kind: "onyx.Button",
					ontap: "dateHandler"
				}, {
					name: "row4col1",
					kind: "onyx.Button",
					ontap: "dateHandler"
				}, {
					name: "row4col2",
					kind: "onyx.Button",
					ontap: "dateHandler"
				}, {
					name: "row4col3",
					kind: "onyx.Button",
					ontap: "dateHandler"
				}, {
					name: "row4col4",
					kind: "onyx.Button",
					ontap: "dateHandler"
				}, {
					name: "row4col5",
					kind: "onyx.Button",
					ontap: "dateHandler"
				}, {
					name: "row4col6",
					kind: "onyx.Button",
					ontap: "dateHandler"
				}
			]
		}, {
			classes: "date-row",
			components: [
				{
					name: "row5col0",
					kind: "onyx.Button",
					ontap: "dateHandler"
				}, {
					name: "row5col1",
					kind: "onyx.Button",
					ontap: "dateHandler"
				}, {
					name: "row5col2",
					kind: "onyx.Button",
					ontap: "dateHandler"
				}, {
					name: "row5col3",
					kind: "onyx.Button",
					ontap: "dateHandler"
				}, {
					name: "row5col4",
					kind: "onyx.Button",
					ontap: "dateHandler"
				}, {
					name: "row5col5",
					kind: "onyx.Button",
					ontap: "dateHandler"
				}, {
					name: "row5col6",
					kind: "onyx.Button",
					ontap: "dateHandler"
				}
			]
		},

		{
			kind: "FittableColumns",
			style: "margin-top: 1em;",

			components: [
				{
					name: "client",
					fit: true
				}, {
					kind: "onyx.Button",
					content: "Today",
					ontap: "resetDate"
				}
			]
		},

        /*Signals listeners*/,
        {kind: "Signals", onresize:"handleResize"}
	],

	create: function() {

		this.inherited( arguments );

		if( enyo.g11n && this.locale == "" ) {

			this.locale = enyo.g11n.currentLocale().getLocale();
		}

		this.value = this.value || new Date();
		this.viewDate = this.viewDate || new Date();

        //add the standard button classes to this.dateClasses
        this.dateClasses = {};
        this.dateClasses[this.todayClass] = "";
        this.dateClasses[this.selectClass] = "";
        this.dateClasses[this.otherMonthClass] = "";

        this.specialDates = this.specialDates || {};

		this.localeChanged();
	},

    handleResize: function() {
        this.inherited(arguments);
        this._renderDoW();
        this._renderCalendar();
    },
    
	localeChanged: function() {
        var days;

		//Attempt to use the g11n lib (ie assume it is loaded)
		if( enyo.g11n ) {

			var formats = new enyo.g11n.Fmts( { locale: new enyo.g11n.Locale( this.locale ) } );

			days = {
					"weekstart": formats.getFirstDayOfWeek(),
					"medium": formats.dateTimeHash.medium.day,
					"long": formats.dateTimeHash.long.day
				};
		} else {
            days = gts.DatePicker.days;
        }

		this.$['sunday'].setContent( days[this.dowFormat][0] );
		this.$['monday'].setContent( days[this.dowFormat][1] );
		this.$['tuesday'].setContent( days[this.dowFormat][2] );
		this.$['wednesday'].setContent( days[this.dowFormat][3] );
		this.$['thursday'].setContent( days[this.dowFormat][4] );
		this.$['friday'].setContent( days[this.dowFormat][5] );
		this.$['saturday'].setContent( days[this.dowFormat][6] );
	},

	rendered: function() {

		this.inherited( arguments );

		this.renderDoW();
		this.valueChanged();
	},

    todayClassChanged: function(){
        this.renderCalendar()
    },

    selectClassChanged: function(){
        this.renderCalendar()
    },

    otherMonthClassChanged: function(){
        this.renderCalendar()
    },

	setValue: function( inValue ) {

		if( enyo.isString( inValue ) ) {

			inValue = new Date( inValue );
		}

		this.value = inValue;

		this.valueChanged();
	},

	valueChanged: function() {

		if( Object.prototype.toString.call( this.value ) !== "[object Date]" || isNaN( this.value.getTime() ) ) {
			//Not actually a date object

			this.value = new Date();
		}

		this.setViewDate( this.value );
	},

	setViewDate: function( inViewDate ) {

		if( enyo.isString( inViewDate ) ) {

			inViewDate = new Date( inViewDate );
		}

		this.viewDate = inViewDate;

		this.viewDateChanged();
	},

	viewDateChanged: function() {

		this.renderCalendar();
	},

    /*This function will accept an object in the following format:
        addSpecialDates(
            {
                'start': <Start Date>,
                'end': <End Date>,
                'class': <Class Name>,
                'disable': <Boolean>
            }
        )
        where <Start Date> and <End Date> are parseable by Date.parse()
        A single date can be added by omitting the 'end' value.

        Alternatively, an array of these object may also be passed to the function.
    */
    addSpecialDates: function( newDates ) {
        var startDate = new Date(), 
            endDate = new Date(),
            tempDate = new Date(),
            dString = "";

        //make sure newDates is formed as an array
        newDates = [].concat(newDates);

        for(var range_i = 0; range_i < newDates.length; range_i++){
            newDates[range_i].end = 
                newDates[range_i].end || newDates[range_i].start

            startDate.setTime(Date.parse(newDates[range_i].start));
            endDate.setTime(Date.parse(newDates[range_i].end));
            
            for(
                var date_i = startDate.getTime(); 
                date_i <= endDate.getTime(); 
                date_i += 86400000 //one day of ms
            ){
                tempDate.setTime(date_i);
                dString = tempDate.toDateString();
                this.specialDates[dString] = this.specialDates[dString] || {};
                this.specialDates[dString].disable = newDates[range_i].disable;
                
                if(newDates[range_i].class){
                    this.specialDates[dString].class = newDates[range_i].class;

                    //save this specail date's class for easy removal later
                    this.dateClasses[newDates[range_i].class] = "";
                }
            }
        }
        
        this.renderCalendar();
    },

    setSpecialDates: function( newDates ) {
        this.specialDates = newDates;
        //make sure the dates classes are properly stored 
        //so they can be removed later
        for(var date_i in this.specialDates){
            if(newDates[date_i].class){
                this.dateClasses[newDates[date_i].class] = "";
            }
        }

        this.renderCalendar();
    },

	renderDoW: function() {

		this._renderDoW();
	},

	_renderDoW: function() {

		var cellWidth = 38; //Math.round( 10 * this.getBounds()['width'] / 7 ) / 10;

		this.$['sunday'].applyStyle( "width", cellWidth + "px" );
		this.$['monday'].applyStyle( "width", cellWidth + "px" );
		this.$['tuesday'].applyStyle( "width", cellWidth + "px" );
		this.$['wednesday'].applyStyle( "width", cellWidth + "px" );
		this.$['thursday'].applyStyle( "width", cellWidth + "px" );
		this.$['friday'].applyStyle( "width", cellWidth + "px" );
		this.$['saturday'].applyStyle( "width", cellWidth + "px" );
	},

	renderCalendar: function() {

		this._renderCalendar();
	},

	_renderCalendar: function() {

		var cellWidth = 30;//Math.round( 10 * this.getBounds()['width'] / 7 ) / 10;
		var today = new Date();

		//Reset viewDate to first day of the month to prevent issues when changing months
		this.viewDate = new Date( this.viewDate.getFullYear(), this.viewDate.getMonth(), 1 );

		var dispMonth = new Date( this.viewDate.getFullYear(), this.viewDate.getMonth(), 0 );//Prev month, last day of month; Cycled object for diplay data
		var currMonth = new Date( this.viewDate.getFullYear(), this.viewDate.getMonth(), 1 );//Current month, first day of month

		dispMonth.setDate( dispMonth.getDate() - currMonth.getDay() + 1 );

		if( dispMonth.getTime() === currMonth.getTime() ) {
			//Curr starts on a Sunday; shift back

			dispMonth.setDate( dispMonth.getDate() - 7 );
		}

        var dispDateString;

        var currButton;

        var rowCount = 0;

		while( rowCount < 6  ) {
			//Always display 6 rows of date information

            currButton = this.$['row' + rowCount + 'col' + dispMonth.getDay()];
            dispDateString = dispMonth.toDateString();

            //Add proper class
            for(var class_i in this.dateClasses){
                currButton.removeClass(class_i);
            }
            
            //Figure out how to style the button
			if( dispDateString === this.value.toDateString() ) {
				//Currently selected date

				currButton.addClass(this.selectClass);
			} else if( dispDateString === today.toDateString() ) {

				currButton.addClass(this.todayClass);
			} else if( dispMonth.getMonth() !== currMonth.getMonth() ) {
				//Month before or after focused one

				currButton.addClass(this.otherMonthClass);

                //disable the out-of-month button if needed
                currButton.setDisabled(this.disableExtraDays);

			} else if( this.specialDates[dispDateString] ){
                //This is a special date. Use a specail class and/or disable

                currButton.addClass(
                    this.specialDates[dispDateString].class || ""
                );
                currButton.disabled = 
                    (this.specialDates[dispDateString].disable === true);
            }

			currButton.applyStyle( "width", cellWidth + "px" );
            
            currButton.setContent( dispMonth.getDate() );
            currButton.ts = dispMonth.getTime();//Used by ontap

			dispMonth.setDate( dispMonth.getDate() + 1 );

			if( dispMonth.getDay() === 0 && rowCount < 6 ) {

				rowCount++;
			}
		}

		if( enyo.g11n ) {
			var fmt = new enyo.g11n.DateFmt( this.monthFormat + " " + this.yearFormat );

			this.$['monthLabel'].setContent( fmt.format( currMonth ) );
		} else {
            //get a list of months using the fallback month formatting 
            var month_labels = gts.DatePicker.months[this.monthFormat];

            //format the year the same way g11n would
            var year_value = currMonth.getFullYear();
            if(this.yearFormat == "yy"){
                year_value = year_value.toString().substring(2,4);
            }

			this.$['monthLabel'].setContent( 
                month_labels[currMonth.getMonth()] + " - " + year_value
            );
		}
	},

	monthBack: function() {

		this.viewDate.setMonth( this.viewDate.getMonth() - 1 );

		this.renderCalendar();
	},

	monthForward: function() {

		this.viewDate.setMonth( this.viewDate.getMonth() + 1 );

		this.renderCalendar();
	},

	resetDate: function() {
		//Reset button pressed

		this.viewDate = new Date();
		this.value = new Date();

		this.renderCalendar();

		this.doSelect( { "date": this.value } );
	},

	dateHandler: function( inSender, inEvent ) {
		//Date button pressed

		var newDate = new Date();
		newDate.setTime( inSender.ts );

		this.value.setDate( newDate.getDate() );
		this.value.setMonth( newDate.getMonth() );
		this.value.setFullYear( newDate.getFullYear() );

		if( this.value.getMonth() != this.viewDate.getMonth() ) {

			this.viewDate = new Date( this.value.getFullYear(), this.value.getMonth(), 1 );
		}

		this.doSelect( { "date": this.value } );
		this.renderCalendar();
	}
});
