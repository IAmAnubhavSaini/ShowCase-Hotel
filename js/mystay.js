$(function () {
    'use strict';

    var ApiHitURI = "http://glydel.0x10.info/api/hotel?type=json&query=api_hits",
        HotelDataURI = "http://glydel.0x10.info/api/hotel?type=json&query=list_hotels",
        googleMapSearchURI = "https://www.google.com/maps/search/",
        HotelData = null,

        fetchApiHitCount = function () {
            var apiHitCountPromise = $.getJSON(ApiHitURI)
                                        .done(function (json) {
                                            $('#stat-api-hits span.badge').html(json.api_hits);
                                        })
                                        .fail(function (jqxhr, textStatus, error) {
                                            $('#stat-api-hits span.badge').html("0");
                                            console.error("ERROR: " + textStatus + ", " + error);
                                            console.error("While Fetching API Hit count from: " + ApiHitURI);
                                        })
                                        .always(function () {
                                            console.log("Fetching API hit count finished.");
                                        });
        },

        fetchHotelCount = function () {
            var hotelCountPromise = $.getJSON(HotelDataURI)
                                        .done(function (json) {
                                            console.log(json.length);
                                            $('#stat-hotel-count')
                                                .css('text-align', 'center')
                                                .html("Hotel count: " + json.length);

                                        })
                                        .fail(function (jqxhr, textStatus, error) {
                                            console.error("ERROR: " + textStatus + ", " + error);
                                            console.error("While Fetching Hotel count from: " + HotelDataURI);
                                        })
                                        .always(function () {
                                            console.log("Fetching hotel count finished.");
                                        });
        },

        updateHotelInfo = function () {
            var hotelDataPromise = $.getJSON(HotelDataURI)
                                        .done(function (json) {
                                            if (json !== null && json !== undefined) {
                                                HotelData = json;
                                                createHotelNavList('hotels', HotelData);
                                                initiateHotelPresentation();
                                            }
                                        })
                                        .fail(function (jqxhr, textStatus, error) {
                                            console.error("ERROR: " + textStatus + ", " + error);
                                            console.error("While Fetching Hotel data from: " + HotelDataURI);
                                        })
                                        .always(function () {
                                            console.log("Fetching hotel data finished.");
                                        });
        },

        addHotelNav = function(options){
            var tempid = options.val.replace(/ /g, '_') + '_link';
            var listitem = createListItem({ data: '<a href="#">' + options.val + '</a>', id: tempid });
            listitem.appendTo(options.stackedNav);
        },
        
        createHotelNavList = function (containerId, HotelData) {
            var container = $('#' + containerId);
            var stackedNav = $('<ul class="nav nav-pills nav-stacked"></ul>');
            if (HotelData !== null) {
                $.each(HotelData, function () {
                    $.each(this, function (key, val) {
                        if (key === "name") {
                            addHotelNav({stackedNav: stackedNav, val: val});
                        }
                    });
                });
                container.html(stackedNav);
            }
        },

        createListItem = function (options) {
            var target = options.id.replace("_link", "").replace(/_/g, ' ');

            var listItem = $('<li role="presentation"></li>')
                            .attr('id', options.id)
                            .on('click', function () {
                                $(this).siblings().removeClass('active');
                                $(this).addClass('active');
                                loadHotel(target);
                                presentHotel();
                            })
                            .html(options.data);
            return listItem;
        },

        loadHotel = function (hotelName) {
            var i = 0, len = 0;
            if (HotelData !== null && HotelData !== undefined) {
                len = HotelData.length;
                for (i = 0; i < len; i++) {
                    if (HotelData[i].name === hotelName)
                        break;
                }
                loadHotelDescription(i);
                loadHotelImage(i);
                loadHotelBasicInfo(i);
                loadHotelMoreInfo(i);
                loadHotelRoomInfo(i);
                $('#HotelName').html(HotelData[i].name);
                
                
            }
        },

        loadHotelDescription = function (index) {
            $('#HotelDescription').html(HotelData[index].description);
        },
        
        loadHotelImage = function (index) {
            $('#HotelImage').attr('src', HotelData[index].image);
        },
        
        loadHotelBasicInfo = function (index) {
            $('#HotelLocationCity').html(HotelData[index].city);
            $('#HotelLocationCity').parent().on('click', function(){
                document.location = googleMapSearchURI + HotelData[index].name + ", "+HotelData[index].city;
            });
            $('#HotelCheckInOutTimings').html("Check-in hours " + HotelData[index].check_in_time.replace('-', ' to '));
            $('#HotelWiFiServiceAvailability').html(HotelData[index].wifi === "yes" || HotelData[index].wifi === "1" ? "Wifi available" : "Wifi unavailable");
        },
        
        loadHotelMoreInfo = function (index) {
            $('#HotelDistanceFromAirportInfo').html(HotelData[index].distance_airport);
                $('#HoteBarInfo').html(HotelData[index].bar_time.replace('-', ' to '));
                $('#HotelAirConditionerInfo').html(HotelData[index].ac !== "1" ? "no" : "yes");
                $('#HotelGymInfo').html(HotelData[index].gym !== "1" ? "no" : "yes");
                $('#HotelPoolInfo').html(HotelData[index].pool !== "1" ? "no" : "yes");
        },
        
        loadHotelRoomInfo = function (index) {
            var container = $('#HotelRoomInfoContainer');
            var createRoomInfoItem = function() { return $('<div class="item"></div>'); };
            var createRoomInfoItemName = function(name){ return $('<span class="room-info-name"></span>').html(name); };
            var createRoomInfoItemValue = function(value){ return $('<span class="room-info-value"></span>').html(value); };
            
            var tempRoomName = undefined, tempRoomValue= undefined, tempRoom = undefined;
            
            container.html('');
            $.each(HotelData[index].rooms, function(){
                tempRoomName = createRoomInfoItemName(this.type);
                tempRoomValue = createRoomInfoItemValue(this.price);
                tempRoom = createRoomInfoItem();
                tempRoom.append(tempRoomName);
                tempRoom.append(tempRoomValue);
                container.append(tempRoom);
            });
        },
        
        getCurrentHotelName = function(){
            return $('#hotels li.active').attr('id').replace('_link', '').replace(/_/g, ' ');
        },
        
        SyncHotel = function(){
            var currentHotel = getCurrentHotelName();
            localStorage.setItem('currentHotelOnDisplay', currentHotel);
        },
        
        initFavoriteDisplay = function(){
            $('#HotelFavorite .glyphicon').removeClass('glyphicon-heart').addClass('glyphicon-heart-empty');
        },
        
        applyHotelFavorite = function(){
            initFavoriteDisplay();
            var currentHotel = getCurrentHotelName();
            var fav = localStorage.getItem('Favorite-'+currentHotel);
            if(fav === "yes"){
                $('#HotelFavorite .glyphicon').addClass('glyphicon-heart').removeClass('glyphicon-heart-empty');
            } else {
                $('#HotelFavorite .glyphicon').removeClass('glyphicon-heart').addClass('glyphicon-heart-empty');
            }
        },
        
        applyHotelRatings = function(){
            initRatingStarsDisplay();
            var currentHotel = getCurrentHotelName();
            var rating = localStorage.getItem('Rating-'+currentHotel);
            for(var i = 0; i < rating; i++){
                $('#HotelRatings .glyphicon:eq('+i+')').addClass('glyphicon-star').removeClass('glyphicon-star-empty');
            }
        },
        
        initiateHotelPresentation = function(){
            $('#hotels li')[0].click();
            presentHotel();
        },
        
        presentHotel = function(){            
            SyncHotel();
            applyHotelRatings();
            applyHotelFavorite();
        },
        
        initRatingStarsDisplay = function(){
            $('#HotelRatings .glyphicon').addClass('glyphicon-star-empty').removeClass('glyphicon-star');
        },
        
        findHotel = function (input, allHotelNames){
            var found = [];
            for(var i = 0, len = allHotelNames.length; i<len; i++){
                if(allHotelNames[i].indexOf(input) > -1){
                    found.push(allHotelNames[i]);
                }
            }
            return found;
        },
        
        showSearchResults = function (searchedNames) {
            var allHotels = $('#hotels li[role=presentation]').toArray(), searchedHotels = [];
            var  hlen = allHotels.length;
            var i = 0;
            var j = -1;
            var len = searchedNames.length;
            
            allHotels.forEach(function(val, ind, ar) {
                for(i = 0; i < len; i++){
                    if($(val).children()[0].innerHTML === searchedNames[i]){
                        j = allHotels.indexOf(val);
                        searchedHotels.push(allHotels.splice(j, 1));
                    }
                }
            });
            
            $('#hotels').html('');
            var container = $('#hotels');
            var stackedNav = $('<ul class="nav nav-pills nav-stacked"></ul>');
            
            $.each(searchedHotels, function (key, val) {
                var target = $(val).attr('id').replace("_link", "").replace(/_/g, ' ');
                stackedNav.append($(val).on('click', function () {
                                            $(this).siblings().removeClass('active');
                                            $(this).addClass('active');
                                            loadHotel(target);
                                            presentHotel();
                                        })
                                 );
            });
            container.html(stackedNav);
        };

    $('#stat-fetcher').on('click', function () {
        fetchApiHitCount();
        fetchHotelCount();
    });

    $('#PrintHotel').on('click', function () {
        print();
    });
    
    
    $('#HotelRatings .glyphicon')
    .on('mouseover', function(){
        $(this).prevAll().addClass('glyphicon-star').removeClass('glyphicon-star-empty');
        $(this).addClass('glyphicon-star').removeClass('glyphicon-star-empty');
    })
    .on('mouseleave', function(){
        applyHotelRatings();
    })
    .on('click', function(){
        if(!localStorage){
            alert('You cannot save this rating.');
            return this;
        }
        var currentHotel = localStorage.getItem('currentHotelOnDisplay');
        var rating = $(this).prevAll().length + 1;
        localStorage.setItem('Rating-'+currentHotel, rating);
    });
    
    $('#SearchFormForListedHotels button').on('click', function(e){
        e.preventDefault();
        var allHotels = $('#hotels li[role=presentation]');
        var allHotelNames = [];
        $.each(allHotels, function(k, v){
            allHotelNames.push(v.firstChild.innerHTML);
        });
        var searchedNames = findHotel($('#searchInListedHotels').val(), allHotelNames);
        if(searchedNames.length > 0){
            showSearchResults(searchedNames, allHotelNames);
        }
    });
    
    $('#HotelFavorite .glyphicon').on('click', function(){
        var fav = localStorage.getItem('Favorite-'+getCurrentHotelName());
        $(this).toggleClass('glyphicon-heart-empty')
                .toggleClass('glyphicon-heart');
        
        if(fav === "yes"){
            localStorage.setItem('Favorite-'+getCurrentHotelName(), 'no');
        } else {
            localStorage.setItem('Favorite-'+getCurrentHotelName(), 'yes');
        }
    });
    
    (function () {
         updateHotelInfo();
         fetchApiHitCount();
         fetchHotelCount();
    })();
});
