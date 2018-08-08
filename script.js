((window, $, api, utils) => {
    const URL = 'https://girls-who-code-metlife.herokuapp.com/api';
    //When the page loads, run this code
    $(document).ready(() => {
      // templates
      let loginTpl = utils.getTemplate('#login-tpl');
      let welcomeTpl = utils.getTemplate('#welcome-tpl');
      let usersTpl = utils.getTemplate('#users-tpl');
      let newsfeedTpl = utils.getTemplate('#feed-tpl');
  
      // main container
      let main = $('#root-container');
      let banner = $('#banner');
      let userList = $('#users-list-container');
      let newsFeed = $('#newsfeed-container');
  
      //Data
      let _user = null;
      let _usersData = {};
      let _loginMessage = '';
  
  
      // check if logged in
      api.get(URL + '/me').then((user) => {
        //We're logged in, show the main page
        //store user
        _user = user.user;
        
        //load the banner
        banner.html(welcomeTpl(_user));
        //load the news feed
        refreshFeed();
        //load the list of users
        refreshUsers();
      }, () => {
        //We're not logged in, show the log in page
        main.html(loginTpl({msg: _loginMessage}));
      })
      
      //When a user clicks register call the register API
      $(document).on('click', '#RegisterAction', () => {
        let username = $('input[name=\'username\']').val();
        let password = $('input[name=\'password\']').val();
        
        api.post(URL + '/register', {
          username: username.toLowerCase(),
          password: password
        }).then((response) => {
          _loginMessage = 'Registration Successful! You can now sign in';
          //switch to main page
          main.html(loginTpl({msg: _loginMessage}));
        }, () => {
          _loginMessage = 'Unable to register. Try again with different username.';
          main.html(loginTpl({msg: _loginMessage}));
        })
      });
  
      //When a user clicks log in call the log in API
      $(document).on('click', '#LoginAction', () => {
        let username = $('input[name=\'username\']').val();
        let password = $('input[name=\'password\']').val();
        
        api.post(URL + '/login', {
          username: username.toLowerCase(),
          password: password
        }).then((response) => {
          window.location.reload();
        }, () => {
          _loginMessage = 'Wrong password/username. Please try again.';
          main.html(loginTpl({msg: _loginMessage}));
        })
      });
      
      //When a user clicks log out call the log out API
      $(document).on('click', '#LogoutAction', () => {
        api.get(URL + '/logout').then((response) => {
          window.location.reload();
        })
      });
      
      //When a user clicks follow me call the follow API
      $(document).on('click', '.follow-me', (e) => {
        let target = $(e.target);
        let userId = parseInt(target.attr('data-id'), 10);
        api.post(URL + '/follows', { publisher_id: userId }).then((response) => {
          refreshUsers();
          refreshFeed();
        })
      });
      
      //When a user clicks unfollow me call the follow API
       $(document).on('click', '.unfollow-me', (e) => {
        let target = $(e.target);
        let userId = parseInt(target.attr('data-id'), 10);
        api.delete(URL + '/follows/' + userId).then((response) => {
          refreshUsers();
          refreshFeed();
        });
      });
      
      $(document).on('click', '#submitPost', () => {
        const postString = $('#post-content').val();
        if (postString) {
          api.post(URL + '/posts', {body_text: postString}).then((response) => {
            // reload new feed tpl
            refreshFeed();
          })
        }
      });
      
      // delete click handler goes here
      $(document).on('click', '.delete-post', (e) => {
        let button = $(e.target); // the button that got clicked
        let postId = button.attr('data-id');
        
        api.delete(URL+ '/posts/'+postId);
        refreshFeed();
      });
      
      
      //Helper method to call feed api and load template
      function refreshFeed() {
        api.get(URL + '/feed').then((response) => {
          newsFeed.html(newsfeedTpl(response.feed.map(items => {
            items.isMine = _user.id === items.author.id;
            return items;
          })));
        });
      }
  
      //Helper method to call users api and load template
       function refreshUsers() {
         //Get list of all users
         api.get(URL + '/users').then((usersData) => {
            _usersData = usersData;
           //check if current user follows this user
            api.get(URL + '/follows').then((data) => {
                let iFollow = {};
                data.follows.map((publisher) => {
                  iFollow[publisher.id] = true;
                });
  
                _usersData.users = usersData.users.map((u) => {
                    if(iFollow[u.id]) {
                        u.iFollow = true;
                    } else {
                        u.iFollow = false;
                    }
  
                    return u;
                }).filter((u) => u.id !== _user.id).sort((ua, ub) => {
                  if(ub.username < ua.username) {
                    return 1;
                  }
                  return -1;
                });
              _usersData.count = _usersData.users.length;
              userList.html(usersTpl(_usersData));
            })
        });
      }
    })
    
  
  })(window, $, window.api, window.utils);
  