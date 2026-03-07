# 💎 Allure

Allure is a fullstack **international dating marketplace** designed to connect **Filipinos and global partners seeking serious relationships**.

The platform focuses on **intentional dating, trust, and safety**, creating meaningful connections between **Filipina women, Filipino men, and international users**.

Built as a **technical portfolio project**, Allure demonstrates a modern **MERN stack application** using **MongoDB, Express, React, and Node.js**, while also exploring the product design, user flows, and system architecture of a niche relationship platform.

The platform emphasizes:

- **Verified identities and safer international dating**
- **Intentional, relationship-focused matching**
- **A freemium marketplace model balancing accessibility and monetization**

Allure aims to become a **trusted global platform connecting Filipinos with the world through meaningful relationships**.

---

# 🚀 Overview

Allure is a **relationship-focused dating platform** built for users seeking **serious connections instead of casual swiping experiences**.

Unlike mainstream dating apps that prioritize endless browsing and short-term engagement, Allure is designed to encourage **intentional communication, trust, and compatibility-driven discovery**.

The platform begins as a **two-sided marketplace**.

## Primary Market (Demand)

International men seeking serious relationships with Filipina partners.

Primary target regions include:

- United States
- Canada
- Australia
- United Kingdom
- Western Europe

## Secondary Market (Supply)

Filipina women interested in international relationships and cross-cultural connections.

## Future Expansion

Once initial traction is achieved, Allure can expand to include:

- Filipino men
- Foreign women

This positions the platform as:

> **A global dating platform connecting Filipinos with the world.**

---

# 🏗 Tech Stack

## Frontend

- React
- Vite
- React Router
- Axios

## Backend

- Node.js
- Express.js
- MongoDB
- Mongoose

## Authentication

- JSON Web Tokens (JWT)
- bcrypt password hashing

## Design

- Figma (user flows, wireframes, UI planning)

## Deployment

- Render (backend API)
- Vercel (frontend)

---

# 📊 MVP Feature Build Roadmap (Technical Build Order)

## 1. Account Creation Features
**Affects:** Demand & Supply

| Feature Name | Description | Objective | Purpose | Build Status |
|------|------|------|------|------|
| User Registration | Allow users to create accounts using email and password | Enable user onboarding | Entry point to the platform | ✅ Implemented |
| Login System | Users authenticate and access their accounts | Secure user sessions | Allow returning users to access the platform | ✅ Implemented |
| Email Verification | Users verify their email after signup | Prevent fake accounts | Improve platform trust and security | ⬜ Not Built |
| Identity Verification | Users submit ID and photo verification | Confirm real identities | Support trust and safety in international dating | ⬜ Not Built |

---

## 2. Profile Creation Features
**Affects:** Demand & Supply

| Feature Name | Description | Objective | Purpose | Build Status |
|------|------|------|------|------|
| Profile Setup | Users complete profile with bio and preferences | Enable identity representation | Allow users to present themselves | ✅ Implemented |
| Profile Photo Upload | Users upload profile photos | Improve engagement | Provide visual representation | ⚠️ Partial (URL-based for now) |
| Interests & Lifestyle Fields | Users add hobbies and lifestyle preferences | Improve compatibility | Enable smarter match discovery | ✅ Implemented |
| Relationship Goals Field | Users specify dating intentions | Clarify expectations | Encourage intentional dating | ✅ Implemented |
| Edit Profile | Users can update their profile details | Maintain profile accuracy | Improve user experience | ⚠️ Partial (API exists) |
| Update Photos | Users can replace or add profile photos | Improve profile presentation | Encourage profile freshness | ⬜ Not Built |

---

## 3. Profile Discovery Features
**Affects:** Demand (Primary) & Supply (Limited)

| Feature Name | Description | Objective | Purpose | Build Status |
|------|------|------|------|------|
| Browse Profiles | Users view other profiles through discovery feed | Enable matchmaking discovery | Allow demand users to explore supply profiles | ✅ Implemented |
| Discovery Visibility Rules | Prevent showing already liked, blocked, or interacted profiles | Maintain clean discovery experience | Avoid duplicate profile exposure | ✅ Implemented |
| Demand Discovery Feed | Male users browse female profiles | Enable marketplace demand flow | Allow demand side to explore supply | ✅ Implemented |
| Profile Detail View | Users open full profile pages | Provide deeper user information | Help users decide on interaction | ⚠️ Partial (API ready, UI not built) |
| Search Filters | Users filter profiles by preferences | Improve discovery efficiency | Help users find compatible matches | ✅ Implemented |
| Supply Discovery Logic | Female users primarily see incoming likes instead of browsing all profiles | Align with marketplace model | Maintain supply–demand balance | ⬜ Not Built |

---

## 4. Interaction Features
**Affects:** Demand & Supply

| Feature Name | Description | Objective | Purpose | Build Status |
|------|------|------|------|------|
| Like System | Users can like other profiles | Express interest | Enable match creation | ✅ Implemented |
| Incoming Likes | Users can see who liked their profile | Enable supply-side interaction review | Allow supply users to accept or ignore demand | ⚠️ Partial (API implemented) |
| Favorite Profiles | Users bookmark profiles | Save interesting profiles | Encourage return engagement | ✅ Implemented |
| Message Requests | Users send messages before matching | Enable direct interaction | Increase conversation opportunities | ⬜ Not Built |

---

## 5. Matching Features
**Affects:** Demand & Supply

| Feature Name | Description | Objective | Purpose | Build Status |
|------|------|------|------|------|
| Match Creation | Mutual likes generate a match | Create mutual connections | Unlock messaging | ✅ Implemented |
| Match List | Users view their matches | Track interactions | Encourage continued engagement | ✅ Implemented |
| Match Inbox | Match list displays latest message and interaction summary | Improve messaging workflow | Provide conversation entry point | ✅ Implemented |

---

## 6. Messaging Features
**Affects:** Demand & Supply

| Feature Name | Description | Objective | Purpose | Build Status |
|------|------|------|------|------|
| Direct Messaging | Matched users can chat | Enable communication | Support relationship development | ✅ Implemented |
| Conversation History | Messages persist in chat threads | Maintain conversation context | Improve user experience | ✅ Implemented |
| Messaging Permission Enforcement | Only matched users can send messages | Prevent spam and abuse | Maintain interaction boundaries | ✅ Implemented |

---

## 7. Safety & Trust Features
**Affects:** Demand & Supply

| Feature Name | Description | Objective | Purpose | Build Status |
|------|------|------|------|------|
| Block Users | Users can block unwanted interactions | Protect user experience | Improve platform safety | ✅ Implemented |
| Unblock Users | Users can remove previously blocked users | Allow users to reverse blocking decisions | Restore interaction permissions | ✅ Implemented |
| User Reporting | Users can report suspicious accounts | Enable moderation | Reduce scams and abuse | ✅ Implemented |
| Profile Verification Badge | Verified users receive badges | Build trust | Increase platform credibility | ✅ Implemented |
| Interaction Abuse Prevention | Prevent repeated like/unlike spam | Protect platform integrity | Maintain fair user interaction | ✅ Implemented |

---

## 8. User Settings Features
**Affects:** Demand & Supply

| Feature Name | Description | Objective | Purpose | Build Status |
|------|------|------|------|------|
| Account Settings | Users manage account preferences | Give users control over accounts | Improve usability | ⬜ Not Built |
| Delete Account | Users can remove their accounts | Support user autonomy | Maintain platform transparency | ✅ Implemented |

---

## 9. Notification Features
**Affects:** Demand & Supply

| Feature Name | Description | Objective | Purpose | Build Status |
|------|------|------|------|------|
| New Match Notification | Notify users when a new match occurs | Improve engagement | Encourage users to start conversations | ⬜ Not Built |
| Message Notification | Notify users when they receive new messages | Maintain active conversations | Improve responsiveness | ⬜ Not Built |
| Like Notification | Notify users when someone likes their profile | Increase user engagement | Encourage profile interaction | ⬜ Not Built |

---

## 10. Monetization Features
**Affects:** Demand (Primary Market)

| Feature Name | Description | Objective | Purpose | Build Status |
|------|------|------|------|------|
| Message Limits | Free users have limited daily messages | Encourage premium upgrade | Balance free and paid usage | ⬜ Not Built |
| Premium Subscription | Paid plan unlocks full features | Generate platform revenue | Support freemium business model | ⬜ Not Built |
| Unlimited Messaging | Premium users send unlimited messages | Improve interaction freedom | Provide subscription value | ⬜ Not Built |
| Profile Boost | Premium users increase profile visibility | Improve match opportunities | Encourage premium upgrades | ⬜ Not Built |

---

## 11. Admin Moderation Features
**Affects:** Platform Administration

| Feature Name | Description | Objective | Purpose | Build Status |
|------|------|------|------|------|
| Report Review System | Admin can review reported users | Maintain platform safety | Remove abusive users | ⬜ Not Built |
| User Suspension | Admin can temporarily suspend accounts | Enforce platform rules | Prevent misuse | ⬜ Not Built |
| User Deletion | Admin can permanently remove users | Maintain platform integrity | Protect community | ⬜ Not Built |

---

## 🧭 Development Principle: Technical Build Order

To avoid endlessly adding features and delaying release, the application must be developed using **technical dependency order** rather than simply completing every feature listed in the roadmap.

Technical build order means **building the systems that other systems depend on first**. Features that do not block the core product flow should not delay development.

The goal is to first complete the **core interaction loop** of the product before expanding the system with trust features, monetization features, notifications, or administrative tools.

---

## Core Product Loop

Register → Login → Create Profile → Discover Profiles → Like → Match → Message

If this loop works end-to-end, the platform is already **functionally usable as an MVP**.

Features that support this loop should always be prioritized.

---

## Development Priority Layers

Features should be developed in the following order based on technical dependency.

### Layer 1 — Core Platform Infrastructure

- Account creation
- Login system
- Profile creation

These systems allow users to **enter the platform and exist within the system**.

---

### Layer 2 — Discovery System

- Profile browsing
- Discovery feed
- Discovery filtering rules
- Search filters

These systems allow users to **find other users on the platform**.

---

### Layer 3 — Interaction System

- Likes
- Favorites
- Incoming likes

These systems allow users to **express interest in other users**.

---

### Layer 4 — Matching System

- Match creation
- Match list
- Match inbox

These systems create **mutual connections between users**.

---

### Layer 5 — Communication System

- Direct messaging
- Conversation history
- Messaging permission enforcement

These systems allow **matched users to communicate**.

---

### Layer 6 — Safety Controls

- Blocking
- Unblocking
- Interaction abuse prevention
- Reporting

These systems protect the **user experience and platform safety**.

---

### Layer 7 — Trust Features

- Email verification
- Identity verification
- Profile verification badges

These increase **platform credibility and trust**, but are not required for the core interaction loop.

---

### Layer 8 — Monetization

- Message limits
- Premium subscriptions
- Boost features

These enable **platform revenue generation** once the product mechanics are working.

---

### Layer 9 — Platform Management

- Admin moderation
- User suspension
- Admin deletion

These support **long-term platform operations and governance**.

---

## Important Rule

If a feature **does not block the core interaction loop**, it should not delay development.

Development should remain focused on making the **core user journey fully functional first**, and only then expanding the platform with additional systems.

---

## 🤖 AI Development Prompt

We are building this application using **technical build order**.

Only recommend features that are necessary to support the **current development layer**.

Do not introduce new features unless they directly support the **core interaction loop**.

### Core Interaction Loop

Register → Login → Create Profile → Discover Profiles → Like → Match → Message

### Development Rules

- Prioritize **backend dependencies first**.
- Avoid suggesting **monetization, notifications, or advanced trust features** until the core platform mechanics are fully implemented.
- Only suggest features that **directly unblock the next step of the core loop**.
- If suggesting a feature, explain:
  - **Which development layer it belongs to**
  - **Why it is required at the current stage of development**.

---

# 🗄 Database Models

## User

| Field | Type | Description |
|------|------|------|
| _id | ObjectId | Unique user identifier |
| email | String | User email address |
| password | String | Hashed password |
| gender | String | User gender |
| country | String | User location |
| role | String | user / admin |
| isVerified | Boolean | Identity verification status |
| createdAt | Date | Account creation timestamp |

---

## Profile

| Field | Type | Description |
|------|------|------|
| _id | ObjectId | Profile identifier |
| userId | ObjectId | Reference to User |
| name | String | User display name |
| age | Number | User age |
| bio | String | Profile description |
| interests | Array | User hobbies |
| lifestyle | String | Lifestyle preferences |
| relationshipGoals | String | Dating intentions |
| photos | Array | Profile image URLs |

---

## Like

| Field | Type | Description |
|------|------|------|
| _id | ObjectId | Like identifier |
| senderId | ObjectId | User who liked |
| receiverId | ObjectId | User who received the like |
| createdAt | Date | Timestamp |

---

## Match

| Field | Type | Description |
|------|------|------|
| _id | ObjectId | Match identifier |
| userOne | ObjectId | First user |
| userTwo | ObjectId | Second user |
| createdAt | Date | Match creation date |

---

## Message

| Field | Type | Description |
|------|------|------|
| _id | ObjectId | Message identifier |
| senderId | ObjectId | Message sender |
| receiverId | ObjectId | Message recipient |
| matchId | ObjectId | Associated match |
| content | String | Message text |
| createdAt | Date | Message timestamp |

---

## Subscription

| Field | Type | Description |
|------|------|------|
| _id | ObjectId | Subscription identifier |
| userId | ObjectId | Subscriber |
| plan | String | Subscription type |
| status | String | active / cancelled |
| createdAt | Date | Subscription start date |

---

## Report

| Field | Type | Description |
|------|------|------|
| _id | ObjectId | Report identifier |
| reporterId | ObjectId | User submitting report |
| reportedUserId | ObjectId | Reported user |
| reason | String | Report reason |
| createdAt | Date | Timestamp |

---

# 📡 API Endpoints

## Authentication

| Method | Endpoint | Description |
|------|------|------|
| POST | /api/auth/register | Register a new user |
| POST | /api/auth/login | Authenticate user |
| GET | /api/auth/me | Fetch logged-in user |

---

## Profiles

| Method | Endpoint | Description |
|------|------|------|
| POST | /api/profiles | Create profile |
| GET | /api/profiles | Fetch profiles |
| GET | /api/profiles/:id | Fetch a single profile |
| PATCH | /api/profiles/:id | Update profile |

---

## Likes

| Method | Endpoint | Description |
|------|------|------|
| POST | /api/likes | Send like |
| GET | /api/likes | Fetch likes |

---

## Matches

| Method | Endpoint | Description |
|------|------|------|
| GET | /api/matches | Fetch user matches |

---

## Messages

| Method | Endpoint | Description |
|------|------|------|
| POST | /api/messages | Send message |
| GET | /api/messages/:matchId | Fetch conversation |

---

## Subscriptions

| Method | Endpoint | Description |
|------|------|------|
| POST | /api/subscriptions | Create subscription |
| GET | /api/subscriptions | Fetch user subscription |

---

## Moderation

| Method | Endpoint | Description |
|------|------|------|
| POST | /api/reports | Report user |
| PATCH | /api/users/block/:id | Block user |
| PATCH | /api/users/suspend/:id | Suspend user |
| DELETE | /api/users/:id | Delete user |

---

# 🔗 Project Resources

## Product Design

Figma Product Design (Wireframes & UI Planning)  
https://www.figma.com/design/jlZwDGlquIWUPYaB1GO6ac/Allure---Product-Design?node-id=2-146&t=TqvR54P1dhXchrjJ-1

---

## Source Code

Backend Repository  
TBD

Frontend Repository  
TBD

---

## Live Deployment

Frontend (Vercel)  
TBD

Backend API (Render)  
TBD

---

## Documentation

Project Documentation  
TBD

API Documentation  
TBD

---

# 🤝 Rules of Engagement

To ensure efficient collaboration during the Allure build process, the following rules will be followed:

1. **Minimize Replies**  
   Responses should remain concise to reduce unnecessary back-and-forth and avoid overwhelming instructions.

2. **No Guessing During Debugging**  
   Do not provide speculative solutions when debugging. Troubleshooting must be based only on the actual code, logs, or errors provided.

3. **Step-by-Step Workflow**  
   Only one step should be given at a time. After each step, wait for confirmation before proceeding.

4. **Provide Complete Code Blocks**  
   Whenever code is required, always provide the **full file** or **full code block** to avoid missing pieces or implementation errors.