# 🌍 Culture Explorer

Welcome to **Culture Explorer** — a mobile application built with React Native and Expo that helps users discover, explore, and review cultural spaces such as theaters, cinemas, museums, and events. Whether you're a culture enthusiast looking for your next visit or an administrator managing cultural venues, Culture Explorer has you covered.

---

## 🚀 How to Run

This project is designed to run on **Expo Snack** (snack.expo.dev).

1. Go to [https://snack.expo.dev](https://snack.expo.dev)
2. Upload all project files into the Snack editor
3. Make sure **`App.js`** is set as the entry point (it is the main file of the application)
4. Click **Run** — the app will start on the web preview or on your device via the Expo Go app

> **Note:** No local installation or `npm install` is required. Expo Snack handles all dependencies automatically through the `package.json`.

---

## 🔐 Authentication Services

Culture Explorer uses **Firebase Authentication** and **Cloud Firestore** via direct REST API calls (no Firebase SDK required), which makes it fully compatible with the Expo Snack environment.

The following authentication flows are supported:

- **Sign Up** — users register with their name, email, and password. They also choose their account type (Visitor or Admin) at registration time. User data is stored in Firestore under the `usuarios` collection.
- **Login** — email and password authentication via Firebase Identity Toolkit. Upon login, the app fetches the user's profile from Firestore to determine their account type and redirect them to the correct screen.
- **Forgot Password** — users can request a password reset link sent to their registered email address.
- **Change Password** — authenticated users can update their password from the profile settings screen (minimum 6 characters required).
- **Logout** — clears the current session from memory, returning the user to the login screen.

---

## 👤 Regular User (Visitor) Features

Users who register with the **Visitor** account type have access to the following features:

- **Main Feed** — browse all active cultural venues registered in the app, with name, location, category, and average rating displayed on each card.
- **Search & Filter** — search venues by name and filter by category (Theater, Cinema, Museum, Event). Sorting options include closest, best rated, and most recent.
- **Rate a Venue** — tap on any venue to open the rating screen and submit a review with individual scores for Structure, Service, and Accessibility, plus an optional written comment. Ratings are averaged and reflected on the venue card in real time.
- **Save Venues** — bookmark any venue to a personal saved list for quick access later. Saved venues can be removed at any time.
- **Visited History** — venues that have been rated are automatically added to the user's visited list.
- **Profile Page** — view personal statistics including total reviews submitted, places visited, and average rating given. Tabs allow navigation between Reviews, Visited, and Saved lists.
- **Delete Reviews** — remove any previously submitted review. The venue's average rating is automatically recalculated upon deletion.
- **Edit Profile** — update display name, profile picture (chosen from the device gallery), and password from the settings screen.

---

## 🛡️ Administrator Features

Users who register with the **Admin** account type have access to all visitor features plus the following exclusive capabilities:

- **Register a New Venue** — fill in a form with the venue's name, description, address, category (Theater, Cinema, Museum, Event, Show), and an optional cover photo from the device gallery. The new venue is published immediately to the main feed.
- **Manage Registered Venues** — the admin profile page lists all venues created by that administrator, showing name, category, active status, average rating, and total review count.
- **Activate / Deactivate Venues** — toggle a venue's visibility on the main feed without permanently deleting it. Deactivated venues are hidden from all users.
- **Delete Venues** — permanently remove a venue and all associated data, including reviews and saved/visited references from every user's profile (cascade deletion).
- **View Reviews per Venue** — tap on any of their registered venues to open a detailed reviews screen showing all user-submitted ratings, aspect scores (Structure, Service, Accessibility), written comments, reviewer email, and submission date.
- **Admin Statistics** — the admin profile displays total venues registered, overall average rating across all venues, and total number of reviews received.

---

## 🗂️ Project Structure

```
App.js                  → Entry point; navigation stack setup
FirebaseConfig.js       → Auth and Firestore via REST API (no Firebase package)
TelaLogin.js            → Login screen
TelaCadastro.js         → Registration screen
TelaRedefSenha.js       → Password reset screen
TelaFeedPrincipal.js    → Main feed (home screen)
TelaBusca.js            → Search and filter screen
TelaAvaliacao.js        → Venue rating screen
TelaPerfilVisit.js      → Visitor profile screen
TelaPerfilAdmin.js      → Admin profile screen
TelaCadastrarLocal.js   → Register new venue (admin only)
TelaReviewsLocal.js     → Reviews list for a venue (admin only)
TelaConfigPerfil.js     → Edit profile settings
TelaHistorico.js        → Rating history screen
Styles.js               → Global styles and color tokens
Colors.js               → Color palette constants
components/Component.js → Reusable UI components
```

---

## 🛠️ Tech Stack

- **React Native** with **Expo** (~54)
- **React Navigation** (Native Stack)
- **Firebase Authentication** & **Cloud Firestore** via REST API
- **expo-image-picker** for gallery access
- **@expo/vector-icons** (MaterialIcons, MaterialCommunityIcons, Feather, Ionicons)
- **react-native-paper** for UI components

---

> Built with ❤️ for culture lovers everywhere.
