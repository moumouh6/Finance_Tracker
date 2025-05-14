FinTrack - Personal Finance Tracker

A modern web application for tracking personal finances, managing budgets, and gaining insights into spending habits.

<div align="center">

[![Status](https://img.shields.io/badge/STATUS-EN%20COURS%20(IN%20PROGRESS)-orange?style=for-the-badge)](https://github.com/moumouh6/Finance_Tracker)

</div>

<table>
<tr>
<td width="70%">
<strong>🚧 DEVELOPMENT IN PROGRESS</strong><br>
This application is under active development. Some features shown in the documentation may be partially implemented or planned for future releases.
</td>
<td width="30%" align="right">
<img src="https://img.shields.io/badge/Last%20Updated-May%202025-blue" alt="Last Updated: May 2025">
</td>
</tr>
</table>

Live Demo: [https://personal-finance-tracker2.netlify.app/](https://personal-finance-tracker2.netlify.app/)

## Features

- **User Authentication**: Secure login and registration system
- **Dashboard**: Get an overview of your financial status with monthly income, expenses, and balance
- **Transaction Management**: Record and categorize your income and expenses
- **Categories**: Organize transactions by custom categories
- **Budgets**: Set spending limits for different categories
- **Reports**: Visualize your spending patterns and financial trends
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Dark/Light Theme**: Choose your preferred appearance

## Technology Stack

- **Frontend**: React.js with TypeScript
- **Routing**: React Router v6
- **Styling**: Tailwind CSS for responsive and modern UI
- **State Management**: React Context API
- **Build Tool**: Vite for fast development and optimized production builds

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm or yarn

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/finance-tracker.git
   cd finance-tracker
   ```

2. Install dependencies
   ```bash
   npm install
   # or
   yarn
   ```

3. Start the development server
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

## Building for Production

```bash
npm run build
# or
yarn build
```

The build artifacts will be located in the `dist` directory.

## Project Structure

```
finance-tracker/
├── public/             # Static assets
├── src/
│   ├── components/     # Reusable UI components
│   ├── context/        # React contexts for state management
│   ├── data/           # Mock data and data models
│   ├── pages/          # Application pages
│   ├── types/          # TypeScript type definitions
│   ├── utils/          # Utility functions
│   ├── App.tsx         # Main application component
│   └── main.tsx        # Application entry point
├── index.html          # HTML template
├── package.json        # Dependencies and scripts
└── README.md           # Project documentation
```

## Future Enhancements

- Synchronization with bank accounts
- Export/Import functionality for transactions
- Advanced reporting and analytics
- Mobile application
- Recurring transactions
- Financial goals tracking

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Icons by [Lucide](https://lucide.dev/)
- UI inspiration from modern finance applications
