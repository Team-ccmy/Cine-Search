document.addEventListener('DOMContentLoaded', function() {

    // Function to load movies from local storage
    function loadMoviesFromLocalStorage(listSelector) {
        const storageKey = listSelector.replace(' ', '').replace('.', '');
        const savedMovies = JSON.parse(localStorage.getItem(storageKey) || '[]');
        savedMovies.forEach(movie => addMovieToList(movie, listSelector));
    }

    loadMoviesFromLocalStorage('.bucket ul');
    loadMoviesFromLocalStorage('.queue ul');

    // Function to add movie to a specific list
    function addMovieToList(movieTitle, listSelector) {
        const list = document.querySelector(listSelector);

        // Check for duplicates
        const listItemExists = Array.from(list.children).some(li => li.textContent === movieTitle);

        if (listItemExists) {
            console.log(`Movie: ${movieTitle} already exists in the list.`);
            return;
        }

        const listItem = document.createElement('li');
        listItem.textContent = movieTitle;
        list.appendChild(listItem);

        const storageKey = listSelector.replace(' ', '').replace('.', '');
        const currentList = JSON.parse(localStorage.getItem(storageKey) || '[]');
        currentList.push(movieTitle);
        localStorage.setItem(storageKey, JSON.stringify(currentList));
    }

    // Function to handle the click event on the movie icons
    function handleIconClick(event) {
        let target = event.target;

        console.log("Clicked on:", target.textContent);

        if (target.tagName !== 'A') {
            target = target.parentElement;
        }

        if (!['delete_sweep', 'queue_play_next'].includes(target.textContent)) return;

        const card = target.closest('.card');
        console.log("Parent card:", card);
        if (!card) return;

        const titleElement = card.querySelector('.movieTitle');
        console.log("Title element:", titleElement);
        if (!titleElement) return;

        const movieTitle = titleElement.textContent;
        console.log("Movie title:", movieTitle);

        if (target.textContent === 'delete_sweep') {
            addMovieToList(movieTitle, '.bucket ul');
        } else if (target.textContent === 'queue_play_next') {
            addMovieToList(movieTitle, '.queue ul');
        }

        event.preventDefault();
    }

    document.addEventListener('click', handleIconClick);

    const form = document.querySelector('.searchForm');
    const input = form.querySelector('input');
    const searchResults = document.querySelector('.search-result');
    const searchResultCard = document.querySelector('.searchResultCard');

    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        // Clear previous results
        searchResultCard.innerHTML = '';

        const query = input.value.trim();
        if (!query) {
            alert('Please enter a search term.');
            return;
        }

        const apiKey = '078e2bce56ad9ef39f7f2569faa4e329'; 
        const apiUrl = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${query}`;

        try {
            const response = await fetch(apiUrl);

            if (!response.ok) {
                alert("There was an issue with the response from the server. Please try again later.");
                return;
            }

            const data = await response.json();
            const movies = data.results;

            if (!movies.length) {
                alert("No movies found for your search. Please try another query.");
                return;
            }

            movies.forEach((movie) => {
                const {title, release_date, poster_path} = movie;
                const result = document.createElement('div');
                result.classList.add('result');
                result.innerHTML =
                `
                <div class="card">
                    <div class="card-image waves-effect waves-block waves-light">
                        <img class="activator" src="https://image.tmdb.org/t/p/w185/${poster_path}" alt="${title} poster">
                    </div>
                    <div class="card-content">
                        <span class="card-title activator grey-text text-darken-4 movieTitle">${title}</span>
                        <i class="material-icons center-align"><a href="#">delete_sweep</a></i>
                        <i class="material-icons center-align"><a href="#">queue_play_next</a></i>
                    </div>
                    <div class="card-reveal">
                        <span class="card-title grey-text text-darken-4">${title}<i class="material-icons right">close</i></span>
                        <p>Here is some more information about this movie.</p>
                    </div>
                </div>
                `;
                searchResultCard.appendChild(result);
            });

        } catch (error) {
            alert("There was an error fetching the data. Please try again later.");
            console.error('Error fetching data:', error);
        }
    });

});
