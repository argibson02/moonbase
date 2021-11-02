const router = require('express').Router();
const { User, Post, Comment, Hype } = require('../../models');
const withAuth = require('../../utils/auth');

router.get('/', async (req, res) => {
    try {
        const userData = await User.findAll({
            include: [
                { model: Post },
                { model: Comment },
                { model: Hype }
            ]
        });

        res.status(200).json(userData);
    } catch (err) {
        res.status(500).json(err);
    }
})

router.get('/:id', async (req, res) => {
    try {
        const userData = await User.findByPk(req.params.id, {
            include: [
                { model: Post },
                { model: Comment },
                { model: Hype }
            ]
        });

        if (!userData) {
            res.status(404).json({ message: 'no user found with that id' });
            return;
        }

        res.status(200).json(userData);
    } catch (err) {
        res.status(500).json(err);
    }
});

router.post('/', async (req, res) => {
    try {
        const userData = await User.create(req.body);

        // req.session.save(() => {
        //     req.session.user_id = userData.id;
        //     req.session.logged_in = true;
        //     res.status(200).json(userData);
        // })
        res.status(200).json(userData); // need to replace this with above code when ready for FE
    } catch (err) {
        res.status(400).json(err);
    }
})

router.post('/login', async (req, res) => {
    try {
        const userData = await User.findOne({
            where: {
                email: req.body.email
            }
        });

        if (!userData) {
            res.status(400).json({ message: 'no user found with that email' })
        }

        const validPassword = await userData.checkPassword(req.body.password);

        if (!validPassword) {
            res.status(400).json({ message: 'incorrect password' })
        }

        // req.session.save(() => {
        //     req.session.user_id = userData.id;
        //     req.session.logged_in = true;
        //     res.status(200).json({ user: userData, message: 'user is now logged in' })
        // })

        res.status(200).json(userData); //need to replace this with above when ready for FE
    } catch (err) {
        res.status(400).json(err);
    }
})

router.post('/logout', (req, res) => {
    if (req.session.logged_in) {
        req.session.destroy(() => {
            res.status(204).end();
        })
    } else {
        res.status(404).end();
    }
})

router.put('/:id', withAuth, async (req, res) => {
    try {
        console.log(req.body)
        const updatedUser = await User.update(
            {
                ...req.body,
            },
            {
                where: {
                    id: req.params.id
                }
            }
        );

        if (updatedUser[0] === 0) {
            res.status(404).json({ message: 'unable to find user, or requested changes same as current' })
            return;
        }

        res.status(200).json(updatedUser);
    } catch (err) {
        res.status(500).json(err);
    }
})

router.delete('/:id', withAuth, async (req, res) => {
    try {
        const userData = await User.destroy({
            where: {
                id: req.params.id
            }
        })

        if (!userData) {
            res.status(404).json({ message: 'no user found with that id' })
            return;
        }

        res.status(200).json(userData);
    } catch (err) {
        res.status(500).json(err);
    }
})

module.exports = router;