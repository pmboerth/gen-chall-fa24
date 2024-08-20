// define the API URL
const apiURL = "https://movie-matcher-nqsql.ondigitalocean.app/";

// define the OMDb API URL
const omdbURL = 'http://www.omdbapi.com/?i=';

// define my OMDb authorization key
const authKey = 'f68850a0';


// register with Generate server
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

// information object to store token, movies, and people
const information = {
  token: "",
  movies: [],
  people: [],
};

// get token
async function getToken() {
  const response = await fetch(
    apiURL + "token?email=boerth.p%40northeastern.edu"
  );

  information.token = await response.text();
}

// get prompt
async function getPrompt() {
  const response = await fetch(apiURL + information.token + "/prompt", {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  const data = await response.json();
  information.movies = data.movies;
  information.people = data.people;
}

// get movie data and put into array
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

// create function to send movie list back to server
async function sendMovieList() {
    const response = await fetch(apiURL + information.token + "/submit", {
        method: "POST",
        body: ranking
  });
  
  console.log(response);
}

// main function that gets token, prompt, movie data, determines the optimal ranking, and sends to server
async function main() {
  
  await getToken();
  
  await getPrompt();
  
  await getMovieData();

  // function to determine optimal movie ranking
  
  await sendMovieList();
}

main();