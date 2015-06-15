'use strict';

var dashDirectives = angular.module('dashDirectives', [])

        .directive('dropdown', function() {
            return {
                restrict: 'C',
                link: function(scope, elem, attrs) {
                    $(elem).dropdown({
                        on: 'hover',
                        transition: 'scale'
                    });
                }
            };
        })

//Note categoryInfo camelcase, in the HTML file it's category-info
        .directive('categoryInfo', ['$timeout', function($timeout) {
            return {
                restrict: 'C',
                link: function(scope, elem) {
                    $timeout(function() {
                        $(elem).transition('fade');
                    }, 500);
                }
            };
        }])

        .directive('modal', function() {
            return {
                restrict: 'C',
                link: function(scope, elem) {
                    $(elem).modal({
                        allowMultiple: true
                    });
                    $(elem).modal("setting", {
                        onApprove: function () {
                            /*if (typeof val !== 'undefined' && val.length > 0) {
                             return scope.extDoubt.offerAmount.match(/^\d{0,9}$/);
                             } else {
                             return false;
                             }*/ return false;
                        }
                    });
                    jQuery('.missing-question-info-modal').modal({
                        onHidden: function() {
                            jQuery('.post-question-modal').modal('show');
                        }
                    });
                }
            };
        })

        .directive('submitOfferBtn', ['SendOffer', function (SendOffer) {
            return {
                restrict: 'C',
                link: function (scope, elem) {
                    elem.bind('click', function () {
                        var val = scope.extDoubt.offerAmount;
                        var questionId = scope.extDoubt.id;
                        if (typeof val !== 'undefined' && val.length > 0 && val.match(/^\d{0,9}$/)) {
                            SendOffer.sendOffer({questionId: questionId, amount: val}, {},
                                function success(response) {
                                    jQuery('.accept-offer-modal').modal('show');
                                    scope.extDoubt.prevOffer = val;
                                },
                                function error(error) {
                                    jQuery('.reject-offer-modal').modal('show');
                                }
                            );
                        }
                    });
                }
            };
        }])

        .directive('peek', ['$timeout', 'DoubtRequest', function($timeout, DoubtRequest) {
            return {
                restrict: 'C',
                link: function(scope, elem, attrs) {
                    $(elem).click(function() {
                        scope.$parent.extDoubt = scope.doubt;
                        /* Commented out for future use, thi fetches the description of a particular
                         question from the server.
                         var desiredId = scope.doubt.id;
                         var catId = scope.doubt.categoryId;
                         var el = DoubtRequest.get({categoryId: catId, doubtId: desiredId}, function(el) {
                         scope.$parent.extDoubt.description = el.description;
                         });*/
                        scope.$parent.extDoubt.description = scope.doubt.description;
                        $timeout(function() {
                            $('.modal.full-question-modal').modal('show');
                        }, 200);
                    });
                }
            };
        }])
        
        .directive('redactor', function () {
            return {
                restrict: 'C',
                link: function (scope, elem) {
                    elem.redactor();
                    var editor = jQuery('.redactor_editor');
                    editor.attr('onkeyup', 'Preview.Update()');
                    //editor.attr('required', '');
                }
            };
        })

        .directive('postQuestionShow', ['$timeout', function ($timeout) {
            return {
                restrict: 'C',
                link: function (scope, elem) {
                    elem.bind('click', function () {
                        $timeout(function () {
                            $('.modal.post-question-modal').modal('show');
                        }, 200);
                    });
                }
            };
        }])

        .directive('sendQuestionBtn', ['SendQuestion', function (SendQuestion) {
            return {
                restrict: 'C',
                link: function (scope, elem) {
                    elem.bind('click', function () {
                        if (scope.newQuestionTitleForm.$valid && scope.newQuestionForm.$valid) {
                            var title = scope.newQuestion.title;
                            var dueDate = scope.newQuestion.dueDate;
                            var tags = scope.newQuestion.tags;
                            var description = jQuery('.redactor').val();
                            if (description === '' || description.replace(/ /g, '').length !== description.length) {
                                jQuery('.missing-question-info-modal').modal('show');
                            } else {
                                SendQuestion.sendQuestion({title: title, dueDate: dueDate, tags: tags, description: description}, {},
                                    function success(response) {
                                        jQuery('.created-question-modal').modal('show');
                                    },
                                    function error(err) {
                                        jQuery('.not-created-question-modal').modal('show');
                                    }
                                );
                            }
                        } else {
                            jQuery('.missing-question-info-modal').modal('show');
                        }
                    });
                }
            };
        }])
    ;