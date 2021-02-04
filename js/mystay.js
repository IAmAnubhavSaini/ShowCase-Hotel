const images = [
    'images/aron-yigin-Xh8nvuh-eBc-unsplash.jpg',
    'images/brandon-morales-010qQcTFj9g-unsplash.jpg',
    'images/julian-steenbergen-gRk4A_fCgJI-unsplash.jpg',
    'images/lubo-minar-HtwoCTvT8ng-unsplash.jpg',
    'images/sam-moqadam-KJ241ZAOYwU-unsplash.jpg',
    'images/max-whitehead-o2kvosAH1Bg-unsplash.jpg',
]
const descriptions = images
const details = [
    {
        city: 'alfa-1',
        name: 'robocomo',
        check_in_time: '10 - 20',
        wifi: true,
        distance_airport: '200',
        bar_time: '17-18',
        ac: '1',
        gym: true,
        pool: true
    },
    {
        city: 'romio-91',
        name: 'flatoon',
        check_in_time: '4 - 6',
        wifi: false,
        distance_airport: '1',
        bar_time: '12-23',
        ac: '2',
        gym: true,
        pool: true
    },
    {
        city: 'ten-blinko',
        name: 'cala fahr',
        check_in_time: '6 - 12',
        wifi: 1,
        distance_airport: '21',
        bar_time: '16-22',
        ac: '0',
        gym: false,
        pool: false
    },
    {
        city: 'one-blinko',
        name: 'gora nahr',
        check_in_time: '5 - 22',
        wifi: 1,
        distance_airport: '1',
        bar_time: '10-22',
        ac: true,
        gym: true,
        pool: true
    },
    {
        city: 'bumkiss',
        name: 'blingnate golder',
        check_in_time: '17 - 23',
        wifi: 0,
        distance_airport: '12',
        bar_time: '18-20',
        ac: '0',
        gym: true,
        pool: false
    },
    {
        city: 'flimkits',
        name: 'gajar pad',
        check_in_time: '17 - 23',
        wifi: 0,
        distance_airport: '42',
        bar_time: '1-20',
        ac: false,
        gym: false,
        pool: true
    },
]

const HOTELS = images.map((v, i) => ({
    image: v, description: descriptions[i], details: {...details[i]}
}))

const hotels = $(function () {
    'use strict';

    var HotelData = HOTELS,
        apihits = 0,

        addHotelNav = function (options) {
            var tempid = options.val.replace(/ /g, '_') + '_link';
            var listitem = createListItem({data: '<a href="#">' + options.val + '</a>', id: tempid});
            listitem.appendTo(options.stackedNav);
        },

        fetchApiHitCount = function () {
            $('#stat-api-hits span.badge').html(apihits++);
        },

        fetchHotelCount = function () {
            const HOTEL_COUNT = HotelData.length;
            const HOTEL_COUNT_CONTAINER = $('#stat-hotel-count');
            HOTEL_COUNT_CONTAINER.css('text-align', 'center')
            console.log(HotelData.length || HOTEL_COUNT);
            HOTEL_COUNT_CONTAINER.html("Hotel count: " + HotelData.length);
        },

        updateHotelInfo = function () {
            createHotelNavList('hotels', HotelData);
            initiateHotelPresentation();
        },

        createHotelNavList = function (containerId, HotelData) {
            const container = $('#' + containerId);
            const stackedNav = $('<ul class="nav nav-pills nav-stacked"></ul>');
            HotelData.forEach(data => addHotelNav({stackedNav, val: data.details.name}))
            container.html(stackedNav);
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
                    if (HotelData[i].details.name === hotelName)
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
            $('#HotelLocationCity').html(HotelData[index].details.city);
            $('#HotelLocationCity').parent().on('click', function () {
                document.location = googleMapSearchURI + HotelData[index].details.name + ", " + HotelData[index].details.city;
            });
            $('#HotelCheckInOutTimings').html("Check-in hours " + HotelData[index].details.check_in_time.replace('-', ' to '));
            $('#HotelWiFiServiceAvailability').html(HotelData[index].details.wifi === "yes" || HotelData[index].details.wifi === "1" ? "Wifi available" : "Wifi unavailable");
        },

        loadHotelMoreInfo = function (index) {
            $('#HotelDistanceFromAirportInfo').html(HotelData[index].details.distance_airport);
            $('#HoteBarInfo').html(HotelData[index].details.bar_time.replace('-', ' to '));
            $('#HotelAirConditionerInfo').html(HotelData[index].details.ac !== "1" ? "no" : "yes");
            $('#HotelGymInfo').html(HotelData[index].details.gym !== "1" ? "no" : "yes");
            $('#HotelPoolInfo').html(HotelData[index].details.pool !== "1" ? "no" : "yes");
        },

        loadHotelRoomInfo = function (index) {
            var container = $('#HotelRoomInfoContainer');
            var createRoomInfoItem = function () {
                return $('<div class="item"></div>');
            };
            var createRoomInfoItemName = function (name) {
                return $('<span class="room-info-name"></span>').html(name);
            };
            var createRoomInfoItemValue = function (value) {
                return $('<span class="room-info-value"></span>').html(value);
            };

            var tempRoomName = undefined, tempRoomValue = undefined, tempRoom = undefined;

            container.html('');
            $.each(HotelData[index].rooms, function () {
                tempRoomName = createRoomInfoItemName(this.type);
                tempRoomValue = createRoomInfoItemValue(this.price);
                tempRoom = createRoomInfoItem();
                tempRoom.append(tempRoomName);
                tempRoom.append(tempRoomValue);
                container.append(tempRoom);
            });
        },

        getCurrentHotelName = function () {
            return $('#hotels li.active').attr('id').replace('_link', '').replace(/_/g, ' ');
        },

        SyncHotel = function () {
            var currentHotel = getCurrentHotelName();
            localStorage.setItem('currentHotelOnDisplay', currentHotel);
        },

        initFavoriteDisplay = function () {
            $('#HotelFavorite .glyphicon').removeClass('glyphicon-heart').addClass('glyphicon-heart-empty');
        },

        applyHotelFavorite = function () {
            initFavoriteDisplay();
            var currentHotel = getCurrentHotelName();
            var fav = localStorage.getItem('Favorite-' + currentHotel);
            if (fav === "yes") {
                $('#HotelFavorite .glyphicon').addClass('glyphicon-heart').removeClass('glyphicon-heart-empty');
            } else {
                $('#HotelFavorite .glyphicon').removeClass('glyphicon-heart').addClass('glyphicon-heart-empty');
            }
        },

        applyHotelRatings = function () {
            initRatingStarsDisplay();
            var currentHotel = getCurrentHotelName();
            var rating = localStorage.getItem('Rating-' + currentHotel);
            for (var i = 0; i < rating; i++) {
                $('#HotelRatings .glyphicon:eq(' + i + ')').addClass('glyphicon-star').removeClass('glyphicon-star-empty');
            }
        },

        initiateHotelPresentation = function () {
            $('#hotels li')[0].click();
            presentHotel();
        },

        presentHotel = function () {
            SyncHotel();
            applyHotelRatings();
            applyHotelFavorite();
        },

        initRatingStarsDisplay = function () {
            $('#HotelRatings .glyphicon').addClass('glyphicon-star-empty').removeClass('glyphicon-star');
        },

        findHotel = function (input, allHotelNames) {
            var found = [];
            for (var i = 0, len = allHotelNames.length; i < len; i++) {
                if (allHotelNames[i].indexOf(input) > -1) {
                    found.push(allHotelNames[i]);
                }
            }
            return found;
        },

        showSearchResults = function (searchedNames) {
            var allHotels = $('#hotels li[role=presentation]').toArray(), searchedHotels = [];
            var hlen = allHotels.length;
            var i = 0;
            var j = -1;
            var len = searchedNames.length;

            allHotels.forEach(function (val, ind, ar) {
                for (i = 0; i < len; i++) {
                    if ($(val).children()[0].innerHTML === searchedNames[i]) {
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
        .on('mouseover', function () {
            $(this).prevAll().addClass('glyphicon-star').removeClass('glyphicon-star-empty');
            $(this).addClass('glyphicon-star').removeClass('glyphicon-star-empty');
        })
        .on('mouseleave', function () {
            applyHotelRatings();
        })
        .on('click', function () {
            if (!localStorage) {
                alert('You cannot save this rating.');
                return this;
            }
            var currentHotel = localStorage.getItem('currentHotelOnDisplay');
            var rating = $(this).prevAll().length + 1;
            localStorage.setItem('Rating-' + currentHotel, rating);
        });

    $('#SearchFormForListedHotels button').on('click', function (e) {
        e.preventDefault();
        var allHotels = $('#hotels li[role=presentation]');
        var allHotelNames = [];
        $.each(allHotels, function (k, v) {
            allHotelNames.push(v.firstChild.innerHTML);
        });
        var searchedNames = findHotel($('#searchInListedHotels').val(), allHotelNames);
        if (searchedNames.length > 0) {
            showSearchResults(searchedNames, allHotelNames);
        }
    });

    $('#HotelFavorite .glyphicon').on('click', function () {
        var fav = localStorage.getItem('Favorite-' + getCurrentHotelName());
        $(this).toggleClass('glyphicon-heart-empty')
            .toggleClass('glyphicon-heart');

        if (fav === "yes") {
            localStorage.setItem('Favorite-' + getCurrentHotelName(), 'no');
        } else {
            localStorage.setItem('Favorite-' + getCurrentHotelName(), 'yes');
        }
    });

    (function () {
        updateHotelInfo();
        fetchApiHitCount();
        fetchHotelCount();
    })();
});
