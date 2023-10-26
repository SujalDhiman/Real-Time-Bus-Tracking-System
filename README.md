# Real-Time Bus Tracking 

<div align="center">
  <img src="https://github.com/SujalDhiman/Smart-Bharat-Hackathon/assets/84838153/01c39147-2711-4cf6-b899-bdea6da3bd40.png" width="300" height="250">
</div>

---

This repository contains the source code and documentation for a real-time bus tracking system developed using various technologies, including Tailwind CSS, React, Express, MongoDB, Socket.io, and the Google Maps API. Additionally, the project features a chatbot powered by Natural Language Processing (NLP) and Machine Learning (ML) for improved user interaction.

---

## Table of Contents

1. [Overview](#overview)
2. [Technologies Used](#technologies-used)
3. [Getting Started](#getting-started)
4. [Project Structure](#project-structure)
5. [Deployment](#deployment)
6. [Chatbot](#chatbot)
7. [License](#license)

## Overview

The Real-Time Bus Tracking project aims to provide a modern, user-friendly, and real-time bus tracking solution that allows users to track the location of buses on a map. This system enhances the public transportation experience by providing accurate bus locations and estimated arrival times. The Google Maps API is integrated to display and interact with the maps.

The project also features a chatbot integrated with NLP and ML capabilities to answer user queries, provide route information, and offer a more personalized experience to users.

## Technologies Used

- **Tailwind CSS**: Used for designing and styling the user interface.
- **React**: Developed the front-end interface and real-time map tracking.
- **Express**: Built the backend server for handling API requests and managing data.
- **MongoDB**: Used for storing and managing bus route data.
- **Socket.io**: Enabled real-time communication between the server and clients.
- **Google Maps API**: Integrated for displaying and interacting with maps.
- **Azure**: Deployed the application on Azure cloud services for scalability and reliability.
- **NLP and ML**: Utilized Natural Language Processing and Machine Learning for the chatbot functionality.

## Getting Started

To get a copy of this project up and running on your local machine for development and testing purposes, follow these steps:

1. Clone the repository to your local machine:

   ```shell
   git clone https://github.com/your-username/real-time-bus-tracking.git
   ```

2. Install the project dependencies:

   ```shell
   cd real-time-bus-tracking
   npm install
   ```

3. Set up your environment variables, including database connection details, Google Maps API keys, and Azure deployment settings.

4. Start the development server:

   ```shell
   npm start
   ```

5. Access the application by navigating to `http://localhost:3000` in your web browser.

## Project Structure

The project structure is organized as follows:

- `FrontEnd/`: Contains the React front-end application.
- `BackEnd/`: Houses the Express backend and chatbot logic.
- `BackEnd/models/`: Stores MongoDB schema and models.
- `BackEnd/router/`: Defines API routes.
- `BackEnd/Database/`: Stores MongoDB connections.
- `BackEnd/controllers/`: Contains end-point functionalities.

## Deployment

This project is deployed on Azure, providing a scalable and reliable platform for real-time bus tracking. 

## Chatbot

The chatbot integrated into this project uses NLP and ML to provide intelligent responses to user queries. It can handle questions about bus routes, estimated arrival times, and other relevant information. 

## License

This project is licensed under the [MIT License](LICENSE). Feel free to use and modify the code according to the terms of this license.

---

We hope you find this real-time bus tracking project useful and look forward to your contributions and feedback. If you have any questions or encounter issues, please open an [issue](https://github.com/SujalDhiman/Smart-Bharat-Hackathon/issues) on our GitHub repository.
