const apiKey = 'ff2971a496e122549ee3b82e1c22d1e9';

document.addEventListener('DOMContentLoaded', function () {

    var searchForm = document.querySelector('.searchForm');
    var queryInput = searchForm.querySelector('input');
    var searchResults = document.querySelector('.search-result');
    var searchResultCard = document.querySelector('.searchResultCard');

    // Load movie genres from the API and populate the genre dropdown
    function loadGenres() {
        var apiKey = 'ff2971a496e122549ee3b82e1c22d1e9';
        var apiUrl = "https://api.themoviedb.org/3/genre/movie/list?api_key=" + apiKey + "&language=en-US";


        // Use the fetch function to get data from the API
        fetch(apiUrl)
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                var genres = data.genres;
                console.log(genres);
                var genreFilter = document.getElementById('genre-filter');

                genres.forEach(function (genre) {
                    var option = document.createElement('option');
                    option.value = genre.id;
                    option.textContent = genre.name;
                    genreFilter.appendChild(option);
                })

                var selectItems = document.querySelectorAll('select');
                M.FormSelect.init(selectItems);
            })
            .catch(function (error) {
                console.error('Error fetching genres:', error);
            })
    }

    // The function to load years
    function loadYears() {
        const currentYear = new Date().getFullYear();
        const earliestYear = 1950;
        const yearFilter = document.getElementById('year-filter');

        for (let i = currentYear; i >= earliestYear; i--) {
            const option = document.createElement('option');
            option.value = i;
            option.textContent = i;
            yearFilter.appendChild(option);
        }
    }

    // The function to load countries

    loadGenres();
    loadYears();

    loadFromLocalStorage();

    searchForm.addEventListener('submit', (e) => {
        e.preventDefault();
        searchMovies(searchInput.value);
    });

    document.getElementById('clear-bucket').addEventListener('click', clearBucket);
    document.getElementById('clear-queue').addEventListener('click', clearQueue);


    function searchMovies(query) {
        const apiUrl = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${query}`;

        fetch(apiUrl)
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                var movies = data.results;
                console.log(movies);
                searchResultCard.innerHTML = '';

                movies.forEach(function (movie) {
                    var title = movie.title, release_date = movie.release_date, poster_path = movie.poster_path;
                    var result = document.createElement('div');
                    result.classList.add('result');
                    result.innerHTML =
                        '<div class="card">' +
                        '<div class="card-image waves-effect waves-block waves-light">' +
                        '<img class="activator" src="https://image.tmdb.org/t/p/w185/' + poster_path + '" alt="' + title + ' poster">' +
                        '</div>' +
                        '<div class="card-content">' +
                        '<span class="card-title activator grey-text text-darken-4 movieTitle">' + title + '</span>' +
                        '<i class="material-icons center-align"><a href="#">delete_sweep</a></i>' +
                        '<i class="material-icons center-align"><a href="#">queue_play_next</a></i>' +
                        '</div>' +
                        '<div class="card-reveal">' +
                        '<span class="card-title grey-text text-darken-4">' + title + '<i class="material-icons right">close</i></span>' +
                        '<p>Here is some more information about this movie.</p>' +
                        '</div>' +
                        '</div>';
                    searchResultCard.appendChild(result);
                });
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }

    function displayResults(movies) {
        const resultsContainer = document.querySelector('.search-result');
        resultsContainer.innerHTML = '';

        movies.forEach(movie => {
            if (movie.poster_path) {
                const movieCard = document.createElement('div');
                movieCard.classList.add('movie-card');

                const posterUrl = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
                movieCard.innerHTML = `
                <img src="${posterUrl}" alt="${movie.title}">
                <p>${movie.title}</p>
                <button data-id="${movie.id}" data-title="${movie.title}" class="add-to-bucket"><i class="material-icons center-align">delete_sweep</i></button>
                <button data-id="${movie.id}" data-title="${movie.title}" class="add-to-queue"><i class="material-icons center-align">queue_play_next</i></button>
            `;

                movieCard.querySelector('.add-to-bucket').addEventListener('click', function () {
                    addToBucket(this.dataset.id, this.dataset.title);
                });

                movieCard.querySelector('.add-to-queue').addEventListener('click', function () {
                    addToQueue(this.dataset.id, this.dataset.title);
                });

                resultsContainer.appendChild(movieCard);
            }
        });
    }

    // Event listener for the form submission with both query and filters
    searchForm.addEventListener('submit', function (event) {
        event.preventDefault();
        var query = queryInput.value.trim();
        var apiKey = 'ff2971a496e122549ee3b82e1c22d1e9';

        // Check if a search query is provided or not
        var apiUrl;
        if (query) {
            apiUrl = 'https://api.themoviedb.org/3/search/movie?api_key=' + apiKey + '&query=' + query;
        } else {
            apiUrl = 'https://api.themoviedb.org/3/discover/movie?api_key=' + apiKey;
        }

        // Fetch by applied filters
        var genreFilter = document.getElementById('genre-filter').value;
        var ratingFilter = document.getElementById('rating-filter').value;
        var yearFilter = document.getElementById('year-filter').value;
        var languageFilter = document.getElementById('language-filter').value;

        if (genreFilter) apiUrl += '&with_genres=' + genreFilter;
        if (ratingFilter) apiUrl += '&vote_average.gte=' + ratingFilter;
        if (yearFilter) apiUrl += '&primary_release_year=' + yearFilter;
        if (languageFilter) apiUrl += '&with_original_language=' + languageFilter;

        fetchMovies(apiUrl);
    });

    function addToBucket(movieId, movieTitle) {
        const bucketList = document.querySelector('.bucket ul');
        const listItem = document.createElement('li');
        listItem.dataset.id = movieId;
        listItem.textContent = movieTitle;
        bucketList.appendChild(listItem);

        saveToLocalStorage('bucket', movieId, movieTitle);
    }

    loadMoviesFromLocalStorage('.bucket ul');
    loadMoviesFromLocalStorage('.queue ul');

    // Function to add movie to a specific list
    function addMovieToList(movieTitle, listSelector) {
        var list = document.querySelector(listSelector);

        // Check for duplicates
        var listItemExists = Array.from(list.children).some(function (li) {
            return li.textContent === movieTitle;
        });

        if (listItemExists) {
            console.log('Movie: ' + movieTitle + ' already exists in the list.');
            return;
        }

        var listItem = document.createElement('li');
        listItem.textContent = movieTitle;
        queueList.appendChild(listItem);

        var storageKey = listSelector.replace(' ', '').replace('.', '');
        var currentList = JSON.parse(localStorage.getItem(storageKey) || '[]');
        currentList.push(movieTitle);
        localStorage.setItem(storageKey, JSON.stringify(currentList));
    }

    // Function to handle the click event on the movie icons
    function handleIconClick(event) {
        var target = event.target;

        console.log("Clicked on:", target.textContent);

        if (target.tagName !== 'A') {
            target = target.parentElement;
        }

    function loadFromLocalStorage() {
        const bucketList = document.querySelector('.bucket ul');
        const queueList = document.querySelector('.queue ul');

        var card = target.closest('.card');
        console.log("Parent card:", card);
        if (!card) return;

        var titleElement = card.querySelector('.movieTitle');
        console.log("Title element:", titleElement);
        if (!titleElement) return;

        var movieTitle = titleElement.textContent;
        console.log("Movie title:", movieTitle);

        if (target.textContent === 'delete_sweep') {
            addMovieToList(movieTitle, '.bucket ul');
        } else if (target.textContent === 'queue_play_next') {
            addMovieToList(movieTitle, '.queue ul');
        }

    function clearBucket() {
        const bucketList = document.querySelector('.bucket ul');
        bucketList.innerHTML = '';
        localStorage.removeItem('bucket');
    }

    function clearQueue() {
        const queueList = document.querySelector('.queue ul');
        queueList.innerHTML = '';
        localStorage.removeItem('queue');
    }

});