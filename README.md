Here is the README content translated into English, maintaining the professional focus on the project's features and technical architecture:

CampusConnect: Campus Life and Marketplace Platform
CampusConnect is a hybrid mobile platform that consolidates social interaction, event tracking, and campus-based second-hand shopping experiences for university students under one roof.

🚀 About the Project
CampusConnect was developed to digitize the campus ecosystem. It is a comprehensive mobile solution where students can list items ranging from course materials to electronic devices, stay updated on events, and communicate with each other through community channels.

🛠 Technical Architecture
The project was built with modern technologies, aiming for high scalability and performance:

Mobile Development: React Native & Expo (Cross-platform compatibility).

Backend & Database: Firebase Firestore (Real-time data synchronization).

Authentication: Firebase Auth (Secure session management).

State Management: React Context API (Global theme and user state management).

Navigation: React Navigation (Stack & Tab-based hierarchical structure).

UI Design: Linear Gradient, dynamic Dark/Light Mode support.

💡 Key Features
1. Marketplace and Listing Management
Create/Edit/Delete Listings: A CRUD-based system where users can manage their own listings.

Categorization: Filtering options such as Books, Electronics, Clothing, etc.

Listing Details: Permissions for owners to edit/delete their items, and for other users to initiate contact.

2. Communication and Messaging
Real-time Chat: Messaging infrastructure powered by Firebase Firestore.

Chat List: A central hub for users to track their active conversations.

3. Community and Discovery
Event Management: Listing and tracking campus events.

Community Interaction: Sharing and post management through community pages.

4. Experience and Accessibility
Theme Management: Dark/Light Mode support that adapts to system preferences or manual selection.

Secure Navigation: Robust user flow management with high error tolerance.

Profile Management: A flexible profile system with dynamic photo and name updates.

📂 Project Structure
Plaintext
/src
  /context        - Global state management (Auth, Theme)
  /navigation     - Navigation configurations
  /screens
    /auth         - Login and Register processes
    /market       - Listing, details, and creation
    /community    - Community pages and post feeds
    /chat         - Instant messaging screens
    /profile      - Profile settings and user management
  /config         - Firebase integration settings
🚀 Getting Started
Clone the repository: git clone [REPO_URL]

Install dependencies: npm install

Add your Firebase configuration to config/firebase.js.

Start the application: npx expo start

CampusConnect is a continuously evolving software project developed to simplify campus life.
