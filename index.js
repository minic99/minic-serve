const express = require('express');
const SubmitVerifier = require('submit-verifier');
const fs = require('fs')
const path = require('path')
class Server {
  constructor(options) {
    this.app = express()
    this.port = options.port
    this.router = express.Router()
    this.app.use(express.json())
    this.app.use(express.urlencoded({ extended: true }))
    this.app.use((req, res, next) => {
      const log = `${new Date().toISOString()} ${req.method} ${req.url}`
      fs.appendFile(path.join(__dirname, "access.log"), log + "\n", (err) => {
        if (err) console.error(err)
      })
      next()
    })
    this.app.use((error, req, res, next) => {
      const { status = 500, message = "Internal Server Error" } = error
      res.status(status).json({ code: status, message, data: null })
    })
    options.registerRoutes(this.app, this.router);
    this.app.listen(port, () => {
      console.log(`Express server running on http://localhost:${port}`)
    })
    this.submitVerifier = new SubmitVerifier()
  }
}

export default Server
