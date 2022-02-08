const express = require('express')
const services = require('./services')
const router = express.Router();
const User = require('./models/user')

router.get('/',async(req,res)=>{
    try {
        const result = await User.find({});
        res.status(200).send(result);
    } catch (e) {
        res.status(500).send(e.message);
    }
})

router.post('/login', async function (req, res) {
    try {
        const result = await services.loginUser(req.body);
        res.status(200).send(result);
    } catch (e) {
        res.status(500).send(e.message);
    }
})
router.post('/createuser', async function (req, res) {
    try {
        const result = await services.createUser(req.body);
        res.status(200).send(result);
    } catch (e) {
        res.status(500).send(e.message);
    }
})

module.exports = router