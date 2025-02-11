import mongoose from 'mongoose';

const dbURI = 'mongodb+srv://wave3jb1:7HLLLshcUZpF2Ij5@cluster0.6nfzb.mongodb.net/Farmers?retryWrites=true&w=majority&appName=Cluster0';

mongoose
 .connect(dbURI)
 .then(() => console.log("Database connected!"))
 .catch(err => console.log(err));
    
