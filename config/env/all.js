'use strict';

module.exports = {
	app: {
		title: 'Rememberators',
		description: 'Heuristic Repetition System',
		keywords: 'Flashcards, Learning, Teaching'
	},
	port: process.env.PORT || 3000,
	templateEngine: 'swig',
	sessionSecret: 'MEAN',
	sessionCollection: 'sessions',
	assets: {
		lib: {
			css: [
				'public/lib/bootstrap/dist/css/bootstrap.css',
				'public/lib/bootstrap/dist/css/bootstrap-theme.css',
			],
			js: [
                'public/lib/jquery/dist/jquery.js',
                'public/lib/jquery-ui/jquery-ui.js',
				'public/lib/angular/angular.js',
				'public/lib/q/q.js',
				'public/lib/angular-resource/angular-resource.js', 
				'public/lib/angular-cookies/angular-cookies.js',  
				'public/lib/angular-animate/angular-animate.js', 
				'public/lib/angular-touch/angular-touch.js', 
				'public/lib/angular-sanitize/angular-sanitize.js',
				'public/lib/angular-ui-router/release/angular-ui-router.js',
				'public/lib/angular-ui-utils/ui-utils.js',
				'public/lib/angular-bootstrap/ui-bootstrap-tpls.js',
                'public/lib/angular-ui-sortable/sortable.js',
				'public/lib/d3/d3.min.js',
				'public/lib/localforage/dist/localforage.js',
				'public/lib/angular-localforage/dist/angular-localForage.js',
				'public/lib/angular-slick/dist/slick.js',
				'public/lib/slick-carousel/slick/slick.js',
				'public/lib/angular-csv/build/ng-csv.min.js'


			]
		},
		css: [
			'public/modules/**/css/*.css',
            'http://fonts.googleapis.com/css?family=PT+Sans',
			'public/lib/slick-carousel/slick/slick.css',
			'public/lib/slick-carousel/slick/slick-theme.css',

		],
		js: [
			'public/config.js',
			'public/application.js',
			'public/modules/*/*.js',
			'public/modules/*/*[!tests]*/**/*.js'
		],
		tests: [
			'public/lib/angular-mocks/angular-mocks.js',
			'public/modules/*/tests/unit/**/*.js'
		]
	}
};
