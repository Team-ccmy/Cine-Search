const apiKey = 'ff2971a496e122549ee3b82e1c22d1e9';

document.addEventListener('DOMContentLoaded', function () {
    const searchForm = document.getElementById('searchForm');
    const searchInput = document.getElementById('search-input');

    // Load movie genres from the API and populate the genre dropdown
    function loadGenres() {
        const apiKey = 'ff2971a496e122549ee3b82e1c22d1e9';
        const apiUrl = `https://api.themoviedb.org/3/genre/movie/list?api_key=${apiKey}&language=en-US`;

        // Use the fetch function to get data from the API
        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                const genres = data.genres;
                const genreFilter = document.getElementById('genre-filter');

                genres.forEach(function (genre) {
                    let option = document.createElement('option');
                    option.value = genre.id;
                    option.textContent = genre.name;
                    genreFilter.appendChild(option);
                })

                const selectItems = document.querySelectorAll('select');
                const selectInstances = M.FormSelect.init(selectItems);
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
            .then(response => response.json())
            .then(data => {
                displayResults(data.results);
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
        const query = searchInput.value.trim();
        const apiKey = 'ff2971a496e122549ee3b82e1c22d1e9';

        // Check if a search query is provided or not
        let apiUrl;
        if (query) {
            apiUrl = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${query}`;
        } else {
            apiUrl = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}`;
        }

        // Fetch by applied filters
        const genreFilter = document.getElementById('genre-filter').value;
        const alphabeticalOrder = document.getElementById('alphabetical-filter').value;
        const ratingFilter = document.getElementById('rating-filter').value;
        const yearFilter = document.getElementById('year-filter').value;
        const languageFilter = document.getElementById('language-filter').value;

        if (genreFilter) apiUrl += `&with_genres=${genreFilter}`;
        if (alphabeticalOrder) apiUrl += `&sort_by=original_title.${alphabeticalOrder}`;
        if (ratingFilter) apiUrl += `&vote_average.gte=${ratingFilter}`;
        if (yearFilter) apiUrl += `&primary_release_year=${yearFilter}`;
        if (languageFilter) apiUrl += `&with_original_language=${languageFilter}`;

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

    function addToQueue(movieId, movieTitle) {
        const queueList = document.querySelector('.queue ul');
        const listItem = document.createElement('li');
        listItem.dataset.id = movieId;
        listItem.textContent = movieTitle;
        queueList.appendChild(listItem);

        saveToLocalStorage('queue', movieId, movieTitle);
    }

    function saveToLocalStorage(listName, movieId, movieTitle) {
        const existingList = JSON.parse(localStorage.getItem(listName)) || [];
        existingList.push({ id: movieId, title: movieTitle });
        localStorage.setItem(listName, JSON.stringify(existingList));
    }

    function loadFromLocalStorage() {
        const bucketList = document.querySelector('.bucket ul');
        const queueList = document.querySelector('.queue ul');

        // Clear the current list in the DOM
        bucketList.innerHTML = '';
        queueList.innerHTML = '';

        const bucketListData = JSON.parse(localStorage.getItem('bucket')) || [];
        bucketListData.forEach(movie => addToBucket(movie.id, movie.title));

        const queueListData = JSON.parse(localStorage.getItem('queue')) || [];
        queueListData.forEach(movie => addToQueue(movie.id, movie.title));
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