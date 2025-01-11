# Football Online Manager - Server

## **Overview**

This repository contains the backend server for the Football Online Manager application, built using a microservices architecture with the MERN stack and TypeScript.

## **Services**

1. **Auth Service (`auth-service`):** Handles user authentication, registration, JWT token management, and email notifications.
2. **Team Service (`team-service`):** Manages team creation and player assignments.
3. **Transfer Service (`transfer-service`):** Manages the transfer market, including player listing and purchases.
4. **Shared Components (`shared`):** Contains shared middleware and utilities.

## **Setup Instructions**

### **Prerequisites**

- **Node.js:** v14 or higher
- **MongoDB:** Running locally or accessible via URI
- **Nginx:** (Optional) For reverse proxy setup

### **Clone the Repository**

```bash
git clone https://github.com/yourusername/football-online-manager-server.git
cd football-online-manager-server
```
