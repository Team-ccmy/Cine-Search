document.addEventListener("DOMContentLoaded", function () {

    document.getElementById("toggle").addEventListener("change", function () {
        if (this.checked) {
            document.body.setAttribute("data-theme", "dark");
            localStorage.setItem("theme", "dark");
        } else {
            document.body.setAttribute("data-theme", "light");
            localStorage.setItem("theme", "light");
        }
    });

    // When the page loads, check local storage for user's theme preference
    window.addEventListener("DOMContentLoaded", function (event) {
        var savedTheme = localStorage.getItem("theme") || "light";
        document.body.setAttribute("data-theme", savedTheme);
        var toggleCheckbox = document.getElementById("toggle");
        if (savedTheme === "dark") {
            toggleCheckbox.checked = true;
        }
    });

    var searchForm = document.querySelector(".searchForm");
    var queryInput = searchForm.querySelector("input");
    var searchResultCard = document.querySelector(".searchResultCard");
    var videoContainer = document.getElementById('video-container');
    var isVideoExpanded = false;

    // Load movie genres from the API and populate the genre dropdown
    function loadGenres() {
        var apiKey = "ff2971a496e122549ee3b82e1c22d1e9";
        var apiUrl = "https://api.themoviedb.org/3/genre/movie/list?api_key=" + apiKey + "&language=en-US";
        // Use the fetch function to get data from the API
        fetch(apiUrl)
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                var genres = data.genres;
                var genreFilter = document.getElementById("genre-filter");
                genres.forEach(function (genre) {
                    var option = document.createElement("option");
                    option.value = genre.id;
                    option.textContent = genre.name;
                    genreFilter.appendChild(option);
                });
                var selectItems = document.querySelectorAll("select");
                M.FormSelect.init(selectItems);
            })
            .catch(function (error) {
                console.error("Error fetching genres:", error);
            });
    }

    // The function to load years
    function loadYears() {
        var currentYear = new Date().getFullYear();
        var earliestYear = 1950;
        var yearFilter = document.getElementById("year-filter");
        for (let i = currentYear; i >= earliestYear; i--) {
            var option = document.createElement("option");
            option.value = i;
            option.textContent = i;
            yearFilter.appendChild(option);
        }
    }

    loadGenres();
    loadYears();

    var searchHistory = JSON.parse(localStorage.getItem("searchHistory")) || [];
    if (searchHistory.length > 0) {
        var apiKey = "ff2971a496e122549ee3b82e1c22d1e9";
        var apiUrl = "https://api.themoviedb.org/3/search/movie?api_key=" + apiKey + "&query=" + searchHistory[searchHistory.length - 1];
        fetchMovies(apiUrl);
    }
    displaySearchHistory();

    document.getElementById("btn-search").addEventListener("click", function () {
        var query = document.getElementById("search-input").value.trim();
        var apiKey = "ff2971a496e122549ee3b82e1c22d1e9";
        var apiUrl = "https://api.themoviedb.org/3/search/movie?api_key=" + apiKey + "&query=" + query;
        fetchMovies(apiUrl);
    });

    // Separate function to handle fetching movies
    function fetchMovies(apiUrl) {
        fetch(apiUrl)
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                var movies = data.results;
                searchResultCard.innerHTML = "";
                saveToSearchHistory(document.getElementById("search-input").value.trim());
                movies.forEach(function (movie) {
                    var title = movie.title, description = movie.overview, poster_path = movie.poster_path;
                    var result = document.createElement("div");
                    result.classList.add("result");
                    result.innerHTML =
                        '<div class="card">' +
                        '<div class="card-image waves-effect waves-block waves-light">' +
                        '<img class="activator" src="https://image.tmdb.org/t/p/w185/' + poster_path + '" alt="' + title + ' poster">' +
                        "</div>" +
                        '<div class="card-content">' +
                        '<span class="card-title activator grey-text text-darken-4 movieTitle">' + title + "</span>" +
                        '<i class="material-icons center-align"><a href="#">delete_sweep</a></i>' +
                        '<i class="material-icons center-align"><a href="#">queue_play_next</a></i>' +
                        "</div>" +
                        '<div class="card-reveal">' +
                        '<span class="card-title grey-text text-darken-4">' + title +
                        '<i class="material-icons right">close</i></span>' +
                        "<p>" + description + "</p>" +
                        "</div>" +
                        "</div>";
                    searchResultCard.appendChild(result);
                });
            })
            .catch(function (error) {
                console.error("Error fetching movie data:", error);
            });
    }

    function saveToSearchHistory(movieTitle) {
        var searchHistory = JSON.parse(localStorage.getItem("searchHistory")) || [];
        if (searchHistory.includes(movieTitle)) return;
        searchHistory.push(movieTitle);
        localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
        displaySearchHistory();
    }

    // Display the search history from local storage as a list of clickable buttons
    function displaySearchHistory() {
        var historyList = document.getElementById("searchHistory");
        historyList.innerHTML = "";
        var searchHistory = JSON.parse(localStorage.getItem("searchHistory")) || [];
        for (var i = 0; i < searchHistory.length; i++) {
            (function (movie) {
                var searchButton = document.createElement("li");
                searchButton.textContent = movie;
                searchButton.className = "history-item";
                searchButton.addEventListener("click", function () {
                    var apiKey = "ff2971a496e122549ee3b82e1c22d1e9";
                    var apiUrl = "https://api.themoviedb.org/3/search/movie?api_key=" + apiKey + "&query=" + movie;
                    fetchMovies(apiUrl);
                });
                historyList.appendChild(searchButton);
            })(searchHistory[i]);
        }
    }

    // Event listener for the form submission with both query and filters
    searchForm.addEventListener("submit", function (event) {
        event.preventDefault();
        var query = queryInput.value.trim();
        var apiKey = "ff2971a496e122549ee3b82e1c22d1e9";

        // Check if a search query is provided or not
        var apiUrl;
        if (query) {
            apiUrl = "https://api.themoviedb.org/3/search/movie?api_key=" + apiKey + "&query=" + query;
        } else {
            apiUrl = "https://api.themoviedb.org/3/discover/movie?api_key=" + apiKey;
        }

        // Fetch by applied filters
        var genreFilter = document.getElementById("genre-filter").value;
        var ratingFilter = document.getElementById("rating-filter").value;
        var yearFilter = document.getElementById("year-filter").value;
        var languageFilter = document.getElementById("language-filter").value;

        if (genreFilter) apiUrl += "&with_genres=" + genreFilter;
        if (ratingFilter) apiUrl += "&vote_average.gte=" + ratingFilter;
        if (yearFilter) apiUrl += "&primary_release_year=" + yearFilter;
        if (languageFilter) apiUrl += "&with_original_language=" + languageFilter;

        fetchMovies(apiUrl);
    });

    // Result filter button
    document.getElementById('reset-filters').addEventListener('click', function () {
        var genreFilter = document.getElementById('genre-filter');
        genreFilter.selectedIndex = 0;
        M.FormSelect.init(genreFilter); // Reinitialize materialize select

        var ratingFilter = document.getElementById('rating-filter');
        ratingFilter.selectedIndex = 0;
        M.FormSelect.init(ratingFilter); // Reinitialize materialize select

        var yearFilter = document.getElementById('year-filter');
        yearFilter.selectedIndex = 0;
        M.FormSelect.init(yearFilter); // Reinitialize materialize select

        var languageFilter = document.getElementById('language-filter');
        languageFilter.selectedIndex = 0;
        M.FormSelect.init(languageFilter); // Reinitialize materialize select
    });


    // Function to load movies from local storage
    function loadMoviesFromLocalStorage(listSelector) {
        var storageKey = listSelector.replace(" ", "").replace(".", "");
        var savedMovies = JSON.parse(localStorage.getItem(storageKey) || "[]");
        savedMovies.forEach(function (movie) {
            addMovieToList(movie, listSelector);
        });
    }

    loadMoviesFromLocalStorage(".bucket ul");
    loadMoviesFromLocalStorage(".queue ul");

    // Function to add movie to a specific list
    function addMovieToList(movieTitle, listSelector) {
        var list = document.querySelector(listSelector);
        // Check for duplicates
        var listItemExists = Array.from(list.children).some(function (li) {
            return li.textContent === movieTitle;
        });
        if (listItemExists) {
            console.log("Movie: " + movieTitle + " already exists in the list.");
            return;
        }
        var listItem = document.createElement("li");
        listItem.textContent = movieTitle;
        list.appendChild(listItem);
        var storageKey = listSelector.replace(" ", "").replace(".", "");
        var currentList = JSON.parse(localStorage.getItem(storageKey) || "[]");
        currentList.push(movieTitle);
        localStorage.setItem(storageKey, JSON.stringify(currentList));
    }

    // Function to handle the click event on the movie icons
    function handleIconClick(event) {
        var target = event.target;
        console.log("Clicked on:", target.textContent);
        if (target.tagName !== "A") {
            target = target.parentElement;
        }
        if (!["delete_sweep", "queue_play_next"].includes(target.textContent))
            return;

        var card = target.closest(".card");
        console.log("Parent card:", card);
        if (!card) return;

        var titleElement = card.querySelector(".movieTitle");
        console.log("Title element:", titleElement);
        if (!titleElement) return;

        var movieTitle = titleElement.textContent;
        console.log("Movie title:", movieTitle);

        if (target.textContent === "delete_sweep") {
            addMovieToList(movieTitle, ".bucket ul");
        } else if (target.textContent === "queue_play_next") {
            addMovieToList(movieTitle, ".queue ul");
        }
        event.preventDefault();
    }

    document.addEventListener("click", handleIconClick);

    function clearList(listSelector, storageKey) {
        // Clear the list from the DOM
        document.querySelector(listSelector).innerHTML = "";
        // Clear the list from localStorage
        localStorage.setItem(storageKey, JSON.stringify([]));

        if (storageKey === "searchHistory") {
            localStorage.removeItem("searchHistory");
        }
    }

    // Usage:
    document.getElementById("clear-bucket").addEventListener("click", function (event) {
        clearList(".bucket ul", "bucketul");
        event.preventDefault(); // Prevent any default behavior
    });

    document.getElementById("clear-queue").addEventListener("click", function (event) {
        clearList(".queue ul", "queueul");
        event.preventDefault(); // Prevent any default behavior
    });

    document.getElementById("clear-result").addEventListener("click", function (event) {
        clearList("#searchHistory", "searchHistory"); // Nota: he cambiado el selector y la clave de almacenamiento aquí
        event.preventDefault(); // Prevent any default behavior
    });

    ///////////////////////////////////////////////////////////////////
    searchForm.addEventListener('submit', function (event) {
        event.preventDefault();

        var query = queryInput.value

        // Replace with your actual API keys
        var tmdbApiKey = 'ff2971a496e122549ee3b82e1c22d1e9';
        var youtubeApiKey = 'AIzaSyAn_d7ue2ey-H-g9wDmhVagSwxiCWuTzM0';

        // Fetch movie titles from the TMDB API
        fetch(`https://api.themoviedb.org/3/search/movie?api_key=` + tmdbApiKey + `&query=` + query)
            .then(function (response) { return response.json(); })
            .then(function (data) {
                var movieTitle = data.results[0].title;
                console.log('Movie Title: ', movieTitle);
                console.log(data);
                // Use the movie title to search for trailers on YouTube
                return fetch("https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=1&q=" + encodeURIComponent(movieTitle + ' trailer') + "&key=" + youtubeApiKey);
            })
            .then(function (response) { return response.json(); })
            .then(function (data) {
                // Assuming we're interested in the first video
                if (data.items.length > 0) {
                    var videoId = data.items[0].id.videoId;
                    console.log('YouTube Video ID: ', videoId);
                    // Clear the video container before adding the new trailer
                    videoContainer.innerHTML = '';
                    var iframe = document.createElement('iframe');
                    iframe.width = '660';
                    iframe.height = '415';
                    iframe.src = "https://www.youtube.com/embed/" + videoId;
                    iframe.title = 'YouTube video player';
                    iframe.frameborder = '0';
                    iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
                    iframe.allowFullscreen = true;

                    videoContainer.appendChild(iframe);
                    isTrailerAppended = true;
                } else {
                    console.log('No videos found for this movie.');
                }
            })
            .catch(function (error) {
                console.error('Error: ', error);
            });

    });


});


// function for list of trailers' button arrow

var arrows = document.querySelectorAll(".arrow");
var movieLists = document.querySelectorAll(".movie-list");

arrows.forEach((arrow, i) => {
  var itemNumber = movieLists[i].querySelectorAll("iframe").length;
  var clickCounter = 0;
  arrow.addEventListener("click", () => {
    var ratio = Math.floor(window.innerWidth / 270);
    clickCounter++;
    if (itemNumber - (4 + clickCounter) + (4 - ratio) >= 0) {
      movieLists[i].style.transform = `translateX(${
        movieLists[i].computedStyleMap().get("transform")[0].x.value - 300
      }px)`;
    } else {
      movieLists[i].style.transform = "translateX(0)";
      clickCounter = 0;
    }
  });

  console.log(Math.floor(window.innerWidth / 270));
});


//TOGGLE

var ball = document.querySelector(".toggle-ball");
var items = document.querySelectorAll(
  ".container,.movie-list-title,.navbar-container,.sidebar,.left-menu-icon,.toggle"
);

ball.addEventListener("click", () => {
  items.forEach((item) => {
    item.classList.toggle("active");
  });
  ball.classList.toggle("active");
});
