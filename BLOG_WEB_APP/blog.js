var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser')
var session = require('express-session');

router.use(bodyParser.urlencoded({
    extended: true
}));
router.use(bodyParser.json());

router.use(cookieParser());
router.use(session({
    secret: 'shh, its a secret!',

}));


var mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1/blog_app')

/* Schemea => user | blog | manager | topic */


/* userSchema */
var userSchema = mongoose.Schema({
    sp_id: String,
    sp_password: String
})
var user = mongoose.model("user", userSchema);

/* blogSchema */
var blogSchema = mongoose.Schema({
    title: String,
    description: String,
    content: String,
    topics: String,
    approved: Number,
    userid: String
})
var blog = mongoose.model("blog", blogSchema);

/* managerSchema */
var managerSchema = mongoose.Schema({
    name: String,
    password: String,
    topics: String
})
var manager = mongoose.model("manager", managerSchema)

/* topicSchema */
var topicSchema = mongoose.Schema({
    name: String
})
var topic = mongoose.model("topic", topicSchema)


/* get routes*/

/*home get route*/
router.get('/', function(req, res) {
   
    blog.find().sort({
            _id: -1
        })
        .then(blogs => {
            res.render('home/homepage', {
                blogs: blog,
                blogs: blogs
            });
        })
})

/*user get route*/
router.get('/user/signup', function(req, res) {
    res.render('user/signup');
});

router.get('/user/login', function(req, res) {
    res.render('user/login');
});

router.get('/user/updateBlog', function(req, res) {
    res.render('user/updateBlog');
})

router.get('/user/manageBlogs', function(req, res) {

    blog.find({
            userid: req.session.user
        })
        .then(blogs => {
            res.render('user/manageBlogs', {
                blog: blogs,
                blogs: blogs
            });
        });
});


router.get('/approved', function(req, res) {

    blog.find({
            userid: req.session.user
        })
        .then(blogs => {

            res.render('manager/approved', {
                blog: blogs,
                blogs: blogs
            });
        });
});
router.get('/manager/pending', function(req, res) {

    blog.find({
            userid: req.session.user
        })
        .then(blogs => {

            res.render('manager/pending', {
                blog: blogs,
                blogs: blogs
            });
        });
});

router.get('/manager/approved', function(req, res) {

    blog.find({
            userid: req.session.user
        })
        .then(blogs => {

            res.render('manager/approved', {
                blog: blogs,
                blogs: blogs
            });
        });
});


router.get('/pending', function(req, res) {

    blog.find({
            userid: req.session.user
        })
        .then(blogs => {
            res.render('manager/pending', {
                blog: blogs,
                blogs: blogs
            });
        });
});

router.get('/user/updateBlog/:id', (req, res) => {
    blog.findById(req.params.id)
        .then(response => {
            res.render('user/updateBlog', {
                blog: response,
            });
        })
        .catch(error => {
            console.log(error);
            res.status(500).json({
                error: 'An error occurred'
            });
        });
});

router.get('/delete/:id', (req, res) => {
    blog.findByIdAndRemove(req.params.id)
        .then(response => {
            res.send('<script>alert("Blog deleted"); window.location.href = "/user/manageBlogs";</script>');

        })
        .catch(error => {
            console.log(error);
            res.status(500).json({
                error: 'An error occurred'
            });
        });
});


router.get('/user/blogContent/:id', (req, res) => {
    var blogId = req.params.id;
    blog.findById(blogId)
        .then(response => {
            res.render('user/blogContent', {
                blog: [response]
            });
        })
        .catch(error => {
            console.log(error);
            res.status(500).send('Internal Server Error');
        });
});




router.get('/manager/blogContent/:id', (req, res) => {
    var blogId = req.params.id;
    blog.findById(blogId)
        .then(response => {
            res.render('manager/blogContent', {
                blog: [response]
            });
        })
        .catch(error => {
            console.log(error);
            res.status(500).send('Internal Server Error');
        });
});

router.get('/home/blogContent/:id', (req, res) => {
    var blogId = req.params.id;
    blog.findById(blogId)
        .then(response => {
            res.render('home/blogContent', {
                blog: [response]
            });
        })
        .catch(error => {
            console.log(error);
            res.status(500).send('Internal Server Error');
        });
});


router.get('/user/createBlog', function(req, res) {

    topic.find()
        .then(topics => {
            res.render('user/createBlog', {
                topics: topic,
                topics: topics
            });

        })



})

/*admin get routes */

router.get('/admin/login', function(req, res) {
    res.render('admin/login');
})

router.get('/admin/manageTopic', function(req, res) {
    topic.find()
        .then(topics => {
            res.render('admin/manageTopic', {
                topics: topic,
                topics: topics
            });

        })
})

router.get('/addTopic', function(req, res) {
    res.render('admin/addTopic');
})
router.get('/admin/addTopic', function(req, res) {
    res.render('admin/addTopic');
})

router.get('/admin/addManager', function(req, res) {
    topic.find()
        .then(topics => {
            res.render('admin/addManager', {
                topics: topic,
                topics: topics
            });

        })

});

router.get('/admin/home', (req, res) => {
    res.render('admin/home')
})
router.get('/admin/manageManager', (req, res) => {
    manager.find()
        .then(managers => {
            res.render('admin/manageManager', {
                manager: managers,
                managers: managers
            });

        })
})

router.get('/admin/delete_topic/:id', (req, res) => {
    topic.findByIdAndRemove(req.params.id)
        .then(response => {
            res.redirect('/admin/manageTopic');

        })
        .catch(error => {
            console.log(error);
            res.status(500).json({
                error: 'An error occurred'
            });
        });
});
router.get('/delete_topic/:id', (req, res) => {
    topic.findByIdAndRemove(req.params.id)
        .then(response => {
            // res.redirect('/admin/manageTopic');
            res.send('<script>alert("Deleted"); window.location.href = "/admin/manageTopic' + '";</script>');

        })
        .catch(error => {
            console.log(error);
            res.status(500).json({
                error: 'An error occurred'
            });
        });
});

router.get('/admin/deleteManager/:id', (req, res) => {
    manager.findByIdAndRemove(req.params.id)
        .then(response => {
            // res.redirect('/admin/manageManager')
            res.send('<script>alert("Blog deleted"); window.location.href = "/admin/manageManager";</script>');

        })
        .catch(error => {
            console.log(error);
            res.status(500).json({
                error: 'An error occurred'
            });
        });

})
router.get('/logout_admin', (req, res) => {

  req.session.destroy(function(){
    console.log("admin logged out.")
 });
 res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
 res.redirect('/');
})


/*manager get routes */
router.get('/manager/login', function(req, res) {
    res.render('manager/login');
})


router.get('/manager/home', (req, res) => {
    res.render('manager/home');
})

/*logout get routes */
router.get('/logout', (req, res) => {
  req.session.destroy(function(){
    console.log("user logged out.")
 });
 res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
 res.redirect('/');
});

/*unlist get routes */
router.get('/unlist_blog/:id', (req, res) => {

    blog.findByIdAndUpdate(req.params.id, {
            approved: 0
        })

        .then(response => {
            // return res.render('message/show_message',{message:'UN Listed '});
            res.send('<script>alert("UnList"); window.location.href = "/manager/approved?blog=' + '";</script>');

        })
});
/*approve get routes */

router.get('/approve_blog/:id', (req, res) => {

    blog.findByIdAndUpdate(req.params.id, {
            approved: 1
        })


        .then(response => {
            res.send('<script>alert("Approved"); window.location.href = "/manager/pending?blog=' + '";</script>');

        })

});


/*admin post routes */


router.post('/addTopic', (req, res) => {
    if (!req.body.name) {
        res.render('message/show_message', {
            message: "Please provide all the details"
        });
    } else {

        var newTopic = new topic({
            name: req.body.name
        });

        newTopic.save()
        res.send('<script>alert("Topic Added!"); window.location.href = "/admin/manageTopic";</script>');

        // res.redirect('admin/manageTopic');
    }
});
router.post('/admin/addTopic', (req, res) => {
    if (!req.body.name) {
        res.render('message/show_message', {
            message: "Please provide all the details"
        });
    } else {

        var newTopic = new topic({
            name: req.body.name
        });

        newTopic.save()
        res.redirect('admin/manageTopic');
    }
});


router.post('/admin/login', (req, res) => {
    if (req.body.username == 'admin' && req.body.password == 'admin') {

        res.render('admin/home');
    } else {
        res.send('<script>alert("Login Error!"); window.location.href = "/admin/login";</script>');

    }

})



/* user post route*/

router.post('/user/login', async (req, res) => {
    const {
        sp_id,
        sp_password
    } = req.body;

    if (!sp_id || !sp_password) {
        return res.send('<script>alert("Please fill all the details"); window.location.href = "/user/login";</script>');

    }

    user.findOne({
            sp_id: req.body.sp_id
        })
        .then(user => {
            if (!user) {
                return res.send('<script>alert("User not registered. Redirecting to Signup page"); window.location.href = "/user/signup";</script>');
            }
            if (user.sp_id == user.sp_id && user.sp_password === req.body.sp_password) {
                req.session.user;

                blog.find().sort({
                        _id: -1
                    })
                    .then(blogs => {
                        res.render('user/home', {
                            blogs: blogs,
                            name: req.session.user
                        });
                    });
            } else {
                return res.send('<script>alert("Incorrect Password"); window.location.href = "/user/login";</script>');

            }
        })
        .catch(error => {
            console.error('Error during login:', error);
            res.status(500).send('Internal Server Error');
        });
});

//create blog route

router.post('/createblog', function(req, res) {
    if (!req.body.title || !req.body.description) {
        res.render('message/show_message', {
            message: "Please provide all the details"
        });
    } else {
        var newBlog = new blog({
            title: req.body.title,
            description: req.body.description,
            content: req.body.content,
            topics: req.body.topics,
            approved: 0,
            userid: req.session.user
        });

        newBlog.save()
            .then(savedBlog => {
                blog.find().sort({
                        _id: -1
                    })
                    .then(blogs => {
                        res.render('user/home', {
                            blog: savedBlog,
                            blogs: blogs
                        });
                    })
            })
    }
});


router.post('/edit-blog/:id', (req, res) => {

    var blogs = req.body;

    if (!blogs.title || !blogs.description) {
        res.render('message/show_message', {
            message: "Sorry, you provided wrong info",
            type: "error"
        });
    } else {


        blog.findByIdAndUpdate(req.params.id, {
                title: req.body.title,
                description: req.body.description,
                content: req.body.content,
                topics: req.body.topics
            })
            .then(response => {
                res.redirect('/user/manageBlogs');
            })
            .catch(error => {
                console.log(error);
                res.status(500).json({
                    error: 'An error occurred'
                });
            });
    }
});


//signup route
router.post('/user/signup', async function(req, res) {
    if (!req.body.sp_id || !req.body.sp_password) {
        return res.send('<script>alert("Please fill all the details"); window.location.href = "/user/signup";</script>');
    } else {
        try {
            const check = await user.findOne({
                sp_id: req.body.sp_id
            })

            if (check.sp_id === req.body.sp_id) {

                return res.send('<script>alert("Already registered. Redirecting to login page"); window.location.href = "/user/login";</script>');
            }

        } catch (e) {


            if (req.body.sp_password != req.body.cp_password) {
                return res.send('<script>alert("password not match"); window.location.href = "/user/signup";</script>');


            } else {
                var newUser = new user({
                    sp_id: req.body.sp_id,
                    sp_password: req.body.sp_password,
                });

                newUser.save()
                return res.send('<script>alert("Registered successfully. Redirecting to login page"); window.location.href = "/user/login";</script>');

            }
        }
    }
});

/*manager post routes */

router.post('/create_manager', function(req, res) {
    if (!req.body.name || !req.body.password || !req.body.topics) {
        res.render('message/show_message', {
            message: "Please provide all the details"
        });
    } else {
        var newManager = new manager({
            name: req.body.name,
            password: req.body.password,
            topics: req.body.topics
        });

        newManager.save()
        res.send('<script>alert("Manager Added"); window.location.href = "/admin/manageManager";</script>');

        // res.redirect('admin/manageManager');
    }
})
router.post('/manager/login', async (req, res) => {
    const {
        name,
        password
    } = req.body;

    if (!name || !password) {
        return res.send('<script>alert("Please fill all the details"); window.location.href = "/manager/login";</script>');
    }

    try {
        const check = await manager.findOne({
            name: req.body.name
        });
        if (check && check.password === req.body.password) {
            req.session.manager = check;

            blog.find({
                    topics: req.session.manager.topics
                })
                .then(blogs => {
                    res.render('manager/pending', {
                        blog: blogs,
                        blogs: blogs,
                        name: req.body.name
                    });
                });
        } else {
            return res.send('<script>alert("Incorrect Password"); window.location.href = "/manager/login";</script>');
        }
    } catch (e) {
        return res.send('<script>alert("User not registered"); window.location.href = "/manager/login";</script>');
    }
});

module.exports = router;