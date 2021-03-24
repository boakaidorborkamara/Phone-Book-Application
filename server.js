const http = require("http");
const fs = require("fs");
// const { Database } = require("sqlite3");
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./phoneBook', (err)=>{
    if(err){
        console.log(err.message);
    }
    console.log('Connected to PhoneBook Database');
});

// TODO 1
function createTable(){
    /**
     * Create a table called contacts with the following columns:
     *     a. id (the datatype should be int and also set as the primary key)
     *     b. name (the datatype should be varchar) and
     *     c. contact (the datatype should be varchar)
     */
    db.run(`CREATE TABLE IF NOT EXISTS contacts(id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,name varchar,contact varchar);`,(err)=>{
        if(err){
            console.log(err);
        }
    });
   

}
createTable();

const server = http.createServer((req, res) => {
    let url = req.url;
    let method = req.method;
    

    if (url === "/" && method === "GET"){
        fs.readFile("./contacts.html", "utf8", (err, data) => {
            res.end(data);
        })
    } else if (url === "/contact/create" && method === "GET"){
        fs.readFile("./create-contact.html", "utf8", (err, data) => {
            res.end(data);
        })
    } else if (url === "/create" && method === "POST"){
        // TODO 2

        /**
         * Get the data from the front-end and store it in the contacts table
         */
        let body = "";
        req.on('data', (data) =>{
            body += data;


        }) ;
        req.on('end', () =>{
            let front_data = JSON.parse(body);
            db.all(`INSERT INTO contacts( name, contact) VALUES(?,?)`, front_data.name,front_data.contact, (err, result)=>{
                if(err){
                    console.log(err);
                    res.end(JSON.stringify({status:1,status_message:"Error! Contact was not created!"}))

                }
                console.log('Data inserted successfuly');
                res.end(JSON.stringify({status:0,status_message:"Contact Sucessfully Created,OK to view contact"}))

            })
        })

    } else if (url === "/contacts" && method === "GET"){
        // TODO 3

        /**
         * Query the contacts table, get the data and send it to the user 
         */
        db.all(`SELECT * FROM contacts;`,(err, rows)=>{
            if(err) throw err;
            
                res.end(JSON.stringify({rows}));
                console.log('Data sent successfully')
            
        })
    } else {
        res.end("404");
    }
})

server.listen(3800, () => {
    console.log("Server is listening on port 3800");
})