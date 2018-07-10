/**
 * ////////////////////////////////////////////
 * AlertifyJS documentation and examples     //
 * See: https://alertifyjs.com/notifier.html //
 * ////////////////////////////////////////////
 *
 * @message  {String or DOMElement} The notification message contents.
 * @type     {String}               The Type of notification message (CSS class name 'ajs-{type}' to be added).
 * @wait     {Number}               The time (in seconds) to wait before the notification is auto-dismissed (our default is 10).
 * @callback {Function}             A callback function to be invoked when the notification is dismissed.
 *
 * alertify.notify(message, type, wait, callback)
 *
 * Shorthand function calls (that we use) for the above are:
 *
 * alertify.error(message, wait, callback)
 * alertify.warning(message, wait, callback)
 * alertify.success(message, wait, callback)
 *
 * Example usages: */
 alertify.success('QR Code scanned'); // Success with default wait time and no callback
 alertify.error('Could not connect to database.', 0) // Error with no auto-dismissal (will stick around until clicked) and no callback