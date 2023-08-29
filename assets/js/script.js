// This event listener ensures that the script runs after the entire document is fully loaded.
document.addEventListener("DOMContentLoaded", function () {

    // Add click event listener to the button with the ID "btn-search"
    document.getElementById("btn-search").addEventListener("click", function () {
        // Get all elements with class "hidden-section"
        var sections = document.querySelectorAll(".hidden-section");
        // Loop through all elements with the "hidden-section" class and make them visible
        for (var i = 0; i < sections.length; i++) {
            sections[i].style.display = "block";
        }
    });

    // Add change event listener to the toggle switch (for theme switching) with the ID "toggle"
    document.getElementById("toggle").addEventListener("change", function () {
        // If the toggle switch is checked, switch to dark theme
        if (this.checked) {
            document.body.setAttribute("data-theme", "dark");
            // Save the user's theme preference in local storage
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

        // If the saved theme is "dark", check the toggle switch to reflect the user's preference
        if (savedTheme === "dark") {
            toggleCheckbox.checked = true;
        }
    });

    // Get the search form and its input, as well as the container for search results and video
    var searchForm = document.querySelector(".searchForm");
    var queryInput = searchForm.querySelector("input");
    var searchResultCard = document.querySelector(".searchResultCard");
    var videoContainer = document.getElementById('video-container');

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
                // Get genre data from the response
                var genres = data.genres;
                var genreFilter = document.getElementById("genre-filter");
                // Fill the dropdown with the genre data
                genres.forEach(function (genre) {
                    var option = document.createElement("option");
                    option.value = genre.id;
                    option.textContent = genre.name;
                    genreFilter.appendChild(option);
                });
                // Initialize form select (assuming Materialize framework is in use)
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
        // Create an option for each year and append to the dropdown
        for (let i = currentYear; i >= earliestYear; i--) {
            var option = document.createElement("option");
            option.value = i;
            option.textContent = i;
            yearFilter.appendChild(option);
        }
    }

    // Call the functions to load genres and years when the script runs
    loadGenres();
    loadYears();

    // Fetch and display movies from search history
    var searchHistory = JSON.parse(localStorage.getItem("searchHistory")) || [];
    if (searchHistory.length > 0) {
        var apiKey = "ff2971a496e122549ee3b82e1c22d1e9";
        var apiUrl = "https://api.themoviedb.org/3/search/movie?api_key=" + apiKey + "&query=" + searchHistory[searchHistory.length - 1];
        fetchMovies(apiUrl);
    }
    displaySearchHistory();

    // Add click event listener to the search button to fetch movies based on user's search input
    document.getElementById("btn-search").addEventListener("click", function () {
        // Get the user's search query
        var query = document.getElementById("search-input").value.trim();
        var apiKey = "ff2971a496e122549ee3b82e1c22d1e9";
        var apiUrl = "https://api.themoviedb.org/3/search/movie?api_key=" + apiKey + "&query=" + query;
        // Call the function to fetch and display movies based on the search query
        fetchMovies(apiUrl);
    });

    // Function to fetch movie data from the API based on the provided URL
    function fetchMovies(apiUrl) {
        fetch(apiUrl)
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                // Extract movie results from API response
                var movies = data.results;
                // Clear any previous search results
                searchResultCard.innerHTML = "";
                // Save current search input value to search history
                saveToSearchHistory(document.getElementById("search-input").value.trim());
                // Iterate over movies and display them
                movies.forEach(function (movie) {
                    var title = movie.title, description = movie.overview, poster_path = movie.poster_path;
                    var result = document.createElement("div");
                    result.classList.add("result");
                    // Construct movie card with image, title, and description
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
                    // Append the movie card to the results container
                    searchResultCard.appendChild(result);
                });
            })
            .catch(function (error) {
                console.error("Error fetching movie data:", error);
            });
    }

    // Save a movie title to local storage as part of search history
    function saveToSearchHistory(movieTitle) {
        // Retrieve current search history or initialize as an empty array if it doesn't exist
        var searchHistory = JSON.parse(localStorage.getItem("searchHistory")) || [];
        // Avoid adding duplicate entries to search history
        if (searchHistory.includes(movieTitle)) return;
        // Add movie title to history and save back to local storage
        searchHistory.push(movieTitle);
        localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
        // Update displayed search history
        displaySearchHistory();
    }

    // Function to render the search history from local storage as clickable list items
    function displaySearchHistory() {
        var historyList = document.getElementById("searchHistory");
        historyList.innerHTML = "";
        var searchHistory = JSON.parse(localStorage.getItem("searchHistory")) || [];
        // Iterate over each saved search query and create a clickable list item for it
        for (var i = 0; i < searchHistory.length; i++) {
            (function (movie) {
                var searchButton = document.createElement("li");
                searchButton.textContent = movie;
                searchButton.className = "history-item";
                // When clicking on a search history item, fetch movies for that query again
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
        // Base URL for movie search
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

        // Call the fetchMovies function to retrieve and display movies based on filters
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
        // Convert list selector into a storage key (e.g. ".bucket ul" -> "bucketul")
        var storageKey = listSelector.replace(" ", "").replace(".", "");
        // Get the saved movies for the specified list from local storage
        var savedMovies = JSON.parse(localStorage.getItem(storageKey) || "[]");
        savedMovies.forEach(function (movie) {
            // Add each saved movie to the list in the DOM
            addMovieToList(movie, listSelector);
        });
    }

    // Load movies into bucket and queue lists
    loadMoviesFromLocalStorage(".bucket ul");
    loadMoviesFromLocalStorage(".queue ul");

    // Function to add movie to a specific list
    function addMovieToList(movieTitle, listSelector) {
        var list = document.querySelector(listSelector);
        // Check if the movie is already in the list to avoid duplicates
        var listItemExists = Array.from(list.children).some(function (li) {
            return li.textContent === movieTitle;
        });
        if (listItemExists) {
            console.log("Movie: " + movieTitle + " already exists in the list.");
            return;
        }
        // Create a new list item for the movie
        var listItem = document.createElement("li");
        listItem.textContent = movieTitle;
        list.appendChild(listItem);
        // Save the movie to local storage
        var storageKey = listSelector.replace(" ", "").replace(".", "");
        var currentList = JSON.parse(localStorage.getItem(storageKey) || "[]");
        currentList.push(movieTitle);
        localStorage.setItem(storageKey, JSON.stringify(currentList));
    }

    // Function to handle the click event on the movie icons
    function handleIconClick(event) {
        var target = event.target;
        console.log("Clicked on:", target.textContent);
        // Ensure we're handling the correct elements
        if (target.tagName !== "A") {
            target = target.parentElement;
        }
        // Check which icon was clicked on (delete or queue)
        if (!["delete_sweep", "queue_play_next"].includes(target.textContent))
            return;

        var card = target.closest(".card");
        console.log("Parent card:", card);
        if (!card) return;

        // Get the title of the movie from the card
        var titleElement = card.querySelector(".movieTitle");
        console.log("Title element:", titleElement);
        if (!titleElement) return;

        var movieTitle = titleElement.textContent;
        console.log("Movie title:", movieTitle);

        // Perform action based on which icon was clicked
        if (target.textContent === "delete_sweep") {
            addMovieToList(movieTitle, ".bucket ul");
        } else if (target.textContent === "queue_play_next") {
            addMovieToList(movieTitle, ".queue ul");
        }
        event.preventDefault();
    }

    document.addEventListener("click", handleIconClick);

    // Listen for clicks on the document to handle movie action icons
    function clearList(listSelector, storageKey) {
        // Clear the list from the DOM
        document.querySelector(listSelector).innerHTML = "";
        // Clear the list from localStorage
        localStorage.setItem(storageKey, JSON.stringify([]));

        if (storageKey === "searchHistory") {
            localStorage.removeItem("searchHistory");
        }
    }

    // Setup event listeners to clear specific lists when buttons are clicked
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

    // Handle search form submission to fetch movie trailers from YouTube
    searchForm.addEventListener('submit', function (event) {
        event.preventDefault();

        var query = queryInput.value
        var tmdbApiKey = 'ff2971a496e122549ee3b82e1c22d1e9';
        var youtubeApiKey = 'AIzaSyD1GXB-oVdEu9D2k2ig5K7F14T0pk_OyLQ';

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


// Handle scrolling of the trailers' list when arrow buttons are clicked
var arrows = document.querySelectorAll(".arrow");
var movieLists = document.querySelectorAll(".movie-list");

// Iterate over each arrow
for (var i = 0; i < arrows.length; i++) {
    // Create a closure, keeping the value of `i`
    (function (i) {
        var itemNumber = movieLists[i].querySelectorAll("iframe").length;
        // Counter to keep track of how many times the arrow has been clicked
        var clickCounter = 0;
        arrows[i].addEventListener("click", function () {
            var ratio = Math.floor(window.innerWidth / 270);
            clickCounter++;
            // Check if there's enough room to scroll in the movie list
            if (itemNumber - (4 + clickCounter) + (4 - ratio) >= 0) {
                // Scroll the movie list to the left from its current position
                movieLists[i].style.transform = "translateX(" + (movieLists[i].computedStyleMap().get("transform")[0].x.value - 300) + "px)";
            } else {
                movieLists[i].style.transform = "translateX(0)";
                clickCounter = 0;
            }
        });
    })(i);
    console.log(Math.floor(window.innerWidth / 270));
}



// Toggle the theme when toggle switch is clicked
var ball = document.querySelector(".toggle-switch");
var items = document.querySelectorAll(
    ".container,.movie-list-title,.navbar-container,.sidebar,.left-menu-icon,.toggle"
);

ball.addEventListener("click", function () {
    // Toggle active class on each item to switch its appearance
    for (var i = 0; i < items.length; i++) {
        items[i].classList.toggle("active");
    }
    ball.classList.toggle("active");
});

