'use strict';

angular.module('courses').directive('upload',
    function() {
        return {
            scope: {
                file:'='
            },
            link: function(scope, element) {
                $(element).on('change', function(changeEvent) {
                    console.log('here');
                    console.log(changeEvent.target.files);
                    var files = changeEvent.target.files;
                    if (files.length) {
                        var r = new FileReader();
                        r.onload = function(e) {
                            var contents = e.target.result;
                            //scope.$apply(function () {
                            //    scope.fileReader = contents;
                            //});

                            console.log(contents);
                        };

                        r.readAsText(files[0]);
                    }
                });
            }
        };
    }
);


