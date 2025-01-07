# BoomBox

## Description

**BoomBox** is a full-stack application that allows users to search for, save, and manage their favorite media from the iTunes API. Users can log in, browse and search for media by type, and add selected items to a personalized favorites list. This app supports various media types, including movies, podcasts, music, audiobooks, short films, TV shows, software, and eBooks. Users can also remove items from their favorites, ensuring duplicates are not added, and view more results through paginated pages for a smoother browsing experience.

## Purpose

The purpose of this application is to provide users with a simple and efficient way to find, save, and organize their favorite media items in one convenient place. By enabling multiple media types and robust searching capabilities, users can easily explore and manage their media preferences, making it perfect for media enthusiasts who like to keep track of their favorites.

## Key Features

- **User Authentication**: Users can register and log in securely to manage their favorite media.
- **Media Search**: Allows searching by different media types such as movies, music, podcasts, etc.
- **Favorite Management**: Users can add, view, and remove items from their favorites, with duplicate prevention.
- **Pagination**: Optimizes search results by displaying items on multiple pages to improve load time and usability.
- **Secure API**: Uses JWT for secure API requests, ensuring only authorized users can access personal features.
- **Tech Stack**: Built with Express, MongoDB, Node.js, and React for a responsive, full-stack experience.

---

## Installation and Setup

### Prerequisites

- Node.js (v12 or higher)
- MongoDB (local or cloud instance like MongoDB Atlas)

### Clone the Repository

`code`
git clone https://github.com/your-username/boombox.git
cd boombox

## Backend Setup

**Install the backend dependencies:**

`code`
npm install

**Create a .env file in the backend directory and add the following environment variables:**

`code`
JWT_SECRET=your_jwt_secret_key_here
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/your_database_name?retryWrites=true&w=majority
PORT=5000

**Start the backend server:**

`code`
npm start

## Frontend Setup

**Open a new terminal and navigate to the frontend directory:**

`code`
cd client

**Install the frontend dependencies:**

`code`
npm install

**Start the frontend server:**

`code`
npm start

## Using the Application

- **Register**: Create an account on the registration page.
- **Log In**: Use your credentials to log in and access the media search and favorites features.
- **Search for Media**: Use the search functionality to find media by type (e.g., movies, music, podcasts).
- **Add to Favorites**: Save your preferred media items to your favorites list.
- **Manage Favorites**: Access your favorites list, view saved items, and remove any you no longer want.

## Tech Stack

- **Frontend**: Create an account on the registration page.
- **Backend**: Use your credentials to log in and access the media search and favorites features.
- **Authentication**: Use the search functionality to find media by type (e.g., movies, music, podcasts).
- **Deployment**: Save your preferred media items to your favorites list.

## Contributing

- **Fork the repository**
- **Create a new branch**
- **Commit your changes**
- **Push to the branch**
- **Open a Pull Request**

## Lisence

This project is licensed under the MIT License.
