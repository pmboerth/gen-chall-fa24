// import the method to determine the optimal movie ranking
import { determineOptimalRanking } from "./score.js";

// define the Generate server API URL
const apiURL = "https://movie-matcher-nqsql.ondigitalocean.app/";

// define the OMDb API URL
const omdbURL = "http://www.omdbapi.com/?i=";

// define my OMDb authorization key
const authKey = "f68850a0";

// information object to store token, movies, and people
const information = {
  token: "",
  movies: [],
  people: [],
};

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

// get unique token
async function getToken() {
  const response = await fetch(
    apiURL + "token?email=boerth.p%40northeastern.edu"
  );
  information.token = await response.text();
}

// get prompt and parse data into information object
async function getPrompt() {
  const response = await fetch(apiURL + information.token + "/prompt", {
    method: "GET",
  });
  const data = await response.json();
  information.movies = data.movies;
  information.people = data.people;
}

// get individual movie data and put into array
async function getMovieData() {
  for (let i = 0; i < information.movies.length; i++) {
    const response = await fetch(
      omdbURL + information.movies[i] + "&apikey=" + authKey,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }
    );
    const movieInfo = await response.json();
    information.movies[i] = movieInfo;
  }
}

// send optimal movie ranking back to server
async function sendMovieList() {
  const response = await fetch(apiURL + information.token + "/submit", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(determineOptimalRanking(information)),
  });
  let score = await response.text();
  console.log(score);
}

// main function
async function main() {
  // await register();

  // get the token
  await getToken();
  // get the prompt
  await getPrompt();
  // get movie data
  await getMovieData();
  // compute and send the optimal ranking to the Generate server
  sendMovieList();
}

// run the main function
main();

// export information object for use in other files
export { information };
