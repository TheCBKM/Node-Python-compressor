var fs = require('fs');
const { PythonShell } = require('python-shell')
var multer = require('multer');
var express = require("express");
var app = express();
app.use('/', express.static('public'))

files = []

var storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, './uploads');
    },
    filename: function (req, file, callback) {
        console.log(file.originalname.split('.')[file.originalname.split('.').length - 1])
        fname = `${Date.now()}.${file.originalname.split('.')[file.originalname.split('.').length - 1]}`
        console.log(fname)
        req.body.fname = fname
        callback(null, fname);
    }
});

let options = {
    mode: 'text',
    pythonPath: '/usr/bin/python3',
    pythonOptions: ['-u'],
    scriptPath: './',
    // args: ['www.jpe']
};



app.get('/compress/:id', (req, res) => {
    options.args = [req.params.id]
    var test = new PythonShell('./uploads/compress.py', options);
    test.on('message', (msg) => {
        res.send(msg)
    })
})

var upload = multer({ storage: storage }).single('file');

app.post('/upload', upload, function (req, res) {
    options.args = [req.body.fname]
    console.log(req.body.fname)
    files.push(req.body.fname)
    var test = new PythonShell('./uploads/compress.py', options);
    test.on('message', (msg) => {
        if (msg == "Done")
            res.download(`uploads/${req.body.fname}`);
        else
            res.json("not done")

    })

});

app.get('/deleteAll', (req, res) => {
    files.map(f => {
        var filePath = `uploads/${f}`;
        fs.unlinkSync(filePath);
    })
    res.send("all deleted successfully")

})
app.listen(process.env.PORT || 3000, function () {
    console.log("Server is running on port 3000");
});  