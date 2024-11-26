import app from './src/app'
import { config } from './src/config/config';

import connectDb from './src/config/db';

const startServer=async()=>{

    await connectDb(); 
    const PORT = config.port || 3000;

    app.listen(PORT,()=>{
                console.log(`Server is Running on :${PORT}`)    
    })
}

startServer();