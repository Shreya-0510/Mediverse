import express from 'express';
import connectDb from './config/db.js';
import dotenv from 'dotenv';
import patientRoutes from "./routes/patient.routes.js";
import doctorRoutes from "./routes/doctor.routes.js"; 
import queueRoutes from "./routes/queue.routes.js";   

dotenv.config();

const port = 8000;

const app = express();

// Middlewares
app.use(express.json());

// Routes
app.use("/api/patients", patientRoutes);
app.use("/api/doctors", doctorRoutes);
app.use("/api/queue", queueRoutes); 

// Start Server
const startServer = async () => {
    try {
        await connectDb();
        app.listen(port, () => {
            console.log(`Server is listening on Port ${port}`);
        });
    } catch (error) {
        console.log(error);
    }   
}

startServer();

