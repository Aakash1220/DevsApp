const express = require('express');
const router = express.Router();
const gravator = require('gravatar');
const bcrypt = require('bcryptjs');
const { check, validationResult } = require("express-validator");

const { validate } = require('../modals/User');
const User = require('../modals/User')
router.post('/', [
    check('name', 'Name is Required').notEmpty(),
    check('email', 'Enter valid Email').isEmail(),
    check('password', 'Enter minimum 6 character').isLength({ min: 6 })
],
    async (req, res) => {
        console.log(req.body);
        const error = validationResult(req);
        if (!error.isEmpty()) {
            return res.status(400).json({ error: error.array() });
        }
        const { email, password, name } = req.body;
        console.log("mail:",email);
        try {
           let user = await User.findOne({ email });

            if (user) {
               return res.status(400).json({ error: [{ msg: 'User already exits' }] })
            }
            const avatar = gravator.url(email, {
                s: '200',
                r: 'pg',
                d: 'mm'
            })
            console.log("avatar: ",avatar);
            user = new User({
                name, password, email, avatar
            })
            const salt = await bcrypt.genSalt(10);

            user.password = await bcrypt.hash(password, salt)
            await user.save()
            res.send('User Registered')

        }
        catch (err) {
            console.log(err.message);
            res.status(500).send('Server Error')
        }
    });
module.exports = router;