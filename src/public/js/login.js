/*eslint-disable*/
$(document).ready(function () {

  const passwordInput = $('#password');
  const showPasswordToggle = $('#showPasswordToggle');
  
  showPasswordToggle.click(function() {
    if (passwordInput.attr('type') === 'password') {
      passwordInput.attr('type', 'text');
      showPasswordToggle.html('<i class="bi bi-eye-slash"></i>');
    } else {
      passwordInput.attr('type', 'password');
      showPasswordToggle.html('<i class="bi bi-eye"></i>');
    }
  });

  $("#logInForm").submit((event) => {
    event.preventDefault();
    var formData = formToObject("#logInForm");
    fetch("/api/sessions/login", {
      method: "POST",
      body: JSON.stringify(formData),
      headers: {
        "Content-Type": "application/json",
      },
    }).then(async (res) => {     
      if (res.status === 401 && !$("#incorrectPassOrEmailAlert").length) {
        $("#rememberMeCheck").after($('<div class="alert alert-danger" role="alert" id="incorrectPassOrEmailAlert">').text("Password or email incorrect. Try Again"))
      }
      if(res.status ===200){
        localStorage.clear();
        window.location.replace("/profile");
      }
    });
  });
});
