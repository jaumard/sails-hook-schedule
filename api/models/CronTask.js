/**
 * Created by jaumard on 14/08/2015.
 */
module.exports = {
	attributes : {
		name           : {
			type     : "string",
			required : true,
			unique   : true
		},
		type           : "string",
		cron           : {
			type     : "string",
			required : true
		},
		enabled        : {
			type       : "boolean",
			defaultsTo : true
		},
		context        : "json",
		sailsInContext : {
			type       : "boolean",
			defaultsTo : true
		},
		task           : {
			type     : "array",
			required : true
		}
	}
};