
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

        const tasks = JSON.parse(data)

        res.render('home', { tasks: tasks})
    })
})

app.post('/add', (req, res) =>{
    const formData  = req.body

    if (formData.task.trim() == '') {
        fs.readFile('./data/tasks.json', (err, data)=>{
            if (err) throw err

            const tasks = JSON.parse(data)

            res.render('home', { error : true, tasks : tasks})
        })
    }else{
        fs.readFile('./data/tasks.json', (err, data) =>{
            if (err) throw err
            
            const tasks = JSON.parse(data)

            const task = {
                id: id(),
                task_description: formData.task,
                done: false 
            }

            tasks.push(task)

            fs.writeFile('./data/tasks.json', JSON.stringify(tasks), (err)=>{
                if (err) throw err

                fs.readFile('./data/tasks.json', (err, data)=>{
                    if (err) throw err

                    const tasks = JSON.parse(data)

                    res.render('home', { success : true, tasks : tasks})
                })
            })
        })
    }
})


app.listen(PORT, (err) => {
    if (err) throw err

    console.log(`This app is running on port ${PORT}`)
})


function id () {
    return '_' + Math.random().toString(36).substring(2, 9)
}
