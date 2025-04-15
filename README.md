# D&D 5E Alternative Encounter Builder

A modern web application for more accurately calculating combat encounter difficulty in Dungeons & Dragons 5th Edition. This tool uses Power Equivalent Values (PELs) instead of the traditional Challenge Rating (CR) system to provide more accurate difficulty estimations for your D&D encounters.

## Features

- **Advanced Difficulty Calculation**: Uses PEL (Power Equivalent Values) system for more accurate combat encounter difficulty estimation
- **Multiple Difficulty Levels**: Provides difficulty ratings from "trivial" to "absurd"
- **Creature Management**:
  - Filter and search through creature list
  - Quick add/remove creatures to your encounter
  - Support for multiple instances of the same creature
- **Party Management**:
  - Add party members with specific levels
  - Adjust party composition on the fly
- **Modern UI**:
  - Responsive design
  - Virtual scrolling for optimal performance
  - User-friendly interface

## Live Demo

[Add your deployment URL here]

## Installation

To run this project locally:

1. Clone the repository:
```bash
git clone [your-repo-url]
cd alternative_encounter_builder
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173` by default.

## Usage

1. **Setting Up Your Party**:
   - Add the number of party members
   - Set their levels individually
   
2. **Building Your Encounter**:
   - Use the search/filter functionality to find specific creatures
   - Click the add button next to creature names to add them to the encounter
   - Adjust quantities as needed
   
3. **Reading the Results**:
   - The calculator will automatically update the difficulty rating
   - Ratings range from "trivial" to "absurd"
   - The PEL values for both party and monsters are displayed for reference

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run test` - Run tests
- `npm run test:watch` - Run tests in watch mode

### Tech Stack

- React 18
- TypeScript
- Vite
- Jest for testing
- fp-ts for functional programming utilities
- react-window for virtualized lists
- Zod for schema validation

## Theory and Methodology

This encounter builder uses an alternative system for calculating combat difficulty based on Power Equivalent Values (PELs). This system was designed to address some of the limitations of the traditional Challenge Rating (CR) system.

The idea for this system originated from user Gobelure on the ENWorld forums. You can read more about the original concept here:
- [Original Thread](https://www.enworld.org/threads/encounter-difficulty-how-to-fix-it.367697/)
- [Archive Link](https://web.archive.org/web/20210530071808/https://www.enworld.org/threads/encounter-difficulty-how-to-fix-it.367697/)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

[Add your chosen license here]

## Acknowledgments

- Original PEL system concept by Gobelure from ENWorld forums
- The D&D 5E community for feedback and support
- All contributors to this project