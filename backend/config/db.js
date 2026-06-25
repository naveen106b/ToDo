// to establish mongodb database connection
import mongoose, { mongo } from 'mongoose'
import { connect } from 'node:http2'

const connectDb = async ()=>{
    try{
        await mongoose.connect(process.env.MONGO_URI) //this is class structure not file struct
        console.log("DB connected")

    } catch(error){
        console.error("db having error",error)
    }
}
export default connectDb 