﻿(function ($, document, apiClient) {

    function getSections() {

        return [
            { name: "Favorite Movies", types: "Movie", id: "favoriteMovies", shape: 'backdrop', preferThumb: true, showTitle: false },
            { name: "Favorite Shows", types: "Series", id: "favoriteShows", shape: 'backdrop', preferThumb: true, showTitle: false },
            { name: "Favorite Games", types: "Game", id: "favoriteGames", shape: 'auto', preferThumb: false, showTitle: true }
        ];

    }

    function loadSection(elem, userId, section, isSingleSection) {

        var screenWidth = $(window).width();

        var options = {

            SortBy: isSingleSection ? "SortName" : "Random",
            SortOrder: "Ascending",
            IncludeItemTypes: section.types,
            Filters: "IsFavorite",
            Limit: screenWidth >= 1920 ? 10 : (screenWidth >= 1440 ? 8 : 6),
            Recursive: true,
            Fields: "PrimaryImageAspectRatio",
            CollapseBoxSetItems: false,
            ExcludeLocationTypes: "Virtual"
        };
        
        if (isSingleSection) {
            options.Limit = null;
        }

        ApiClient.getItems(userId, options).done(function (result) {

            var html = '';

            if (result.Items.length) {
                html += '<h1 class="listHeader">' + section.name + '</h1>';
                html += '<div>';
                html += LibraryBrowser.getPosterViewHtml({
                    items: result.Items,
                    preferThumb: section.preferThumb,
                    shape: section.shape,
                    overlayText: screenWidth >= 600,
                    context: 'home-favorites',
                    showTitle: section.showTitle,
                    lazy: true
                });

                if (result.TotalRecordCount > result.Items.length) {
                    html += '<div style="padding: 0 0 0 .5em;">';

                    var href = "favorites.html?sectionid=" + section.id;

                    html += '<a data-role="button" href="' + href + '" data-mini="true" data-inline="true">More ...</a>';
                    html += '</div>';
                }
                html += '</div>';
            }

            $(elem).html(html).trigger('create').createPosterItemMenus();
        });
    }

    function loadSections(page, userId) {

        var sections = getSections();

        var sectionid = getParameterByName('sectionid');

        if (sectionid) {
            sections = sections.filter(function (s) {

                return s.id == sectionid;
            });
        }

        var i, length;

        var elem = $('.sections', page);

        if (!elem.html().length) {
            var html = '';
            for (i = 0, length = sections.length; i < length; i++) {

                html += '<div class="homePageSection section' + sections[i].id + '"></div>';
            }

            elem.html(html);
        }

        for (i = 0, length = sections.length; i < length; i++) {

            var section = sections[i];

            elem = $('.section' + section.id, page);

            loadSection(elem, userId, section, sections.length == 1);
        }
    }

    $(document).on('pagebeforeshow', "#favoritesPage", function () {

        var page = this;

        var userId = Dashboard.getCurrentUserId();

        loadSections(page, userId);
    });

})(jQuery, document, ApiClient);