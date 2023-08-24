document.addEventListener('DOMContentLoaded', function () {

    const searchForm = document.querySelector('.searchForm');
    const queryInput = form.querySelector('input');
    const searchResultCard = document.querySelector('.searchResultCard');

    function loadGenres() {
        const apiKey = 'ff2971a496e122549ee3b82e1c22d1e9';
        const apiUrl = `https://api.themoviedb.org/3/genre/movie/list?api_key=${apiKey}&language=en-US`;

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

    function loadYears() {
        const currentYear = new Date.getFullYear();
        const earliestYear = 1950;
        const yearFilter = document.getElementById('year-filter');

        for (let i = currentYear; i >= earliestYear; i--) {
            const option = document.createElement('option');
            option.value = i;
            option.textContent = i;
            yearFilter.appendChild(option);
        }
    }

    function loadCountries() {
        const apiKey = 'ff2971a496e122549ee3b82e1c22d1e9';
        const apiUrl = `https://api.themoviedb.org/3/configuration/countries?api_key=${apiKey}`;

        fetch(apiUrl)
            .then(response => response.json())
            .then(countries => {
                const countryFilter = document.getElementById('country-filter');
                countries.forEach(country => {
                    const option = document.createElement('option');
                    option.value = country.iso_3166_1;
                    option.textContent = country.english_name;
                    countryFilter.appendChild(option);
                });

                const selectItems = document.querySelectorAll('select');
                const selectInstances = M.FormSelect.init(selectItems);
            })
            .catch(error => {
                console.error('Error fetching countries:', error);
            });
    }
    
    loadGenres();
    loadYears();
    loadCountries();
})