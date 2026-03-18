# RealEstate Pro - Internal Management System

A comprehensive real estate management system built with Vue 3, Vite, Pinia, and Vue Router. Features include inventory management, CRM, transaction tracking, and automated commission calculations.

## 🌟 Features

### Authentication & Access Control
- Three user roles: Admin, Management, Sales
- Role-based route protection
- Sales staff can only view their own customers

### Dashboard
- Real-time statistics (properties, customers, revenue)
- Interactive charts (monthly sales, properties by status)
- Top performing employees
- Recent transactions feed

### Inventory Management
- Property listings with grid view
- Status tracking: Available → Reserved → Sold
- Filters by status, type, and price
- Full CRUD operations
- Property details with transaction history

### CRM Management
- Customer database with lead tracking
- Status pipeline: Lead → Active → Closed
- Budget preferences and interested property types
- Assigned sales personnel

### Transactions & Cash Flow
- Payment tracking with installment support
- Automated commission calculation (3% base + bonuses)
- Auto-generated payment schedules
- Payment status tracking

### Contract Management
- Generate sample contracts
- PDF export functionality
- Customizable payment terms

### Employee Management (Admin/Management)
- Performance metrics
- Sales tracking
- Commission earnings

## 🛠️ Tech Stack

- **Vue 3** - Composition API
- **Vite** - Build tool
- **Pinia** - State management
- **Vue Router** - Routing with guards
- **Chart.js + vue-chartjs** - Data visualization
- **jsPDF** - PDF generation
- **vue-i18n** - Internationalization

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd realestate

# Install dependencies
npm install

# Start development server
npm run dev
```

### Build for Production

```bash
npm run build
```

## 🌐 Demo Accounts

| Role | Username | Password |
|------|----------|----------|
| Admin | admin | admin123 |
| Management | manager | manager123 |
| Sales | sales | sales123 |

## 📱 Supported Languages

- English (EN)
- Vietnamese (VN) - Default

Switch languages using the toggle in the header.

## 📁 Project Structure

```
src/
├── assets/          # Static assets and global styles
├── components/      # Reusable Vue components
│   ├── common/      # Shared components
│   └── layout/      # Layout components
├── composables/    # Vue composables
├── data/           # Mock data
├── locales/       # i18n translation files
├── router/        # Vue Router configuration
├── stores/         # Pinia stores
├── views/          # Page components
└── App.vue         # Root component
```

## 🔧 Configuration

### Environment Variables
Create a `.env` file for custom configuration:
```env
VITE_APP_TITLE=RealEstate Pro
```

## 📄 License

MIT License

## 👤 Author

Built with Vue 3 + Vite
