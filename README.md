# The Inbetweeners, by the numbers

An interactive data story about the 18 episodes of the original UK series.

Open `dist/index.html` through a static HTTP server so the browser can load `dist/transcripts.json`. For example, from this directory run `python3 -m http.server 8000 -d dist` and visit `http://localhost:8000`.

The page uses episode titles and original air dates from [TVmaze](https://www.tvmaze.com/shows/953/the-inbetweeners/episodes), episode ratings recorded from [IMDb](https://www.imdb.com/title/tt1220617/ratings/) on 28 October 2026, and aggregate word frequencies from [Springfield’s transcripts](https://www.springfieldspringfield.co.uk/episode_scripts.php?tv-show=the-inbetweeners). The transcripts contain spelling errors and do not reliably attribute speech to characters. Ratings can change; transcript counts are based on the available text, not verified broadcast captions.

`dist/transcripts.json` contains word counts and frequencies only; it does not reproduce the scripts.
