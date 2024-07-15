// src/auth/interfaces/user.interface.ts

export interface User {
    userId: string; // Assuming userId is a unique identifier for the user
    username: string;
    password: string; // This should be hashed and stored securely
    role: 'admin' | 'user'; // Adjust roles as per your application's requirements
}
