/**
 * Created by jaumard on 27/02/2015.
 * Base ACL config example
 */
module.exports.acl = {
	//Current user role access, default in session.role
	"currentRole"   : "session.role",
	"roles"         : ["user", "admin"],//Default roles in application
	"defaultPolicy" : "allow",//Default policy allow or deny, if no acl was define for a route or rule this is the default behavior
	"defaultRole"   : "user",//Default role when user is not logged at all
	"rules"         : {//Custom ACL rules if you want to check access under controller / services
		"saveFile" : {//For example you can call sails.hook.acl.isAllow("admin", "saveFile")
			"roles" : ["admin"]
		}
	},
	"routes" : //Additional route that are not under config/routes, can be used to protect assets files, but also rest url
	{
		"/js/admin.js" : {//For example you can call sails.config.acl.isAllow("admin", "saveFile")
			"roles" : ["admin"]
		}
	}
};
