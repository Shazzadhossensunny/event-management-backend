# Event Management Backend

This is the **backend** of the Event Management Web Application built using **Node.js, Express.js, MongoDB, and TypeScript**.

## ✨ Live Preview

- **Backend Live Link**: [View API](https://event-management-backend-chi.vercel.app/)
- **GitHub Repo**: [Backend GitHub](https://github.com/Shazzadhossensunny/event-management-backend)

---

## 🚀 Features

- Custom Authentication (no third-party auth service)
- Secure JWT-based login and register
- Event CRUD (Create, Read, Update, Delete)
- Join event functionality (user can join only once)
- Event search by title
- Filter by date ranges (Today, Current Week, Last Week, Current Month, Last Month)
- Pagination, sorting, and field selection
- Zod-based input validation
- Express Validator for middleware-based validation

---

## ⚙️ Tech Stack

- **Node.js**
- **Express.js**
- **MongoDB + Mongoose**
- **TypeScript**
- **Zod** for schema validation
- **JWT** for token management
- **bcrypt** for password hashing
- **dotenv** for environment config

---

## 📁 Folder Structure

```
src/
├── app/              # App config and middleware
│   ├── middlewares/
│   └── utils/
├── modules/          # Feature-specific logic (auth, user, event)
│   ├── auth/
│   ├── events/
│   └── users/
├── config/           # DB and other configs
├── constants/        # Constants (roles, messages)
├── interfaces/       # Custom TS interfaces and types
├── server.ts         # App entry point
```

---

## 📦 Installation

```bash
# 1. Clone the backend repo
git clone https://github.com/Shazzadhossensunny/event-management-backend.git

# 2. Navigate to the project folder
cd event-management-backend

# 3. Install dependencies
npm install

# 4. Create .env file in root directory with the following:
```

### ✅ Example `.env` file

```env
PORT=5000
DATABASE_URL=mongodb+srv://<username>:<password>@cluster.mongodb.net/eventDB
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d
NODE_ENV=development
```

```bash
# 5. Run in development mode
npm run start:dev

# or build and run for production
npm run build
npm run start:prod
```

## 🧹 Scripts

```bash
# Start dev server
npm run start:dev

# Lint code
npm run lint

# Format code
npm run prettier

# Build project
npm run build
```

---

## ✨ Author

Built with ❤️ by [Shazzad Hossen Sunny](https://github.com/Shazzadhossensunny)
