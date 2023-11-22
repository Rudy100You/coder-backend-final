/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */

function formToObject(formDoc) {
  var formData = $(formDoc).serializeArray();
  var formObject = {};

  $(formData).each(function(_index, obj){
    formObject[obj.name] = obj.value;
  });

  return formObject;
}

function addProductToCart(productID, quantity=1){
  const currentCart = localStorage.getItem('cartID');
  if(!currentCart)
  {
      fetch(`/api/carts/`, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({
              products: [{
              product: productID,
              quantity: parseInt(quantity)
          }]
          })
      })
      .then(async response => {
          if (response.ok) {
              const payload = await response.json();
              localStorage.setItem("cartID", payload.cartID)
          } else {
              Swal.fire({
                  icon: 'error',
                  title: 'Oops...',
                  text: 'Something went wrong!'
                });
          }
      })
  }
  else{
      fetch(`/api/carts/${currentCart}`, {
          method: 'GET',
          headers: {
              'Content-Type': 'application/json'
          }
      })
      .then(async response => {
          if (response.ok) {
              const payload = await response.json();
              const currentProduct = payload.products.some(product => product.product == productID)
              if (currentProduct)
              {
                  fetch(`/api/carts/${currentCart}/product/${productID}`, {
                      method: 'PUT',
                      headers: {
                          'Content-Type': 'application/json'
                      },
                      body: JSON.stringify({
                          quantity: currentProduct.quantity + parseInt(quantity)
                      })
                  }).then(async response => {
                      if (response.ok) {
                          Swal.fire({
                              icon: 'success',
                              title: 'Success!',
                              text: 'Product Added Successfully to cart'
                            }).then(()=>{
                              window.location.reload()
                            });
                      }
                      else {
                          Swal.fire({
                              icon: 'error',
                              title: 'Oops...',
                              text: 'Something went wrong!'
                            });
                      }
                  })
              }
              else{
                  fetch(`/api/carts/${currentCart}/product/${productID}`, {
                      method: 'POST',
                      headers: {
                          'Content-Type': 'application/json'
                      }
                  }).then(async response => {
                      if (response.ok) {
                          Swal.fire({
                              icon: 'success',
                              title: 'Success!',
                              text: 'Product Added Successfully to cart'
                            }).then(()=>{
                              window.location.reload()
                            })
                      }
                      else {
                          Swal.fire({
                              icon: 'error',
                              title: 'Oops...',
                              text: 'Something went wrong!'
                            });
                      }
                  })
              }
          }
           else {
              Swal.fire({
                  icon: 'error',
                  title: 'Oops...',
                  text: 'Something went wrong!'
                });
          }
      })
  }
}