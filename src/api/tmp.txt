const supertest = require('supertest')
const server = require('./server')



describe('/api/login', ()=>{
    describe('Given A Username and Password', () =>{
        //Query username and password
        //Return UserID
        //Return 200 code
        test("Returns 200 status code", async() =>{
            const response = await request(app).post("/api/login").send({
                username: "username",
                password: "password"
            })
        })
    })
    describe('Missing Username or Password', () =>{
        //Return code 400
    })
})