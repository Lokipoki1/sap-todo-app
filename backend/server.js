import express from 'express';
import cors from 'cors';
import path from 'path';

const app = express();
const PORT = 5000;

//Middleware 
app.use(cors());
app.use(express.json());

//In-Memory Storage
let todos =  [];
let idCounter = 1;

const __dirname = path.resolve();

app.get("/todos", (req,res) => {
    const allTodos = todos;
    res.status(201).json({success:true, data: allTodos});
});

app.get("/todos/:id", (req, res) => {
    const { id } = req.params;
    const todo = todos.find(todo => todo.id === parseInt(id));
    if (!todo) {
        return res.status(404).json({success: false, message: "Todo not found"});
    }

    res.status(201).json({success:true, data: todo});
});

app.post("/todos", (req,res) => {
    const {title, description} = req.body;
    const newTodo = {
         id: idCounter++, 
         title, 
         description, 
         isCompleted: false, 
         createdAt: new Date() 
        };
    todos.push(newTodo);
    res.status(201).json({success:true, data:newTodo});
});

app.put("/todos/:id", (req,res) => {
    const { id } = req.params;
    const { title } = req.body;
    const { isCompleted } = req.body;
    const { description } = req.body;
    const todo = todos.find(todo => todo.id === parseInt(id));
    if (!todo) {
        return res.status(404).json({success: false, message: "Todo not found"});
    }
    todo.title = title;
    todo.isCompleted = isCompleted;
    todo.description = description;

    res.status(201).json({success: true, message: "Todo was updated", data: todo});
});

app.delete("/todos/:id", (req,res) => {
    const { id } = req.params;
    todos = todos.filter(todo => todo.id !==  parseInt(id));
    res.status(201).json({success: true, message: "Todo deleted"});
});

if( process.env.NODE_ENV === "production"){
    app.use(express.static(path.join(__dirname, "/frontend/build")));

    app.get("*", (req, res) => {
        res.sendFile(path.resolve(__dirname, "/frontend/build", "index.html"));
    });
};



app.listen(PORT, () => {
    console.log(`Server started at http://localhost:${PORT}`);
  });