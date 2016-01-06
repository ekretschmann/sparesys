'use strict';

angular.module('courses').directive('upload',
    function() {
        return {
            scope: {
                file:'='
            },
            link: function(scope, element) {

                /* jshint ignore:start */
                $(element).on('change', function(changeEvent) {

                    console.log(changeEvent);
                    var files = changeEvent.target.files;
                    console.log(files.length);
                    if (files.length) {
                        var r = new FileReader();
                        r.onload = function(e) {

                            var contents = e.target.result;

                            //console.log(contents);
                            var lines = contents.split('\r');
                            console.log(lines.length);
                            //
                            for (var i=1; i<lines.length; i++) {

                                console.log(lines[i]);
                            }

                        };

                        r.readAsText(files[0]);
                    }
                });
                /* jshint ignore:end */
            }
        };
    }
);


