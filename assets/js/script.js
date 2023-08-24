// Wait for the document to be fully loaded
document.addEventListener('DOMContentLoaded', function () {

    // Define essential DOM elements
    const searchForm = document.querySelector('.searchForm');
    const queryInput = searchForm.querySelector('input');
    const searchResultCard = document.querySelector('.searchResultCard');

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

    // Separate function to handle fetching movies
    function fetchMovies(apiUrl) {
        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                const movies = data.results;
                searchResultCard.innerHTML = '';
                movies.forEach(movie => {
                    const { title, release_date, poster_path } = movie;

                    const result = document.createElement('div');
                    result.classList.add('result');
                    result.innerHTML = `
                    <div class="card">
                        <div class="card-image waves-effect waves-block waves-light">
                            <img class="activator" src="https://image.tmdb.org/t/p/w185/${poster_path}"><br>
                        </div>
                        <div class="card-content">
                            <span class="card-title activator grey-text text-darken-4 movieTitle">${title}</span>
                            <span class="year">Year released: ${release_date ? release_date.slice(0, 4) : ''}</span>
                            <i class="material-icons right"><a href="#">queue_play_next</a></i>
                            <i class="material-icons right"><a href="#">delete_sweep</a></i>
                        </div>
                        <div class="card-reveal">
                            <span class="card-title grey-text text-darken-4">${title}<i class="material-icons right">close</i></span>
                            <p>Here is some more information about this product that is only revealed once clicked on.</p>
                        </div>
                    </div>
                `;
                    searchResultCard.appendChild(result);
                });
            })
            .catch(error => {
                console.error('Error fetching movie data:', error);
            });
    }

    // Event listener for the form submission with both query and filters
    searchForm.addEventListener('submit', function (event) {
        event.preventDefault();
        const query = queryInput.value.trim();
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
})