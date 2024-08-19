// define the API URL
const apiURL = "https://movie-matcher-nqsql.ondigitalocean.app/";

// define the OMDb API URL
const omdbURL = 'http://www.omdbapi.com/?i=';

// define my OMDb authorization key
const authKey = 'f68850a0';


// create function to get token
async function register() {
  const response = await fetch(apiURL + "register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: "Peter Boerth",
      email: "boerth.p@northeastern.edu",
    }),
  });

  const data = await response.json();
  console.log(data);
}

// register();

// create information object to store token, movies, and people
const information = {
  token: "",
  movies: [],
  people: [],
};

// finish geting the token and then get the prompt
async function render() {
  await getToken();
  await getPrompt();
  await getMovieData();

//   console.log(information.token);
//   console.log(information.movies);
//   console.log(information.people);
//   console.log(information.people[0].preferences);
  console.log(information.movies);
}

render();

// create function to get token
async function getToken() {
  const response = await fetch(
    apiURL + "token?email=boerth.p%40northeastern.edu"
  );

  information.token = await response.text();
}

// create function to get prompt
async function getPrompt() {
  const response = await fetch(apiURL + information.token + "/prompt", {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  const data = await response.json();
  information.movies = data.movies;
  information.people = data.people;
}

// create function to get movie data and put into array
async function getMovieData() {
    for (let i = 0; i < information.movies.length; i++) {
        const response = await fetch(omdbURL + information.movies[i] + "&apikey=" + authKey, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        });

        const movieInfo = await response.json();
        information.movies[i] = movieInfo;
    }
}

// algorithm to determine score for each movie



// create function to send movie list back to server
async function sendMovieList() {
    const list = await fetch(apiURL + information.token + "/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            // MOVIE ARRAY LIST
    }),
  });
}
