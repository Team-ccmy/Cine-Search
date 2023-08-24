const clear = document.getElementsByClassName('empty');
const form = document.querySelector('.searchForm');
const input = form.querySelector('input');
const searchResults = document.querySelector('.search-result');
const searchResultCard = document.querySelector('.searchResultCard');
        

let compare = (a, b) => {
    if (a.value > b.value) {
    return -1;
    }
    if (a.value < b.value) {
    return 1;
    }
    return 0;
};
  
function myFunction(){
searchResults.innerHTML = " ";
searchResultCard.innerHTML = " ";
input.value = "";
}; 
        
form.addEventListener('submit', async (event) => {
  event.preventDefault();
  const query = input.value;
  const apiKey = 'ff2971a496e122549ee3b82e1c22d1e9'; 
  const apiUrl = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${query}`;

  
    const response = await fetch(apiUrl);
    const data = await response.json();
    const movies = data.results;
    console.log(movies);
    searchResults.innerHTML = '' ;
    const popularityRank = [];
    movies.forEach((movie) => {
    const { title, popularity, release_date, poster_path} = movie;
    popularityRank.push({name: title, value: Math.floor((popularity))});

    const result = document.createElement('div');
    result.classList.add('result');
    result.innerHTML =
    `
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
    console.log(result)
    searchResultCard.appendChild(result);
    })

    
    }
)