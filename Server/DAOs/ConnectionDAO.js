//singleton class to manage the connection to the database to mssql
const { text } = require('body-parser');
const sql = require('mssql');
require('dotenv').config();
//export default
class ConnectionDAO{

    constructor(){
        if (!ConnectionDAO.instance) {
            
            const config = {
                user: 'adminACS',//process.env.USER,
                password: "ProyectoACS2024",//process.env.PASSWORD,
                server: "proyecto-acs-2024.database.windows.net",//process.env.SERVER,
                database: "ProyectoDS52024",//process.env.DATABASE,
                pool: {
                    max: 10,
                    min: 0,
                    idleTimeoutMillis: 30000,
                },
                options: {
                    encrypt: true,
                    trustServerCertificate: true,
                    port: 1433 // <-- add your custom port here
                },
            };
            this.connection = new sql.ConnectionPool(config);
            this.connected = false;
            ConnectionDAO.instance = this;
        }
    }
    //method to connect to the database
    async connect(){
        try {
            if (!this.connected) {
                await this.connection.connect();
                this.connected = true;
                console.log('Connected to database');   
            }            
        } catch (error) {
            console.log('Error connecting to database: ', error);
        }
    }
    static async getInstance() {
        if (!ConnectionDAO.instance) {
            ConnectionDAO.instance = new ConnectionDAO();
        }
        return ConnectionDAO.instance;
    }

    //method to disconnect from the database
    static async disconnect(){
        try {
            if (this.connected) {
                await this.connection.close();
                this.connected = false;
                console.log('Disconnected from database');
            }
        } catch (error) {
            console.log('Error disconnecting from database: ', error);
        }
    }
    //method to execute a query to the database
    async executeQuery(query){
        try {
            if (this.connected) {
                const request = this.connection.request();
                const result = await request.query(query);
                return result.recordset;
            }
        } catch (error) {
            console.log('Error executing query: ', error);
            throw error;
        }
    }
    //method to execute a stored procedure to the database
    async executeProcedures(procedure, params){
        try {
            if (this.connected) {
                const request = this.connection.request();

                for (const key in params) {
                    if (params[key] !== undefined && params[key] !== null) {
                        // Revisamos si no es undefined y si es de salida
                        if (params[key]!==undefined && params[key].direction === "OUTPUT") {
                            request.output(key, sql.Int); 
                        } else {
                            request.input(key, params[key]);
                        }
                    } else {
                        // Define el tipo de datos por defecto, por ejemplo, sql.NVarChar
                        request.input(key, sql.DateTime, null);
                    }
                }
                const result = await request.execute(procedure);
                //handling database error if the outputCodeResult is 50000
                if (result.outputCodeResult === 50000) {
                    throw new Error('Error #50000');
                }
                return result.recordset;
            }
        } catch (error) {
            console.log('Error executing query: ', error);
            throw error;
        }
    }
}

module.exports = {ConnectionDAO};