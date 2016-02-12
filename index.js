(function(global, logger, var_export, urlencode){
	'use strict';
	var PREFIX = 'http://www.phpobjectgenerator.com/?';
	var pog = function(){
		var lastErrorMessage = '';
		var lastError = function(){
			return lastErrorMessage;
		};
		var generateLink = function(opts){
			var link = '', params = [];
			for (var att in opts){
				if (att !== 'attrs' && opts[att] && opts[att] !== ''){
					params.push(att + '=' + encodeURIComponent(opts[att]));
				}
			}
			if (opts.attrs && opts.attrs.length > 0){
				var typeList = [];
				var attributeList = [];
				for (var i = 0, j = opts.attrs.length; i < j; i++){
					typeList.push(opts.attrs[i].type);
					attributeList.push(opts.attrs[i].name);
				}
				/* strange behaviour */
				params.push('attributeList=' + urlencode(var_export(attributeList, true)).replace('%0A%29', '%2C%0A%29') );
				params.push('typeList=' + urlencode(var_export(typeList, true)).replace('%0A%29', '%2C%0A%29') );
			}
			link = params.join('&');
			return PREFIX + link;
		};
		var parseRegenerateLink = function(link){
			var parsedlink = parseLink(link);
			if (!parsedlink){
				return null;
			}
			for (var attr in parsedlink){
				if (parsedlink[attr].indexOf('array') === 0){
					/* this is too naive */
					var parts = parsedlink[attr].split('\'');
					if (parts.length % 2 === 1){
						parsedlink[attr] = parts.filter(function(e, i){ return i % 2 === 1; });
					} else {
						lastErrorMessage = 'Format seems not be the right one for ' + attr;
						logger.error(lastErrorMessage);
					}
				}
			}
			return parsedlink;
		};
		var parseLink = function(link){
			var i = 0, j = 0, keyvaluepair;
			if (!link || typeof link !== 'string' || link.trim() === ''){
				lastErrorMessage = 'Empty link';
				return null;
			}
			if (link.indexOf(PREFIX) !== 0){
				lastErrorMessage = 'Link doesn\'t belong to ' + PREFIX;
				logger.error(lastErrorMessage);
				return null;
			}
			var parameters = link.replace(PREFIX, '').split('&');
			var returnValue = {};
			for (i = 0, j = parameters.length; i < j; i++){
				keyvaluepair = parameters[i].split('=');
				if (keyvaluepair.length === 2){
					returnValue[keyvaluepair[0]] = decodeURIComponent(keyvaluepair[1]);
				}
			}
			return returnValue;
		};
		return {
			generateLink: generateLink,
			parseRegenerateLink: parseRegenerateLink,
			lastError: lastError
		};
	};
	global.pog = pog();
})(this, console, var_export, urlencode);
