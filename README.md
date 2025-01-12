# HopeBridge

<img src="https://github.com/Adnan-Shahriar-1190/Todo-App/blob/main/logo2.png" alt="Image Description" width="500" height="200" />

## Team Members:

| Name                     | ID          | Email                        | Role       |
|--------------------------|-------------|------------------------------|------------|
| Shuhrid Abrar            | 20220104028 | shuhridabrar2016@gmail.com   | Lead       |
| Zubaer Mahmud Shihab    | 20220104030 | zubaer.mahmud31@gmail.com    | Backend    |
| Adnan Shahriar Bhuiyan  | 20220104036 | sb.adnan2020@gmail.com       | Backend    |
| Mahadir Rahman          | 20220104046 | mahadirmrh04@gmail.com       | Frontend   |

## Project Overview:

### Project Title: HopeBridge

### Objective:
HopeBridge strives to unite affected individuals, donors, volunteers, medical professionals and many more to assist communities impacted by disasters in Bangladesh. This platform simplifies donation management, facilitates volunteer coordination, and ensures efficient access to medical and emergency assistance for those in need.

### Target Audience:

- **Affected Individuals:** People directly affected by disasters who need medical aid, food, and other resources.
- **Volunteers:** People offering their time, skills, or services to assist in disaster response and recovery.
- **Medical Professionals:** Doctors, nurses, and healthcare providers willing to volunteer their services in emergency situations.
- **Donors:** Individuals or organizations looking to contribute financially or in-kind to disaster relief efforts.
- **Non-Governmental Organizations (NGOs):** Organizations involved in disaster relief and recovery efforts that can benefit from coordinated resources.
- **General Public:** Individuals who wish to stay informed or participate in disaster management and relief efforts.

### Tech Stack:

- **Frontend:** React
- **Backend:** Laravel
- **Rendering Method:** Client Side Rendering

## User Interface:

Demo Figma UI: [**Figma Link**](https://www.figma.com/design/VGfJWjiebvbJB0Nst4b4ry/Untitled?node-id=0-1&t=im0md9XhzEdzbAZZ-1)

---

## Key Features:

### **1. Disaster Reporting:**
- Allows users to report disasters with details such as type, location, severity, and impacted areas.
- Includes an interactive map to mark disaster locations for better visualization.
- Provides an option to attach photos or videos for verification.

### **2. Resource Locator:**
- Enables users to search for nearby shelters, supplies, and blood donors using location-based filters.
- Displays real-time availability of resources with contact details for coordination.
- Offers directions and estimated distances to nearby shelters or relief centers.

### **3. Disaster Logs and Briefings:**
- Maintains a detailed log of past and ongoing disasters, categorized by type and location.
- Provides real-time briefings for selected disasters, including updates, government responses, and relief progress.
- Offers downloadable reports and analytics for organizations and authorities.

### **4. Education and Preparedness:**
- Hosts news articles, videos, and guides on disaster preparedness and survival tips.
- Features categorized resources for specific disasters (e.g., floods, earthquakes, fires).
- Includes a step-by-step guide to building survival kits and emergency plans.

### **5. Donor Management:**
- Enables users to make financial donations or donate goods for disaster relief.
- Tracks and manages large donations for allocation to affected areas.
- Provides a secure donation process with multiple payment options (e.g., credit card, bank transfer, UPI).

### **6. User Profile Management:**
- Allows users to manage their personal profiles, including donation history, saved locations, and disaster reports.
- Users can update their contact details, skills, and preferences for alerts and notifications.
- Displays user-specific activity, such as recent searches or submitted reports.

### **7. Donation Page:**
- Combines options for financial aid, goods donations, and blood donations in one place.
- Offers a user-friendly interface with categorized donation options.
- Tracks contributions and provides transparency on how funds and resources are allocated.

---
# API Endpoints

### **1. User Management:**
- **POST /register** - Register a new user (volunteer, donor, medical professional, etc.)  
- **POST /login** - Login an existing user and return authentication token  
- **GET /profile** - Get the profile of the logged-in user  
- **PUT /profile** - Update user profile details (name, contact, preferences, etc.)  

### **2. Donation Management:**
- **GET /donations** - Get a list of all donations made  
- **POST /donations** - Create a new donation (financial or goods)  
- **GET /donor-history/{userId}** - Get a specific user's donation history  
- **POST /donor-history** - Record and track donation history (financial or goods)  

### **3. Volunteer Management:**
- **GET /volunteers** - Get a list of all available volunteers  
- **POST /volunteers** - Register a new volunteer  
- **GET /medical-volunteers** - Get a list of all available medical volunteers  
- **POST /medical-volunteers** - Register medical professionals for volunteering  

### **4. Disaster Management:**
- **POST /disasters** - Report a new disaster with location, severity, and impact details  
- **GET /disasters** - Get a list of all reported disasters  
- **GET /disasters/{id}** - Get details of a specific disaster  
- **GET /alerts** - Get a list of all active disaster alerts  
- **POST /alerts** - Create a new alert for urgent disaster response needs  

### **5. Resource Management:**
- **POST /resources** - Add new resources (blood donations, supplies) available for disaster relief  
- **GET /resources** - Get a list of available resources (blood, food, medical supplies)  
- **GET /resources/{type}** - Filter available resources by type (e.g., blood, food, water, medical)  

### **6. Shelter Management:**
- **POST /shelters** - Add a new shelter for disaster relief  
- **GET /shelters/{id}** - Get details of a specific shelter  
- **GET /shelter** - Get a list of all shelters available for disaster victims  

### **7. Feedback and Support:**
- **POST /feedback** - Submit feedback or suggestions regarding disaster relief operations  
- **GET /feedback** - Get all user feedback and suggestions  

### **8. Emergency and Contact Management:**
- **POST /emergency-contact** - Create an emergency contact for volunteers or disaster relief workers  
- **GET /emergency-contact** - Get emergency contact details for users  

---

## Checkpoints:

### **Checkpoint 1:**
- Project initialization with Laravel backend and React frontend.
- User authentication implementation.
- Database setup.

### **Checkpoint 2:**
- Implement Safeguard feature which contains 2 sections based on User Education and Preparedness.
- Implement Relief Network feature which facilitates Financial, Blood and Goods Donation
- Add CRUD operations for necessary fields like volunteers and donor management,news etc.

### **Checkpoint 3:**
- Integrate Disaster alerts and Disaster reporting features.
- Implement donor and resource management features.
- Test all features thoroughly.
