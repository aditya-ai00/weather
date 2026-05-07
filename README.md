# 🌐 Nexus Spring of Code 2026

This project is part of **Nexus Spring of Code (NSoC) 2026**.

🧑‍💻 Contributors can work on open issues and submit pull requests following the contribution guidelines.  
🏷️ Make sure your PR includes the tag **NSoC'26** for leaderboard tracking.

---

# 🌦️ Weather App — Beyond Just Weather

> ⚡ Fast. Clean. Insightful.  
> Not just weather data — **weather that helps you decide.**

---

## 🌌 What Makes This Different?

Most weather apps show:
> “30°C, Humid”

This app tells you:
> “Hot & humid — expect discomfort, stay hydrated 💧”

👉 This project focuses on **decision-making, not just data display.**

---

## 🧠 Core Concept: Decision Layer

This app includes a **logic layer** that interprets weather data.

| Condition | Insight |
|----------|--------|
| High Temperature | Avoid outdoor activity ☀️ |
| Rain | Carry umbrella ☔ |
| High Humidity | Expect discomfort 🌫️ |

📌 Future: AI-powered recommendations

---

## ✨ Features

🔍 **City Search**  
- Search weather by entering any city  

🌡️ **Real-Time Data**  
- Temperature  
- Humidity  
- Wind Speed  
- Weather Conditions  

🌥️ **Dynamic Weather Icons**  
- UI updates based on live conditions  

🌙 **Dark Mode**  
- Persistent theme toggle  

🌡️ **Unit Converter (°C ↔ °F)**  
- Instant conversion without API calls  

⚠️ **Error Handling**  
- Handles invalid inputs gracefully  

🎨 **Minimal UI**  
- Clean, distraction-free experience  

---

## 🔄 How It Works

```text
User Input
   ↓
API Call (WeatherAPI)
   ↓
Data Processing Layer
   ↓
Insight Generation
   ↓
UI Rendering
```

---

## ⚙️ Engineering Decisions

- ⚡ Async API calls for faster response
- 🧠 Client-side data processing for instant insights
- 🎯 Minimal dependencies for performance

### Trade-offs
- No backend → faster but no persistent history
- Client-only → lightweight but limited scalability

---

## 🌍 Real-World Use Cases

- 🏃 Plan workouts
- 🎒 Student commute planning
- ✈️ Travel preparation
- 🌡️ Daily decision making

---

## ⚖️ Why This Over Other Weather Apps?

| Feature | This App | Typical Apps |
|--------|---------|-------------|
| Clean UI | ✅ | ❌ cluttered |
| Insight-based | ✅ | ❌ raw data only |
| Lightweight | ✅ | ❌ heavy |
| Fast loading | ✅ | ❌ slower |

---

## 🛠️ Tech Stack

| Technology | Usage |
|----------|------|
| HTML | Structure |
| CSS | Styling |
| JavaScript | Logic |
| WeatherAPI | Data |
| Git | Version Control |

---

## 📂 Project Structure

```text
📁 weather
┣ 📄 index.html
┣ 📄 style.css
┣ 📄 script.js
┣ 📄 config.example.js
┣ 📄 README.md
```

---

## ⚡ Quick Start

```bash
git clone https://github.com/aditya-ai00/weather.git
cd weather
open index.html
```

---

## 🔑 API Setup

Uses **WeatherAPI**

### Steps:
1. Go to 👉 https://www.weatherapi.com/api-explorer.aspx  
2. Generate your API key  
3. Create `config.js`  

```js
const config = {
  WEATHER_API_KEY: "YOUR_KEY"
};
```

---

## 🚀 Live Demo

🌍 [View Live App](https://weather-pink-psi-97.vercel.app/)

---

## 🔮 Future Roadmap
- 📅 7-Day Forecast
- 📊 Weather analytics dashboard
- 🌍 Multi-city tracking
- 🔔 Smart alerts
- 🤖 AI weather assistant

---

## 🤝 Contributing

Want to make this better? 🚀  

### 🔥 High-impact contributions:
- Add forecast system  
- Improve UI/UX  
- Build analytics dashboard  
- Add AI insights  

### Steps:

```bash
git checkout -b feature/your-feature
git commit -m "feat: add feature"
git push origin feature/your-feature
```
Then open a PR with tag NSoC'26.

---

## 🐛 Issues

Found a bug? Open an issue — contributions are welcome!

---

## 📄 License

Licensed under Apache-2.0

---
## 📬 Contact

📧 Email: adityanyo39@gmail.com  
🔗 LinkedIn: https://www.linkedin.com/in/aditya-kumar23/  
💻 GitHub: https://github.com/aditya-ai00  

---

## 💡 Why This Project?

Most weather apps are:
- ❌ Too complex  
- ❌ Filled with ads  
- ❌ Or too basic  

This project aims to be:
- ⚡ Fast  
- 🎯 Simple  
- 🧠 Actually useful  

---

## ⭐ Support

If you like this project:
👉 Star ⭐ the repo  
👉 Share it  

---

## ⚡ Author

**Aditya**  
GitHub: https://github.com/aditya-ai00  

---

## 🆕 Recent Updates

- 🌙 Dark Mode with persistence  
- 🌡️ Unit Converter (°C ↔ °F)  
- ⚡ Performance improvements
