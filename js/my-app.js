// Initialize your app
var myApp = new Framework7();
// Export selectors engine
var $$ = Dom7;

Storage.prototype.setSons = function(obj) {
    return this.setItem("key", JSON.stringify(obj))
}
Storage.prototype.getSons = function() {
    return JSON.parse(this.getItem("key"))
}
myApp.onPageInit('auth', function (page) {
    $$('.form-to-json').on('click', function () {
        var formData = myApp.formToJSON('#auth-form');
        login = JSON.stringify(formData);
        $$.post('http://reable.herokuapp.com/api/v1/parent_auth/sign_in', JSON.parse(login), function (data) {
            localStorage.setItem('user', data);
            window.location.href = 'index.html';
            //var obj = eval("[" + localStorage.getItem('user') + "]") to get user
            //for(var i = 0; i < data.length; i++){
            //              console.log(data[i]);  
            //            };

        });
    });
});

myApp.onPageInit('signup', function (page) {
    $$('.form-to-json2').on('click', function () {
        var formData = myApp.formToJSON('#signup-form');
        signup = JSON.stringify(formData);
        $$.post('http://reable.herokuapp.com/api/v1/parent_auth', JSON.parse(signup), function (data) {
            localStorage.setItem('user', data);
            window.location.href = 'index.html';
        });
    });
});
s = [];
localStorage.setSons(s);
getUserByEmail = function (email) {
    //    $$.get('http://reable.herokuapp.com/api/v1/users', {
    //        email: email
    //    }, function (data) {
    //        sons.push(JSON.parse(data)[0]);
    //    });
    $$.ajax({
        type: "GET"
        , dataType: "json"
        , url: "http://reable.herokuapp.com/api/v1/users"
        , data: {email: email, id: JSON.parse(localStorage.getItem('user')).data.id}
        , success: function (data) {
            console.log(data);
            s = localStorage.getSons();
            s.push(data);
            localStorage.setSons(s);
            var sons = localStorage.getSons()
        }
    });
    
};

myApp.onPageInit('transactions', function(){
    var template = $$('script#transactionstemp').html();
    
// compile it with Template7
var compiledTemplate = Template7.compile(template);
 
// Now we may render our compiled template by passing required context
var transactions = localStorage.getSons();
var context = transactions[0][0]['transactions'][0];
var html = compiledTemplate(context);
    console.log(html);
    $$('.transactions').append(html);
});


$$('#childprompt').on('click', function () {
    myApp.prompt('What is your child\'s email?', [title = "Add a child"], function (value) {
        getUserByEmail(value);
        console.log(value);
        myApp.alert('Adding child', [title = "Almost there"]);
    });
});

var mainView = myApp.addView('.view-main', {
    // Because we use fixed-through navbar we can enable dynamic navbar
});

// Callbacks to run specific code for specific pages, for example for About page:
$$('.panel').on('click', function (e) {
    myApp.closePanel();
});