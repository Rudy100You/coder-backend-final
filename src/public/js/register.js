/* eslint-disable no-undef */

$(document).ready(function () {

    /*var source = $("#login-template").html();
    var template = Handlebars.compile(source);*/

    $("#registerForm").submit((event)=>{
      event.preventDefault();
      var formData = formToObject("#registerForm");
      fetch('api/sessions/register', {
        method:'POST',
        body: JSON.stringify(formData),
        headers:{
          'Content-Type':'application/json'
        }
      }).then(res=>{
        if(res.status === 200){
          window.location.replace("/login")
        }
      })
    });
  });