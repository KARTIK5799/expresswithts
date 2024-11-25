import app from './src/app'
import { config } from './src/config.ts/config';

const startServer=()=>{
    const PORT = config.port || 3000;

    app.listen(PORT,()=>{
                console.log(`Server is Running on :${PORT}`)    
    })
}

startServer();