var Hoek = require('hoek');
var fs = require('fs');
var projects = JSON.parse( fs.readFileSync("rede-convergir-db.js", "UTF8") );


var transformMap = {
	"id": "projectid",

	"lat": "lat",
	"lng": "lng",

	"properties.projectname" : "projectname",
	"properties.projecturl" : "projecturl",
	"properties.street" : "street",
	"properties.postalcode" : "postalcode",
	"properties.city" : "city",
	"properties.startdate" : "startdate",
	"properties.registrydate" : "registrydate",
	"properties.updatedate" : "updatedate",
	"properties.projecttype" : "projecttype",
	"properties.domains" : "domains",
	"properties.companyproject" : "companyproject",
	"properties.visitors" : "visitors",
	"properties.groupsize" : "groupsize",
	"properties.scopearea" : "scopearea",
	"properties.target" : "target",
	"properties.projectinfluence" : "projectinfluence",
	"properties.areaha" : "areaha",
	"properties.projectdescription" : "projectdescription",
	"properties.contactname" : "contactname",
	"properties.email" : "email",
	"properties.phone" : "phone",
	"properties.othercontact" : "othercontact"

};

// call Hoek.transform in all objects of an array (of objects)
var transform = function(array, transformMap, options) {

    var i, li;
    for (i = 0, li = array.length; i < li; i++) {
        array[i] = Hoek.transform(array[i], transformMap, options);
    }

    return array;
};

var projectsGeojson = transform(projects, transformMap);

// make the final adjustments
projectsGeojson.forEach(function(obj){
	obj.type = "Feature";

	obj.geometry = {};
	obj.geometry.type        = "Point";
	obj.geometry.coordinates = [obj.lng, obj.lat];

	delete obj.lat;
	delete obj.lng;
});
//console.log(projectsGeojson);
console.log(projectsGeojson[0]);

// TODO: the id and coordinates are strings; they should be numbers; the dates should be converted to a better format (?or no? how does json support dates?)