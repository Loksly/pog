(function(angular, $, hljs, saveAs){
	'use strict';
	angular.module('pog', ['ngMaterial', 'ngAnimate'])
		.controller('AppCtrl', ['$window', '$mdToast', '$http', '$compile', '$scope', '$timeout', '$anchorScroll', 'SUPPORTED_TYPES', 'UNSUPPORTED_TYPES',
			function($window, $mdToast, $http, $compile, $scope, $timeout, $anchorScroll, SUPPORTED_TYPES, UNSUPPORTED_TYPES){
				var instance = $scope;
				instance.link = '';
				instance.objectName = '';
				instance.template = '';
				instance.reset = function(){
					instance.link = '';
					instance.attrs = [];
					instance.language = 'php5.1';
					instance.wrapper = 'pog';
					instance.objectName = '';
					instance.showTemplate = false;
					instance.result = '';
					instance.loadTemplate();
				};
				instance.loadTemplate = function(){
					$http.get('templates/' + instance.language + '.html')
						.success(function(v){
							instance.template = v;
							instance.regenerateLink();
							instance.generate();
						}
					);
				};
				instance.reset();
				instance.configTemplate = function(){
					instance.showTemplate = !instance.showTemplate;
				};
				instance.languages = ['php5.1'];
				instance.wrappers = ['pog'];
				instance.types = SUPPORTED_TYPES;
				instance.UNSUPPORTED_TYPES = UNSUPPORTED_TYPES;
				instance.regenerateLink = function(){
					var attrs = $window.pog.parseRegenerateLink(instance.link);
					if (!attrs){
						$mdToast.show($mdToast.simple().textContent($window.pog.lastError()));
					} else {
						instance.objectName = attrs.objectName;
						instance.wrapper = attrs.wrapper;
						instance.language = attrs.language;
						instance.attrs = [];
						if (attrs.attributeList && typeof attrs.attributeList === 'object' && attrs.attributeList.length > 0){
							for (var i = 0, j = attrs.attributeList.length; i < j; i++){
								var type = attrs.typeList[i] ? attrs.typeList[i] : '';
								instance.attrs.push({name: attrs.attributeList[i], type: type});
							}
						}
						instance.debug = attrs;
						$timeout(function() {
							$anchorScroll('result');
						}, 20);
					}
				};
				instance.moreAttr = function(){
					instance.attrs.push({name: '', type: instance.types[0]});
				};
				instance.removeAttr = function(index){
					if (instance.attrs.length > index){
						instance.attrs.splice(index, 1);
					}
				};
				instance.generateLink = function(){
					instance.link = $window.pog.generateLink(
						{
							wrapper: instance.wrapper,
							language: instance.language,
							objectName: instance.objectName,
							attrs: instance.attrs
						}
					);
					if (instance.objectName){
						instance.yumlink = 'http://yuml.me/diagram/scruffy/class/[' + instance.objectName + '|' +
							instance.attrs
							.filter(function(e){
								return e.name && e.name.trim() !== '';
							})
							.map(function(e){
								return '+' + e.name;
							})
							.join(';') + ']';
					} else {
						instance.yumlink = false;
					}

				};
				instance.generate = function(){
					instance.attrs = instance.attrs.filter(function(e){ return e.name.trim() !== ''; });
					$anchorScroll('result');
				};
				$mdToast.show($mdToast.simple().textContent('Welcome to the new version!'));
				instance.highlight = function(){
					$('pre code').each(function(i, block) {
						hljs.highlightBlock(block);
					});
				};
				instance.refresh = function(){
					instance.generateLink();
					$timeout(function() {
						angular.element('#cloned').html(angular.element('#original').html());
						instance.highlight();
					}, 100);
				};
				instance.$watchCollection('attrs', instance.refresh, true);
				instance.$watch('objectName', instance.refresh, true);
				instance.download = function(){
					var blob = new Blob([angular.element('#cloned').text()], {type: 'text/plain;charset=utf-8'});
					saveAs(blob, instance.objectName.toLowerCase() + '.class.php');
				};
				instance.ready = function(){
					return instance.attrs &&
						instance.attrs.length > 0 &&
						instance.attrs.filter(function(e){ return e.name && e.name.trim() !== ''; }).length > 0 &&
						instance.objectName.trim() !== '';
				};
				instance.yumlink = false;
			}
		])
		.config(['$mdThemingProvider', function($mdThemingProvider) {
			$mdThemingProvider.theme('default').primaryPalette('blue');
		}])
		.directive('codegen', ['$compile', function($compile){
			return function(scope, element, attrs) {
				scope.$watch(
					function(scope) {
						return scope.$eval(attrs.codegen);
					},
					function(value) {
						var template = angular.element('<pre>' + value + '</pre>');
						element.html(template);
						$compile(template)(scope);
					}
				);
			};
		}])
		.filter('mapping', function(){
			var mappings = {
				'VARCHAR(255)': 'array("TEXT", "VARCHAR", "255")',
				'TINYINT': 'array("NUMERIC", "TINYINT")',
				'TEXT': 'array("TEXT", "TEXT")',
				'DATE': 'array("NUMERIC", "DATE")',
				'SMALLINT': 'array("NUMERIC", "SMALLINT")',
				'MEDIUMINT': 'array("NUMERIC", "MEDIUMINT")',
				'INT': 'array("NUMERIC", "INT")',
				'BIGINT': 'array("NUMERIC", "BIGINT")',
				'FLOAT': 'array("NUMERIC", "FLOAT")',
				'DOUBLE': 'array("NUMERIC", "DOUBLE")',
				'DECIMAL': 'array("NUMERIC", "DECIMAL")',
				'DATETIME': 'array("TEXT", "DATETIME")',
				'TIMESTAMP': 'array("NUMERIC", "TIMESTAMP")',
				'TIME': 'array("NUMERIC", "TIME")',
				'YEAR': 'array("NUMERIC", "YEAR")',
				'CHAR(255)': 'array("TEXT", "CHAR", "255")',
				'TINYBLOB': 'array("TEXT", "TINYBLOB")',
				'TINYTEXT': 'array("TEXT", "TINYTEXT")',
				'BLOB': 'array("TEXT", "BLOB")',
				'MEDIUMBLOB': 'array("TEXT", "MEDIUMBLOB")',
				'MEDIUMTEXT': 'array("TEXT", "MEDIUMTEXT")',
				'LONGBLOB': 'array("TEXT", "LONGBLOB")',
				'LONGTEXT': 'array("TEXT", "LONGTEXT")',
				'BINARY': 'array("TEXT", "BINARY")'
			};
			return function(type){
				return typeof mappings[type] === 'undefined' ? '' : mappings[type];
			};
		})
		.constant('SUPPORTED_TYPES', ['VARCHAR(255)', 'TINYINT', 'TEXT', 'DATE', 'SMALLINT', 'MEDIUMINT', 'INT', 'BIGINT', 'FLOAT', 'DOUBLE', 'DECIMAL', 'DATETIME',
			'TIMESTAMP', 'TIME', 'YEAR', 'CHAR(255)', 'TINYBLOB', 'TINYTEXT', 'BLOB', 'MEDIUMBLOB', 'MEDIUMTEXT', 'LONGBLOB', 'LONGTEXT', 'BINARY'])
		.constant('UNSUPPORTED_TYPES', [ 'OTHER', 'HASMANY', 'BELONGSTO', 'JOIN']);
})(angular, $, hljs, saveAs);
