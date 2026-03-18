# Real Estate Management System - Specification

## 1. Project Overview

- **Project Name**: RealEstate Pro
- **Type**: Internal Management Web Application (SPA)
- **Core Functionality**: Comprehensive real estate inventory management with CRM, transaction tracking, and automated financial calculations
- **Target Users**: Real estate company staff (Sales, Management, Admin roles)

---

## 2. UI/UX Specification

### Layout Structure

**Main Layout**
- Fixed sidebar (280px) - Navigation menu with role-based menu items
- Top header (64px) - User info, notifications, logout
- Main content area - Scrollable content with breadcrumbs

**Responsive Breakpoints**
- Desktop: ≥1200px (full sidebar)
- Tablet: 768px-1199px (collapsible sidebar)
- Mobile: <768px (hamburger menu)

### Visual Design

**Color Palette**
- Primary: `#1a1a2e` (Dark navy - sidebar, headers)
- Secondary: `#16213e` (Deep blue - cards)
- Accent: `#e94560` (Coral red - CTAs, highlights)
- Success: `#00d9a5` (Mint green - available status)
- Warning: `#ffc93c` (Amber - reserved status)
- Danger: `#ff6b6b` (Salmon - sold status)
- Background: `#0f0f1a` (Near black)
- Surface: `#1f1f35` (Card backgrounds)
- Text Primary: `#ffffff`
- Text Secondary: `#a0a0b8`
- Border: `#2d2d4a`

**Typography**
- Font Family: `'Outfit', sans-serif` (headings), `'DM Sans', sans-serif` (body)
- H1: 32px, 700 weight
- H2: 24px, 600 weight
- H3: 18px, 600 weight
- Body: 14px, 400 weight
- Small: 12px, 400 weight

**Spacing System**
- Base unit: 8px
- XS: 4px, SM: 8px, MD: 16px, LG: 24px, XL: 32px, XXL: 48px

**Visual Effects**
- Card shadows: `0 4px 24px rgba(0, 0, 0, 0.4)`
- Hover transitions: 0.3s ease
- Border radius: 12px (cards), 8px (buttons), 6px (inputs)
- Glassmorphism on modals: `backdrop-filter: blur(12px)`

### Components

**Sidebar Navigation**
- Logo at top
- Role-based menu items with icons
- Active state: accent color left border, background highlight
- Hover: subtle background change

**Data Tables**
- Striped rows with hover highlight
- Sortable columns
- Pagination controls
- Row actions (edit, delete, view)

**Cards**
- Stat cards with icon, value, label, trend indicator
- Property cards with image, details, status badge

**Status Badges**
- Available: Green background (#00d9a5/15%), green text
- Reserved: Yellow background (#ffc93c/15%), yellow text
- Sold: Red background (#ff6b6b/15%), red text

**Buttons**
- Primary: Accent color background, white text
- Secondary: Transparent with border
- Disabled: 50% opacity

**Form Inputs**
- Dark background (#1a1a2e)
- Border on focus (accent color)
- Error state with red border

**Modals**
- Centered overlay with glassmorphism
- Close button top-right
- Action buttons bottom-right

---

## 3. Functionality Specification

### Authentication & Access Control

**Roles**
1. **Admin**: Full access to all modules
2. **Management**: View all data, manage employees, approve transactions
3. **Sales**: Manage own customers, view inventory, create transactions

**Login Flow**
- Username/password authentication
- Role stored in localStorage
- Route guards based on role
- Session persistence

### Module 1: Dashboard

**Stats Overview**
- Total properties (with breakdown by status)
- Total customers
- Monthly revenue
- Pending transactions

**Charts**
- Monthly sales bar chart (last 6 months)
- Properties by status pie chart
- Top performing employees bar chart

**Recent Activity**
- Latest transactions list
- Recent property status changes

### Module 2: Inventory Management

**Property List**
- Grid/List view toggle
- Filters: Status, Price range, Type, Location
- Search by property name/code

**Property Details**
- Property information (name, address, type, size, price)
- Status management (Available → Reserved → Sold)
- Image gallery
- Transaction history
- Assigned sales person

**Property Types**
- Apartment, House, Villa, Land, Commercial

**Status Transitions**
- Available → Reserved (requires customer)
- Reserved → Sold (requires payment)
- Sold → (archived)

### Module 3: CRM Management

**Customer List**
- Name, phone, email, interested properties
- Status (Lead, Active, Closed)
- Assigned sales person

**Customer Details**
- Full contact information
- Interested properties
- Transaction history
- Notes/follow-ups

**Access Control**
- Sales: See only own customers
- Management: See all customers
- Admin: Full access

### Module 4: Transactions & Cash Flow

**Transaction List**
- Property, Customer, Sales person
- Payment status (Pending, Partial, Complete)
- Total amount, paid amount, remaining
- Date created

**Transaction Details**
- Property and customer info
- Payment schedule table
- Commission calculation
- Payment history

**Commission Calculation**
- Base commission: 3% of sale price
- Performance bonus: 1% if target exceeded
- Deductions: Fixed amounts
- Net commission displayed

**Payment Schedule**
- Auto-generate based on payment terms
- Installment tracking
- Due date reminders
- Mark as paid functionality

### Module 5: Contract Export

**Sample Contract Generation**
- Fill in property details
- Fill in customer details
- Fill in payment terms
- Export as PDF (or HTML print)

### Module 6: Employee Management (Admin/Management only)

**Employee List**
- Name, role, email, phone
- Status (Active/Inactive)
- Performance metrics

**Employee Details**
- Personal information
- Assigned customers
- Sales history
- Commission earnings

---

## 4. Technical Implementation

**Tech Stack**
- Vue 3 (Composition API)
- Vite
- Vue Router (with guards)
- Pinia (state management)
- Chart.js + vue-chartjs (charts)
- jsPDF (PDF export)

**Project Structure**
```
src/
├── assets/
├── components/
│   ├── common/
│   ├── dashboard/
│   ├── inventory/
│   ├── crm/
│   ├── transactions/
│   └── layout/
├── composables/
├── router/
├── stores/
├── views/
├── utils/
└── App.vue
```

**Mock Data**
- JSON files for properties, customers, transactions, employees
- Simulated API delays for realism

---

## 5. Acceptance Criteria

### Visual Checkpoints
- [ ] Dark theme with coral accent consistently applied
- [ ] Sidebar navigation functional with role-based items
- [ ] Dashboard displays all stat cards and charts
- [ ] Tables are sortable and paginated
- [ ] Status badges show correct colors
- [ ] Modals open/close smoothly with animations

### Functional Checkpoints
- [ ] Login works with role-based redirect
- [ ] Role-based route protection works
- [ ] Properties can be CRUD operated
- [ ] Status transitions work correctly
- [ ] Customer management respects access control
- [ ] Transaction creation calculates commissions
- [ ] Payment schedule generates correctly
- [ ] Contract export generates printable document
- [ ] Dashboard charts display data correctly
- [ ] Search and filters work on all lists
