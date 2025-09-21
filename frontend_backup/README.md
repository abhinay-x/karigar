# KalaAI: AI-Powered Marketplace Assistant for Local Artisans

![KalaAI Logo](https://via.placeholder.com/800x200/f59e42/ffffff?text=KalaAI+-+Empowering+Artisans+with+AI)

## 🎨 Overview

KalaAI is an innovative AI-driven marketplace assistant that empowers local artisans to digitally showcase, market, and sell their traditional crafts. The platform bridges the gap between heritage craftsmanship and modern digital commerce through Google Cloud's generative AI capabilities.

### 🌟 Vision
"Preserving cultural heritage through AI-powered digital transformation, connecting artisan stories with global audiences."

## ✨ Key Features

### 🤖 AI-Powered Content Generation
- **Multi-language Support**: Generate product descriptions in Hindi, English, Bengali, Tamil, Telugu, and Marathi
- **Cultural Storytelling**: Transform craft descriptions into compelling narratives that preserve cultural heritage
- **SEO Optimization**: Automatically generate keywords and hashtags for better discoverability
- **Social Media Content**: Create platform-specific content for Instagram, Facebook, and WhatsApp

### 🏪 Intelligent Storefront Builder
- **One-Click Setup**: Create professional digital storefronts instantly
- **Cultural Themes**: Choose from Heritage Classic, Modern Minimalist, or Artisan Showcase themes
- **Mobile-Responsive**: Optimized for all devices with cultural design elements
- **Customizable**: Drag-and-drop interface with traditional Indian aesthetic options

### 📊 Comprehensive Dashboard
- **Business Intelligence**: Track sales, customer engagement, and product performance
- **Digital Score**: Monitor your digital presence and growth metrics
- **Analytics**: Visual charts showing sales trends and customer behavior
- **Product Management**: Easy-to-use interface for managing your craft inventory

### 🎯 Smart Features
- **Image Enhancement**: AI-powered photo optimization for professional product shots
- **Pricing Suggestions**: Intelligent pricing recommendations based on materials and market data
- **Multi-device Preview**: See how your storefront looks on desktop, tablet, and mobile
- **Cultural Preservation**: Document traditional techniques and stories for future generations

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/kala-ai.git
   cd kala-ai
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173` to see KalaAI in action!

## 🛠️ Technology Stack

### Frontend
- **React 19**: Modern React with hooks and functional components
- **Vite**: Lightning-fast build tool and development server
- **Tailwind CSS**: Utility-first CSS framework with custom cultural themes
- **React Router**: Client-side routing for seamless navigation
- **Lucide React**: Beautiful, customizable icons
- **Recharts**: Interactive charts for analytics dashboard

### Styling & Design
- **Custom Color Palette**: Inspired by traditional Indian art and crafts
- **Cultural Typography**: Support for Devanagari, Bengali, and Tamil scripts
- **Responsive Design**: Mobile-first approach with cultural sensitivity
- **Accessibility**: WCAG compliant with screen reader support

### State Management & Utils
- **React Hooks**: Modern state management with useState and useEffect
- **Local Storage**: Persistent user preferences and settings
- **React Hot Toast**: Beautiful notification system
- **Framer Motion**: Smooth animations and transitions (ready for implementation)

## 📁 Project Structure

```
kala-ai/
├── public/                 # Static assets
├── src/
│   ├── components/        # Reusable UI components
│   │   ├── common/       # Shared components (Navbar, Footer)
│   │   ├── artisan/      # Artisan-specific components
│   │   ├── ai/           # AI-related components
│   │   └── storefront/   # Storefront builder components
│   ├── pages/            # Page components
│   │   ├── HomePage.jsx
│   │   ├── OnboardingPage.jsx
│   │   ├── DashboardPage.jsx
│   │   ├── ProductsPage.jsx
│   │   ├── AIAssistantPage.jsx
│   │   └── StorefrontPage.jsx
│   ├── utils/            # Utility functions and constants
│   │   ├── constants.js  # App constants and configurations
│   │   └── helpers.js    # Helper functions
│   ├── types/            # Data structure templates
│   └── assets/           # Images, icons, and other assets
├── tailwind.config.js    # Tailwind CSS configuration
├── vite.config.js        # Vite configuration
└── package.json          # Dependencies and scripts
```

## 🎨 Design System

### Color Palette
- **Primary**: Warm orange tones (#f59e42) representing traditional crafts
- **Secondary**: Cool blues (#0ea5e9) for modern digital elements  
- **Accent**: Vibrant reds (#ef4444) for call-to-action elements
- **Cultural**: Earth tones and heritage colors throughout

### Typography
- **Headings**: Noto Sans Devanagari for cultural authenticity
- **Body**: Inter for modern readability
- **Accent**: Playfair Display for artisan storytelling

## 🌍 Supported Languages

KalaAI supports content generation in multiple Indian languages:
- 🇺🇸 English
- 🇮🇳 Hindi (हिन्दी)
- 🇧🇩 Bengali (বাংলা)
- 🇮🇳 Tamil (தமிழ்)
- 🇮🇳 Telugu (తెలుగు)
- 🇮🇳 Marathi (मराठी)

## 🎯 Target Audience

### Primary Users: Local Artisans & Craftsmen
- **Demographics**: Ages 25-60, rural/semi-urban areas
- **Skills**: Traditional craft expertise, limited digital literacy
- **Needs**: Simple tools, local language support, income growth

### Secondary Users: Conscious Consumers
- **Demographics**: Urban millennials, Gen Z, global buyers
- **Behavior**: Value authenticity, cultural stories, sustainable purchases
- **Motivations**: Supporting traditional crafts, unique products

## 🚀 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🤝 Contributing

We welcome contributions from developers, designers, and cultural enthusiasts! Please read our contributing guidelines and code of conduct.

### Development Setup
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Traditional artisans who inspired this project
- Google Cloud AI for powering our intelligent features
- The open-source community for amazing tools and libraries
- Cultural heritage organizations for their guidance and support

## 📞 Support & Contact

- **Email**: support@kalaai.com
- **Website**: https://kalaai.com
- **Documentation**: https://docs.kalaai.com

---

**Made with ❤️ for preserving cultural heritage and empowering artisans worldwide.**

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
