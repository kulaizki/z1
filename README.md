# Dota 2 Player Analyzer (Z1)

This SvelteKit application provides personalized analysis and insights for Dota 2 players.

## ✨ Features

*   **Player ID Input:** Enter a Dota 2 ID to begin the analysis.
*   **OpenDota Integration:** Fetches recent match data and player statistics using the OpenDota API.
*   **AI-Powered Analysis:** Generates a text summary, identifies strengths, and suggests areas for improvement using Google Gemini AI based on match data.
*   **Tabbed Results Display:** Presents the analysis in a clear, tabbed interface:
    *   **Summary:** Overall summary of recent performance.
    *   **Stats:** Detailed player statistics.
    *   **Strengths:** Highlights positive aspects of recent gameplay.
    *   **Tips:** Suggests areas for improvement.
*   **Responsive Design:** Adapts layout and spacing for different screen sizes (mobile/desktop).
*   **Loading & Error States:** Provides feedback during data fetching and handles cases like private profiles or invalid IDs.
*   **Rate Limiting Handling:** Indicates when backend APIs are busy and retries automatically.

## 💻 Technologies 

*   SvelteKit
*   Svelte 5
*   Tailwind CSS
*   TypeScript
*   OpenDota API
*   Google Gemini AI

## 🔥 Current Features

- **Match History Analysis**: Retrieve and analyze your recent Dota 2 matches.
- **AI-Powered Insights**: Generate a summary of your playstyle using advanced AI technology.
- **Hero Identification**: Automatically map match data to hero names for comprehensive analysis.
- **Player Stats**: Access comprehensive statistics on your gameplay, including:
  - **Favorite Heroes**: Identify your most-played heroes, detailing the number of games played and win rates.
  - **Role Distribution**: Understand your preferred roles with a breakdown of the percentage of games played in each role.
  - **Overall Performance**: View your total number of games and overall win rate.
- **Strengths and Areas for Improvement**: Receive personalized feedback highlighting your gameplay strengths and suggesting areas for improvement.

## 🚀 Upcoming Features

- Personalized skill progression roadmap
- Personalized improvement recommendations.
- Advanced strategic insights.
- Hero-specific skill assessments.

## 🤝 Contributing

Contributions are welcome! If you'd like to contribute, please follow these steps:

1.  Fork the repository.
2.  Create a new branch (`git checkout -b feature/your-feature-name`).
3.  Make your changes.
4.  Commit your changes (`git commit -m 'Add some feature'`).
5.  Push to the branch (`git push origin feature/your-feature-name`).
6.  Open a Pull Request.

Please ensure your code adheres to the project's coding standards and includes tests where applicable.

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.