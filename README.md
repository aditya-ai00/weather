# 🌐 Nexus Spring of Code 2026

This project is part of **Nexus Spring of Code (NSoC) 2026**.

🧑‍💻 Contributors can work on open issues and submit pull requests following the contribution guidelines.  
🏷️ Make sure your PR includes the tag **NSoC'26** for leaderboard tracking.

---

# 🌦️ SkyCast — Beyond Just Weather

> 🚀 **Intelligent Fallback Engine** - Seamlessly switching between OpenWeatherMap and WeatherAPI.com for 100% uptime.

---

## ✨ Features

🔍 **Global City Search**  
- Search weather by entering any city worldwide with smart autocomplete.

🌡️ **Automatic API Fallback**  
- **Primary:** OpenWeatherMap.org  
- **Secondary:** WeatherAPI.com (Automatic fallback if primary fails)

📅 **Mobile-First Design**  
- Fully responsive UI that looks stunning on Desktop, Tablet, and Mobile.

🧠 **Smart Insight Layer**  
- A logic engine that provides actionable advice based on live conditions.

📍 **High-Accuracy Geolocation**  
- Precise location detection with robust error handling.

🌙 **Compact Tile Interface**  
- A professional, high-density dashboard using square feature tiles.

---

## 🛠️ Tech Stack

| Technology | Usage |
|----------|------|
| HTML5 | Semantic Structure |
| CSS3 | Responsive Flex/Grid System |
| JavaScript | Logic, Normalization & Fallbacks |
| Font Awesome 6 | Visual Icons |
| OpenWeatherMap | Primary Data Source |
| WeatherAPI | Secondary/Fallback Source |

---

## ⚡ Quick Start

```bash
git clone https://github.com/aditya-ai00/weather.git
cd weather

# 1. Setup your API Keys
cp .env.example .env
# Edit .env and add your keys
```

---

## 🔑 API Setup

SkyCast automatically tries **OpenWeatherMap** first. If it fails (invalid key, rate limit, etc.), it immediately switches to **WeatherAPI.com**.

1. **OpenWeatherMap:** Get a key at [openweathermap.org](https://openweathermap.org/)
2. **WeatherAPI:** Get a key at [weatherapi.com](https://www.weatherapi.com/)

---

## 🤝 Community & Documentation

We welcome contributions from everyone! Explore our documentation to get started:

### 📚 Resources
- 🛠️ **[Contributing Guide](docs/CONTRIBUTING.md)** - Learn how to set up and submit your changes.
- 📜 **[Code of Conduct](docs/CODEOFCONDUCT.md)** - Standards for a healthy community.
- ⚖️ **[License](docs/LICENSE.md)** - Apache-2.0 License details.

---
