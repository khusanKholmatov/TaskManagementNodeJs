
// third party libs
const express = require('express')
const app = express()

// node libs
const fs = require('fs')
const PORT = 8000

app.set('view engine', 'pug')
// assets
app.use('/static', express.static('public'))
app.use(express.urlencoded({extended:false}))

// http://localhost:8000
app.get('/', (req, res) => {
    fs.readFile('./data/tasks.json', (err, data)=>{
        if (err) throw err

        const allTasks = JSON.parse(data)
        const tasks = allTasks.filter(task => !task.done)
        const compTasks = allTasks.filter(task => task.done)
        res.render('home', { error : true, tasks : tasks, compTasks : compTasks})
    })
})

app.post('/add', (req, res) =>{
    const formData  = req.body

    if (formData.task.trim() == '' || formData.taskDesc.trim() == '') {
        fs.readFile('./data/tasks.json', (err, data)=>{
            if (err) throw err

            const allTasks = JSON.parse(data)
            const tasks = allTasks.filter(task => !task.done)
            const compTasks = allTasks.filter(task => task.done)
            res.render('home', { error : true, tasks : tasks, compTasks : compTasks})
        })
    }else{
        fs.readFile('./data/tasks.json', (err, data) =>{
            if (err) throw err
            
            const tasks = JSON.parse(data)

            const task = {
                id: id(),
                task_title: formData.task,
                task_description: formData.taskDesc,
                done: false 
            }

            tasks.push(task)

            fs.writeFile('./data/tasks.json', JSON.stringify(tasks), (err)=>{
                if (err) throw err

                fs.readFile('./data/tasks.json', (err, data)=>{
                    if (err) throw err

                    const allTasks = JSON.parse(data)
                    const tasks = allTasks.filter(task => !task.done)
                    const compTasks = allTasks.filter(task => task.done)
                    res.render('home', { success : true, tasks : tasks, compTasks : compTasks})
                })
            })
        })
    }
})

app.get('/:id/delete', (req, res) => {
    const id = req.params.id

    fs.readFile('./data/tasks.json', (err, data) => {
        if (err) throw err

        const allTasks = JSON.parse(data)

        const filteredTasks = allTasks.filter(task => task.id != id)

        fs.writeFile('./data/tasks.json', JSON.stringify(filteredTasks), (err) => {
            if (err) throw err
            
            const tasks = filteredTasks.filter(task => !task.done)
            const compTasks = filteredTasks.filter(task => task.done)

            res.render('home', { deleted : true, tasks : tasks, compTasks : compTasks})
        })
    })
})

app.get('/:id/update', (req, res) => {
    const id = req.params.id

    fs.readFile('./data/tasks.json', (err, data) => {
        if (err) throw err

        const allTasks = JSON.parse(data)
        const task = allTasks.filter(task => task.id == id)[0]

        const taskIdX = allTasks.indexOf(task)
        const splicedTask = allTasks.splice(taskIdX, 1)[0]

        splicedTask.done = !splicedTask.done

        allTasks.push(splicedTask)

        fs.writeFile('./data/tasks.json', JSON.stringify(allTasks), (err) => {
            if (err) throw err
            
            const tasks = allTasks.filter(task => !task.done)
            const compTasks = allTasks.filter(task => task.done)
            res.render('home', { success : true, tasks : tasks, compTasks : compTasks})
        })
    })
})

app.get('/clearAll', (req, res) => {
    fs.readFile('./data/tasks.json', (err, data) => {
        if (err) throw err

        const allTasks = JSON.parse(data)

        const filteredTasks = allTasks.filter(task => !task.done)

        fs.writeFile('./data/tasks.json', JSON.stringify(filteredTasks), (err) => {
            if (err) throw err
            
            const tasks = filteredTasks.filter(task => !task.done)
            const compTasks = filteredTasks.filter(task => task.done)

            res.render('home', { deleted : true, tasks : tasks, compTasks : compTasks})
        })
    })
})


app.listen(PORT, (err) => {
    if (err) throw err

    console.log(`This app is running on port ${PORT}`)
})


function id () {
    return '_' + Math.random().toString(36).substring(2, 9)
}
