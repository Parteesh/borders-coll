// Global Javascript
var bordersUI = (function (jQuery) {

    function searchAutocomplete() {
        var inSearch = false;
        var searchBacklog = 0;

        function _doSearch(keystring) {
            if (inSearch) {
                searchBacklog ++;
                return;
            }
            inSearch = true;
            searchBacklog = 0;
            jQuery.getJSON('/udcourses/coursesuggest', {keys: keystring}).done(function(data) {
                inSearch = false;
                jQuery('.js-course-suggest').html('').removeClass('show');

                if (data.courses.length) {
                    var markup = '<h3>Courses</h3>';
                    var count = 0;
                    for (i in data.courses) {
                        count ++;
                        if(count == 1){
                            markup += '<div class="first-selected course-suggest-link">';
                        } else {
                            markup += '<div class="course-suggest-link">';
                        }
                        markup += '<a tabindex="-1" href="'+data.courses[i].url+'">'+data.courses[i].name+'</a>';
                        markup += '</div>';
                    }

                    jQuery('.js-course-suggest').html(markup).addClass('show');
                }

                 console.log(data);
            }).fail(function(xhr, status, error) {
                console.log(error);
            });
        }

        // Suggested search
        jQuery(document).on('keyup', '#searchterm', function(e){

            // get keycode of current keypress event
            var code = (e.keyCode || e.which);

            // do nothing if it's an arrow key or enter
            if(code == 37 || code == 38 || code == 39 || code == 40) {
                return;
            }

            var charCount = jQuery(this).val().length;
            _doSearch(jQuery(this).val());
        });

        jQuery('#searchterm').on('focusout', function(e) {
            if(jQuery('.js-course-suggest').is(":hover")) {
                return;
            }
            if(jQuery('.js-course-suggest').is(":focus")) {
                return;
            }
            jQuery('.js-course-suggest').html('').removeClass('show');
        });

        // Search Backlog
        var sbl = setInterval(function(){
            if (searchBacklog) {
                _doSearch(jQuery('#searchterm').val());
            }
        }, 500);

        jQuery("#searchterm").keydown(function(e) {
            switch (e.which) {
                case 40:
                    e.preventDefault(); // prevent moving the cursor
                    jQuery('.js-course-suggest div:not(:last-of-type).selected').removeClass('selected').next().addClass('selected');
                    jQuery('.js-course-suggest div.first-selected').addClass('selected').removeClass('first-selected');
                    break;
                case 38:
                    e.preventDefault(); // prevent moving the cursor
                    jQuery('.js-course-suggest div:not(:first-of-type).selected').removeClass('selected').prev().addClass('selected');
                    break;
                case 13:
                    if(jQuery('.js-course-suggest .selected').length){
                        e.preventDefault(); // prevent form submission if selected link with keyboard
                        jQuery('.js-course-suggest .selected a')[0].click();
                    } else {
                        jQuery("#searchterm-form-widget").submit();
                    }
                    break;
            }
        });
        //// END search autocomplete
    }

    //Smooth scroll
    function smoothScroll() {
        // Select all links with hashes
        jQuery('a[href*="#"]')
        // Remove links that don't actually link to anything
            .not('[href="#"]')
            .not('[href="#0"]')
            .click(function (event) {
                // On-page links
                if (
                    location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '')
                    &&
                    location.hostname == this.hostname
                ) {
                    // Figure out element to scroll to
                    var target = jQuery(this.hash);
                    target = target.length ? target : jQuery('[name=' + this.hash.slice(1) + ']');
                    // Does a scroll target exist?
                    if (target.length) {
                        // Only prevent default if animation is actually gonna happen
                        event.preventDefault();
                        jQuery('html, body').animate({
                            scrollTop: target.offset().top
                        }, 1000, function () {
                            // Callback after animation
                            // Must change focus!
                            var $target = jQuery(target);
                            $target.focus();
                            if ($target.is(":focus")) { // Checking if the target was focused
                                return false;
                            } else {
                                $target.attr('tabindex', '-1'); // Adding tabindex for elements not focusable
                                $target.focus(); // Set focus again
                            }
                            ;
                        });
                    }
                }
            });
    }

    //----------Show/Hide Content
    function showHide() {
        jQuery(document).on('click', '.js-showhide-trigger', function (e) {
            e.preventDefault();
            jQuery(this).toggleClass('open');
            jQuery(this).siblings('.js-showhide-content').slideToggle(300);
        })
    }

    function closeStatus() {
        jQuery(document).on('click', '.js-close-status', function (e) {
            e.preventDefault();
            jQuery('.status-message').fadeOut();
        });
    }

    function mobileNav(){
        var $menuTrigger = jQuery('.js-nav-trigger');
        var $menuContainer = jQuery('.js-nav-container');
        var $bodyTag = jQuery('body');
        var mobileOpenClass = 'mobile-nav-open';
        var activeClass = 'active';


        //toggle menu
        $menuTrigger.on('click', function(event) {
            event.preventDefault();
            $menuContainer.toggleClass(mobileOpenClass);
            jQuery(this).toggleClass(activeClass);
            $bodyTag.toggleClass(mobileOpenClass);

            if(jQuery('body').hasClass('mobile-nav-open')) {
                console.log('open');
                // trap keyboard focus in menu when open
                // jQuery('a:not(".header__main-nav a"):not(".js-nav-trigger"):not("#main-content"), .udc-bar-holder button, .udc-content button').attr('tabindex',"-1");
                $menuTrigger.attr('aria-expanded','true');

            } else {
                console.log('closed');
                // $('a:not(".header__main-nav a"):not(".js-nav-trigger"):not("#main-content"), .udc-bar-holder button, .udc-content button').removeAttr('tabindex');
                $menuTrigger.attr('aria-expanded','false');
            }

        });
    }

    //Back to Top Button
    function showScrollTopBtn() {
        jQuery('.btt').click(function (e) {
            e.preventDefault();
            jQuery('html,body').animate({scrollTop: 0}, 500, 0);
            jQuery(this).blur();
        })
        //check if scroll top - show stt button
        var lastScrollTop = 0;
        jQuery(document).scroll(function () {
            if (jQuery(this).scrollTop() > 1200 && jQuery(this).scrollTop() < jQuery('footer').offset().top - 600) {
                var st = jQuery(this).scrollTop();
                st < lastScrollTop ? jQuery('.btt').addClass('show-btt').attr('aria-hidden','false') : jQuery('.btt').removeClass('show-btt').attr('aria-hidden','true');
                lastScrollTop = st;
            } else if (jQuery(this).scrollTop() > jQuery('footer').offset().top - 600){
                jQuery('.btt').addClass('show-btt').attr('aria-hidden','false');
            } else {
                jQuery('.btt').removeClass('show-btt').attr('aria-hidden','true');
            }
        });
    }

    //Responsive tables horizontal scroll
    function respTables() {
        jQuery('.para-text table, .node-page table, .node-article__content table').wrap('<div class="table-container"></div>');
    }


    return {
        searchAutocomplete:searchAutocomplete,
        smoothScroll:smoothScroll,
        showHide:showHide,
        closeStatus:closeStatus,
        mobileNav:mobileNav,
        showScrollTopBtn:showScrollTopBtn,
        respTables: respTables
    }
}(jQuery));





jQuery(document).ready(function () {
    bordersUI.searchAutocomplete();
    bordersUI.smoothScroll();
    bordersUI.showHide();
    bordersUI.closeStatus();
    bordersUI.mobileNav();
    bordersUI.showScrollTopBtn();
    bordersUI.respTables();
});
