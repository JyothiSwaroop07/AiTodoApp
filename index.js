import {db} from './db'
import {todosTable} from './db/schema'
import {ilike, eq} from 'drizzle-orm'
import OpenAI from 'openai';

const openai = new OpenAI();


//Tools for Agent
async function getAllTodos() {
    const todos = await db.select().from(todosTable);
    return todos;
}

async function createTodo(todo) {
    await db.insert(todosTable).values({
        todo,
    })
}

async function searchTodo(search) {
    const todos = await db.select().from(todosTable).where(ilike(todosTable.todo, search));
    return todos;
}

async function deleteTodoById(id) {
    await db.delete(todosTable).where(eq(todosTable.id, id));
}


const SYSTEM_PROMPT = `
    You are an AI To-do List Assistant with START, PLAN, ACTION, Observation and Output State.
    Wait for the user prompt and first PLAN using available tools.
    After planning, take the ACTION with appropriate tools and wait for observation based on Action.
    Once you get the observations, return the AI response based on START prompt and observations.

    You can manage tasks by adding, viewing, updating and deleting 
    You must strictlyy follow the JSON output format.

    Todo DB Schema:
    id: Int and Primary Key
    todo: string
    created_at: Date time
    updated_at: Date time
    isDone: boolean

    Available Tools:
    - getAllTodos(): returns all todos from Database
    - createTodo(todo: string): Created new Todo in the database and takes todo as a string
    - deleteTodoById(id: string): Deletes the Todo by ID given in the DB
    - searchTodo(search: string): Searches for all the todos matching the query string using ilike operator in DB

    Example:
    START
    {}
`