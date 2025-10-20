# z1

A SvelteKit web app that provides personalized analysis and insights for Dota 2 players.

https://github.com/user-attachments/assets/1b5ef2de-b370-471a-8470-2bce5a44d436

## 🔥 Features

- **Player ID Input:** Enter a Dota 2 ID to start personalized analysis.
- **OpenDota Integration:** Fetches recent match data and player statistics via the OpenDota API.
- **AI-Powered Analysis:** Uses Google Gemini AI to generate a text summary, identify strengths, and suggest areas for improvement based on match data.
- **Match History Analysis:** Retrieves and analyzes recent Dota 2 matches, including hero identification and playstyle summaries.
- **Player Stats:** Provides detailed gameplay statistics, including:
  - **Favorite Heroes:** Lists most-played heroes with games played and win rates.
  - **Role Distribution:** Breaks down percentage of games played in each role.
  - **Overall Performance:** Displays total games and overall win rate.
- **Tabbed Results Display:** Organizes analysis in a clear, tabbed interface:
  - **Summary:** Overview of recent performance.
  - **Stats:** Detailed player statistics.
  - **Strengths:** Highlights positive gameplay aspects.
  - **Tips:** Offers personalized improvement suggestions.
- **Responsive Design:** Adapts layout for mobile and desktop screens.
- **Loading & Error States:** Shows feedback during data fetching and handles private profiles or invalid IDs.
- **Rate Limiting Handling:** Notifies users when APIs are busy and retries automatically.

## 💻 Technologies 

- SvelteKit
- Svelte 5
- Tailwind CSS
- TypeScript
- OpenDota API
- Google Gemini AI

## 🛠️ Development

Use pnpm for dependency management and scripts:

```sh
pnpm install
pnpm dev
```

## 🚀 Upcoming Features

- Personalized skill progression roadmap
- Advanced strategic insights
- Hero-specific skill assessments

## 🤝 Contributing

Contributions are welcome! If you'd like to contribute, please follow these steps:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature/your-feature-name`).
3. Make your changes.
4. Commit your changes (`git commit -m 'Add some feature'`).
5. Push to the branch (`git push origin feature/your-feature-name`).
6. Open a Pull Request.

Please ensure your code adheres to the project's coding standards and includes tests where applicable.

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
