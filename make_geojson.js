var Hoek = require('hoek');
var moment = require("moment");
var fs = require('fs');

var projects = JSON.parse( fs.readFileSync("rede-convergir-db.js", "UTF8") );

var logoUrls = [];
projects.forEach(function(obj){
	if(obj.logo!=undefined){
		var str = "wget http://www.redeconvergir.net/projects/" + obj.projectid + "/" + obj.logo + "  -O " + obj.projectid.toLowerCase() + "_" + obj.logo.toLowerCase();
		logoUrls.push(str);
	}

});

console.log(logoUrls);


var transformMap = {
	"id": "projectid",

	"lat": "lat",
	"lng": "lng",

	"properties.name" : "projectname",
	"properties.type" : "projecttype",
	"properties.domains" : "domains",
	"properties.scopeArea" : "scopearea",
	"properties.url" : "projecturl",
	"properties.logoUrl" : "logo",
	"properties.city" : "city",
	"properties.postalCode" : "postalcode",
	"properties.street" : "street",
	"properties.startedAt" : "startdate",
	"properties.registeredAt" : "registrydate",
	"properties.updatedAt" : "updatedate",
	"properties.entity" : "companyproject",
	"properties.allowsVisitors" : "visitors",
	"properties.groupSize" : "groupsize",
	"properties.target" : "target",
	"properties.projectInfluence" : "projectinfluence",
	"properties.area" : "areaha",
	"properties.description" : "projectdescription",
	"properties.contact.name" : "contactname",
	"properties.contact.email" : "email",
	"properties.contact.phone" : "phone",
	"properties.contact.other" : "othercontact"

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
var dateFormats = ["D-MM-YYYY", "DD-MM-YYYY", "D-M-YYYY", "DD-M-YYYY"],
	outputFormat = "YYYY-MM-DD";

projectsGeojson.forEach(function(obj){
	obj.type = "Feature";

	//obj.id = Number(obj.id);

	obj.geometry = {};
	obj.geometry.type        = "Point";
	obj.geometry.coordinates = [Number(obj.lng), Number(obj.lat)];

	obj.properties.startedAt    = moment(obj.properties.startedAt, dateFormats).format(outputFormat);
	obj.properties.registeredAt = moment(obj.properties.registeredAt, dateFormats).format(outputFormat);
	obj.properties.updatedAt    = moment(obj.properties.updatedAt, dateFormats).format(outputFormat);

	if(obj.properties.logoUrl){
		obj.properties.logoUrlOld   = "http://www.redeconvergir.net/projects/" + obj.id + "/" + obj.properties.logoUrl;
		obj.properties.logoImage    = obj.id + "_" + obj.properties.logoUrl;
	}
	else{
		obj.properties.logoUrlOld = "";
		obj.properties.logoImage = "";
	}

	delete obj.lat;
	delete obj.lng;
});


//console.log(projectsGeojson);
//console.log(projectsGeojson);


fs.writeFileSync("rede-convergir-geojson.json", JSON.stringify(projectsGeojson), {encoding: "UTF8"})



// TODO: the id and coordinates are strings; they should be numbers; the dates should be converted to a better format (?or no? how does json support dates?)
