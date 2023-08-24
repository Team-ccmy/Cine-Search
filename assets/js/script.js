document.addEventListener('DOMContentLoaded', function () {

    const searchForm = document.querySelector('.searchForm');
    const queryInput = form.querySelector('input');
    const searchResultCard = document.querySelector('.searchResultCard');

    function loadGenres() {
        const apiKey = 'ff2971a496e122549ee3b82e1c22d1e9';
        const apiUrl = `https://api.themoviedb.org/3/genre/movie/list?api_key=${apiKey}&language=en-US`;

        fetch(apiUrl)
        .then(response => response.json())
        .then(data =>{
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

    loadGenres();
    loadYears();
    loadCountries();
})