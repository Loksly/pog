(function(log){
	'use strict';
	var pog = require('./index.js').pog;
	var tests = [
		'http://www.phpobjectgenerator.com/?language=php5&wrapper=pog&objectName=test&attributeList=array+%28%0A++0+%3D%3E+%27varcharattr%27%2C%0A++1+%3D%3E+%27ent%27%2C%0A++2+%3D%3E+%27hijodeA%27%2C%0A++3+%3D%3E+%27padredeB%27%2C%0A++4+%3D%3E+%27attrdeOtro%27%2C%0A%29&typeList=array+%28%0A++0+%3D%3E+%27VARCHAR%28255%29%27%2C%0A++1+%3D%3E+%27INT%27%2C%0A++2+%3D%3E+%27HASMANY%27%2C%0A++3+%3D%3E+%27BELONGSTO%27%2C%0A++4+%3D%3E+%27otro%27%2C%0A%29',
		'http://www.phpobjectgenerator.com/?language=php5&wrapper=pog&objectName=test&attributeList=array+%28%0A++0+%3D%3E+%27varcharattr2C%0A++1+%3D%3E+%27ent%27%2C%0A++2+%3D%3E+%27hijodeA%27%2C%0A++3+%3D%3E+%27padredeB%27%2C%0A++4+%3D%3E+%27attrdeOtro%27%2C%0A%29&typeList=array+%28%0A++0+%3D%3E+%27VARCHAR%28255%29%27%2C%0A++1+%3D%3E+%27INT%27%2C%0A++2+%3D%3E+%27HASMANY%27%2C%0A++3+%3D%3E+%27BELONGSTO%27%2C%0A++4+%3D%3E+%27otro%27%2C%0A%29'
	];
	tests.forEach(function(test){
		var value = pog.parseRegenerateLink(test);
		log.log(value);
		log.log(pog.lastError());
	});
})(console);
