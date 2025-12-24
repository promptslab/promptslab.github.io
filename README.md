# PromptLab Website

Official website for PromptLab showcasing the Awesome Prompt Engineering collection.

🌐 **Live**: [https://promptslab.github.io](https://promptslab.github.io)

## Features

- 🔍 **Smart Search** - Instantly filter through 100+ resources
- 🏷️ **Category Filtering** - Browse by Papers, Tools, APIs, Datasets, etc.
- ⚡ **Auto-Sync** - Automatically updates from [Awesome-Prompt-Engineering](https://github.com/promptslab/Awesome-Prompt-Engineering) repo
- 📱 **Responsive Design** - Works perfectly on all devices
- 🎨 **Modern UI** - Beautiful dark theme with smooth animations
- ⚡ **Lightning Fast** - Client-side rendering with smart caching

## How It Works

This website automatically fetches and displays content from the [Awesome-Prompt-Engineering](https://github.com/promptslab/Awesome-Prompt-Engineering) repository:

1. **Content Fetching**: JavaScript fetches the latest `README.md` from the main repo
2. **Parsing**: Markdown is parsed and structured into categories
3. **Caching**: Content is cached locally for 30 minutes for performance
4. **Auto-Update**: Any changes to the main repo appear automatically

## Local Development

```bash
# Clone the repository
git clone https://github.com/promptslab/promptslab.github.io.git
cd promptslab.github.io

# Open in browser
open index.html
# or use a local server
python -m http.server 8000
```

## Project Structure

```
├── index.html      # Main page with Awesome List content
├── about.html      # About PromptLab and projects
├── styles.css      # All styling
├── app.js          # Content fetching and rendering logic
└── README.md       # This file
```

## Deployment

This site is automatically deployed via GitHub Pages:

1. Push changes to `main` branch
2. GitHub Pages automatically builds and deploys
3. Changes are live within minutes at https://promptslab.github.io

## Technologies

- **Pure HTML/CSS/JavaScript** - No frameworks, fast and lightweight
- **GitHub Pages** - Free hosting with automatic deployment
- **GitHub API** - Fetches raw content from the main repo
- **LocalStorage** - Client-side caching for performance

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

Apache 2.0 - See [LICENSE](LICENSE) file for details

## Links

- 🌟 [Awesome Prompt Engineering](https://github.com/promptslab/Awesome-Prompt-Engineering)
- 💬 [Discord Community](https://discord.gg/m88xfYMbK6)
- 🐙 [PromptLab GitHub](https://github.com/promptslab)