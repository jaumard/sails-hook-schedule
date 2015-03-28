/**
 * Schedule hook
 * https://www.npmjs.org/package/node-schedule
 */

module.exports = function (sails)
{

	/**
	 * Module dependencies.
	 */

	var schedule = require('node-schedule');

	/**
	 * Expose hook definition
	 */

	return {

		// Run when sails loads-- be sure and call `next()`.
		initialize : function (next)
		{
			if (sails.config.schedule == undefined)
			{
				sails.log.error("Schedule module need config/schedule.js file");
			}
			else
			{
				sails.after('hook:orm:loaded', function ()
				{
					Object.keys(sails.config.schedule).forEach(function (key)
					{
						var val = sails.config.schedule[key];
						schedule.scheduleJob(key, val);
					});
				});
			}
			return next();
		}
	};
};
