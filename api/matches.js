export default async function handler(req, res) {

  const API_KEY = "4e7d7cee6d609dd96ed219c6959394b3";

  try {

    const sportsRes = await fetch(`https://api.the-odds-api.com/v4/sports/?apiKey=${API_KEY}`);
    const sports = await sportsRes.json();

    const soccer = sports.filter(s => s.key.startsWith("soccer_"));

    let allMatches = [];

    for (const s of soccer) {
      try {
        const url = `https://api.the-odds-api.com/v4/sports/${s.key}/odds/?apiKey=${API_KEY}&regions=eu&markets=h2h,totals,btts`;
        const r = await fetch(url);
        const data = await r.json();

        data.forEach(m => {
          allMatches.push({
            league: s.title,
            home: m.home_team,
            away: m.away_team,
            time: m.commence_time
          });
        });

      } catch(e){}
    }

    res.status(200).json(allMatches);

  } catch(err) {
    res.status(500).json({ error: err.message });
  }
}