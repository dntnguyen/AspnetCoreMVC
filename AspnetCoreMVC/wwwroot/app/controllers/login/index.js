var LoginController = function() {
    this.initialize = function () {
        registerEvents();
    }

    var registerEvents = function () {
        $('#frmLogin').validate({
            errorClass: 'red',
            ignore: [],
            lang: 'vi',
            rules: {
                userName: {
                    required: true
                },
                password: {
                    required: true
                }
            }
        });

        $('#btnLogin').on('click', function (e) {
            if ($('#frmLogin').valid()) {
                e.preventDefault();
                var user = $('#txtUserName').val();
                var pass = $('#txtPassword').val();
                login(user, pass);
            }
           
        });
    }

    var login = function (user, pass) {
        $.ajax({
            type: 'POST',
            data: {
                UserName: user,
                Password: pass
            },
            dataType: 'json',
            url: '/Admin/Login/Authentication',
            success: function (response) {
                if (response.Success) {
                    window.location.href = "/Admin/Home/Index";
                } else {
                    coreapp.notify("Login failed!", 'error');
                }
            }

        })
    }
}