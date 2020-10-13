const mongoose = require('mongoose');

const connect = () => {
    
    return new Promise((resolve, reject) => {
        if(process.env.NODE_ENV === 'test'){
            mongoose.connect("mongodb://localhost:27017/restodb?replicaSet=rs0&retryWrites=true&w=majority" )
                .then((res, err) => {
                if (err) return reject(err);
                resolve();
                }).catch(err => reject(err))
        }else{
            mongoose.connect(
                process.env.MONGODB_CONN_URL
                // "mongodb://localhost:27017/restodb?replicaSet=rs0&retryWrites=true&w=majority"
                )
                .then((res, err) => {
                    if(err) return reject(err);
                    resolve();
                }).catch(err => reject(err))
            }
    });
}

const close = () => {
    console.log("Closing connection");
    return mongoose.disconnect();
}

module.exports = {
    connect, close
}