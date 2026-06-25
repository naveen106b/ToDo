//Access the schema or model for data operation 
import todo from "../model/todo.js";

//create todo function
export const addTodo = async (req,res)=>{
    try{
        await todo.create(req.body)
        res.status(201).json({message: "task create"})
    } catch(error){
        console.error('error',error)
        res.status(400).json({message:error.message})
    }
}
// to fetch all task
export const getAllTask = async (req,res)=>{
    const tasks = await todo.find()
    res.status(200).json(tasks)

}

//to delete task by ID
export const deleteTask = async (req,res)=>{
    try{
        const {id}= req.params
        const deleteTask = await todo.findByIdAndDelete(id)
        res.status(200).json(deleteTask)

    } catch(error){
        console.error(error)
        res.status(400).json({message:error.message})
    }
}
// crate function for update tasks by id

export const updteTask = async(req,res)=>{
    try{
        const {id}= req.params
        const updateTask = await todo.findByIdAndUpdate(id,req.body,{new:true})
        res.status(200).json(updateTask)

    } catch(error){
        console.error(error)
        res.status(400).json({message:error.message})
    }

}
