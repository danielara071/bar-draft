import express from 'express';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.get("/api/barcelona-live", async (req, res) => {
  try {
    const demo = req.query.demo === "true";

    // 👉 MODO DEMO
    if (demo) {
      return res.json({
        type: "live",
        match: {
          teams: {
            home: { name: "Barcelona" },
            away: { name: "Real Madrid" },
          },
          goals: {
            home: 2,
            away: 1,
          },
          fixture: {
            status: { elapsed: 67 },
          },
        },
      });
    }

    // 👉 MODO REAL
    const liveRes = await fetch(
      "https://v3.football.api-sports.io/fixtures?team=529&live=all",
      {
        headers: {
          "x-apisports-key": process.env.API_FOOTBALL_KEY as string,
        },
      }
    );

    const liveData = await liveRes.json();

    if (liveData.response.length > 0) {
      return res.json({
        type: "live",
        match: liveData.response[0],
      });
    }

    return res.json({ type: "none", match: null });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

app.get("/api/barcelona-live-match", async (req, res) => {
  try {
    const response = await fetch(
      "https://v3.football.api-sports.io/fixtures?team=529&last=1",
      {
        headers: {
          "x-apisports-key": process.env.API_FOOTBALL_KEY as string,
        },
      }
    );

    const data = await response.json();

    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al traer datos del partido" });
  }
});