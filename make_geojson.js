var Hoek = require('hoek');
var moment = require("moment");
var fs = require('fs');
var projects = JSON.parse( fs.readFileSync("rede-convergir-db.js", "UTF8") );


var transformMap = {
	"id": "projectid",

	"lat": "lat",
	"lng": "lng",

	"properties.name" : "projectname",
	"properties.url" : "projecturl",
	"properties.street" : "street",
	"properties.postalCode" : "postalcode",
	"properties.city" : "city",
	"properties.startedAt" : "startdate",
	"properties.registeredAt" : "registrydate",
	"properties.updatedAt" : "updatedate",
	"properties.type" : "projecttype",
	"properties.domains" : "domains",
	"properties.companyProject" : "companyproject",
	"properties.allowsVisitors" : "visitors",
	"properties.groupSize" : "groupsize",
	"properties.scopeArea" : "scopearea",
	"properties.target" : "target",
	"properties.projectInfluence" : "projectinfluence",
	"properties.areaHA" : "areaha",
	"properties.description" : "projectdescription",
	"properties.contactPerson" : "contactname",
	"properties.email" : "email",
	"properties.phone" : "phone",
	"properties.otherContact" : "othercontact"

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
var dateFormats = ["D-MM-YYYY", "DD-MM-YYYY", "D-M-YYYY", "DD-M-YYYY"];
projectsGeojson.forEach(function(obj){
	obj.type = "Feature";

	obj.id = Number(obj.id);

	obj.geometry = {};
	obj.geometry.type        = "Point";
	obj.geometry.coordinates = [Number(obj.lng), Number(obj.lat)];

	obj.properties.startedAt    = moment(obj.properties.startedAt, dateFormats).format("YYYY-MM-DD");
	obj.properties.registeredAt = moment(obj.properties.registeredAt, dateFormats).format("YYYY-MM-DD");
	obj.properties.updatedAt    = moment(obj.properties.updatedAt, dateFormats).format("YYYY-MM-DD");

	delete obj.lat;
	delete obj.lng;
});
//console.log(projectsGeojson);
console.log(projectsGeojson[1]);

// TODO: the id and coordinates are strings; they should be numbers; the dates should be converted to a better format (?or no? how does json support dates?)