# ConnectSphere
ConnectSphere is a real-time chat web application where users can register, create profiles, update their interests, find people with similar interests, send friend requests, and chat privately. It focuses on helping users connect meaningfully through shared interests and conversations, offering a clean UI and smooth, responsive experience across devices.

# Tech Stack Used:
Frontend: React.js,
Routing: React Router,
State Management: React Context API,
Backend: Node.js, Express.js,
Database: MongoDB (with Mongoose),
Authentication: JWT (JSON Web Tokens),
Real-time Communication: Socket.io,
Styling: Plain CSS (Responsive with media queries),

# Clone the repository
git clone https://github.com/your-username/connectsphere.git
cd connectsphere

# Install backend dependencies
cd server
npm install

# Create .env file in server directory and add the following:
# (Replace values with your actual credentials)

# .env
MONGO_URI=your_mongo_connection_string
JWT_SECRET=your_jwt_secret


# Start backend server
node index.js

# Open new terminal and install frontend dependencies
cd ../client
npm install

# Start frontend React app
npm start

# Now open in browser
# http://localhost:3000
