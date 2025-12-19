# HUMSJ - Haramaya University Muslim Students Jema'a

A modern web application for the Haramaya University Muslim Students Jema'a organization.

## Features

- 🕌 **Islamic Community Hub** - Connect with fellow Muslim students
- 📚 **Qirat Sector** - Quran memorization and recitation programs
- 💝 **Charity Sector** - Community welfare and support initiatives
- 🎓 **Academic Sector** - Educational excellence programs
- 📅 **Events Management** - Stay updated with community events
- 🔐 **Admin Dashboard** - Comprehensive management system

## Tech Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **Routing**: React Router v6
- **Backend**: Firebase (Firestore)
- **Image Storage**: Cloudinary
- **Build Tool**: Vite

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or bun

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/humsj-connect-hub.git

# Navigate to project directory
cd humsj-connect-hub

# Install dependencies
npm install

# Start development server
npm run dev
```

### Environment Variables

Create a `.env` file in the root directory:

```env
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
VITE_CLOUDINARY_API_KEY=your_api_key
VITE_CLOUDINARY_UPLOAD_PRESET=your_upload_preset
```

## Project Structure

```
src/
├── components/     # Reusable UI components
├── pages/          # Page components
├── hooks/          # Custom React hooks
├── lib/            # Utility functions
└── assets/         # Static assets
```

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Contact

- Email: info@humsj.org
- Website: https://humsj.org
