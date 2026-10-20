# ⚽ KickOff (KickØff)

[![Live on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://kick-off-silk-five.vercel.app)
[![React 19](https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react)](https://kick-off-silk-five.vercel.app)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?style=for-the-badge&logo=typescript)](https://kick-off-silk-five.vercel.app)

> **Live Demo:** [https://kick-off-silk-five.vercel.app](https://kick-off-silk-five.vercel.app)  
> **A Modern, High-Performance Web-Based Football Management & Career Simulator**  
> *Inspired by the tactical depth of Football Manager and the career progression of FIFA, engineered for zero clunkiness, buttery 60fps responsiveness, and deployed live on Vercel.*

---

## 🌟 Overview

**KickØff** (stylized with the Norwegian **Ø** in honor of Martin Ødegaard) was designed from the ground up to solve the clunkiness of legacy Java Swing football managers. Built with modern React 19, TypeScript, and Tailwind CSS, it offers a visual tactical pitch, live match day simulation with half-time tactical interventions, authentic European clubs with realistic player attributes, and a comprehensive **10-Season Dynasty & Aging Engine**.

---

## ⚡ Core Features

### 1. 🏟️ Interactive Tactical Pitch Board
* **Multiple Tactical Systems:** Seamlessly toggle between `4-3-3`, `4-2-3-1`, `3-5-2`, `4-4-2`, and `5-3-2`.
* **Visual Pitch Canvas:** Striped pitch turf with SVG pitch markings (penalty boxes, center circle, corner arcs).
* **Tactical Sliders:** Adjust club mentality (*Ultra Defensive, Defensive, Balanced, Attacking, All-Out Attack*) and pressing systems (*Low Block, Mid Block, Gegenpress*).
* **Tactile Substitutions:** Click any player on the pitch or bench to instantly swap positions or sub players.

### 2. ⚡ Dynamic Match Simulation Engine (Anti-RNG)
* **Momentum & Underdog Mechanics:** Matches are not decided purely by static overalls. Momentum shifts dynamically based on field tilt and winning/losing streaks.
* **Live Interactive Match Day:**
  * Minute-by-minute action ticker with event tags (Goals ⚽, Yellow Cards 🟨, Woodwork hits 🥅, Big Saves 🧤).
  * Field pressure and momentum bar.
  * Simulation speed controls (`1x`, `Fast 5x`, and `Sim to End`).
* **Half-Time Locker Room (at 45'):** The simulation automatically halts at half-time, allowing you to review possession and xG, make tactical switches, and bring on fresh bench substitutes.

### 3. 📅 10-Season Dynasty & Player Aging Engine
* **A Decade of Football:** Play through 10 full seasons with authentic round-robin league schedules and dynamic standings.
* **Realistic Player Development Curve:**
  * **Wonderkids (Age < 23):** Grow +1 to +4 OVR annually based on potential and match ratings.
  * **Prime Players (Age 24–29):** Maintain peak performance.
  * **Veterans (Age 30+):** Experience natural decline in pace, stamina, and physical attributes.
* **Club Job Offers:** At the end of every season, lift trophies, review the Golden Boot, and choose whether to renew with your current club or take charge of a rival European giant.

### 4. 💰 Global Transfer Market & Scouting
* **32 Elite European Powerhouses:** Real squads featuring Arsenal, Real Madrid, Manchester City, Barcelona, Bayern Munich, Liverpool, Bayer Leverkusen, Inter Milan, PSG, and more.
* **Authentic Player Database:** Over 600 players accurately rated across Pace, Shooting, Passing, Dribbling, Defending, Physical, Stamina, Potential, and Market Value.
* **Negotiations & Signings:** Scout players, bid using your club's transfer budget, or sell squad members to generate capital.

### 5. 💾 Browser Persistence & Export
* Automatically persists career progress to `localStorage` so your dynasty is never lost.
* Full career reset and manual backup options.

---

## 🚀 Tech Stack

* **Framework:** React 19 + TypeScript
* **Bundler & Tooling:** Vite 6
* **Styling:** Tailwind CSS + Custom Pitch Canvas shaders
* **Icons:** Lucide React
* **Effects:** Canvas Confetti

---

## 💻 Local Development

1. **Clone the repository:**
   ```bash
   git clone https://github.com/TaskinXZ/KickOff.git
   cd KickOff
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start local development server:**
   ```bash
   npm run dev
   ```
   Open your browser at `http://localhost:5173`.

4. **Production Build:**
   ```bash
   npm run build
   ```

---

## 🌐 Deploy to Vercel / Netlify

### Deploy with Vercel
1. Push your repository to GitHub.
2. Go to [vercel.com](https://vercel.com) and click **Add New Project**.
3. Import `TaskinXZ/KickOff`.
4. Framework Preset: **Vite**.
5. Click **Deploy**!

### Deploy with Netlify
1. Connect your repository on [netlify.com](https://netlify.com).
2. Build command: `npm run build`
3. Publish directory: `dist`
4. Click **Deploy Site**!

---

## 📄 License
MIT License. Built with passion for football tactics and modern web engineering.
