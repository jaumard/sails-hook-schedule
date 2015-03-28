/**
 * Created by jaumard on 28/03/2015.
 */
module.exports = function aclHook(sails)
{
	var roles = [];
	var rules = {};

	return {
		// Run when sails loads-- be sure and call `next()`.
		initialize   : function (next)
		{
			if(typeof sails.config.acl != "undefined")
			{
				roles = sails.config.acl.roles;
				rules = sails.config.acl.rules;
			}
			console.log(roles, rules);
			return next();
		}, routes    : {
			before : {
				'*' : function (req, res, next)
				{

					return next();
				}
			}
		}, configure : function ()
		{


		}

	};
};