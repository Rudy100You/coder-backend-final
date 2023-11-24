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
  
  function logout() {
      fetch(`/api/sessions/logout`, {
          method: 'GET',
          headers: {
              'Content-Type': 'application/json'
          }
      })
      .then(result => {
          if (result.ok) {
              localStorage.clear();
              window.location.replace("/login");
          } else {
              throw new Error('Logout failed');
          }
      })
      .catch(error => {
          console.error('Logout error:', error);
          Swal.fire({
              icon: 'error',
              title: 'Logout error',
              text: 'Try again later'
          });
      });
  }

  function redirectToCart(){
    window.location.replace(`/carts/${localStorage.getItem("cartID")}`)
  }
  
  function addProductToCart(productID, quantity=1){
    const currentCart = localStorage.getItem('cartID')
    const currentProduct ={
      product: productID,
      quantity: parseInt(quantity)
    };
  
    if(!currentCart || currentCart == "undefined") {
        fetch(`/api/carts/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                products: [currentProduct]
            })
        })
        .then(async response => {
            if (response.ok) {
                const {payload} = await response.json();
                localStorage.setItem("cartID", payload.cartID)
                await showSuccessAndReload('Product Added Successfully to cart')
            } else {
                showError((await response.json()).message);
            }
        })
    } else {
        fetch(`/api/carts/${currentCart}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(async response => {
            if (response.ok) {
                const {payload} = await response.json();
                const existingProduct = payload.products.find(product => product.product === productID);
                if (existingProduct) {
                    updateCart(currentCart, productID, existingProduct.quantity, quantity);
                } else {
                    addNewProductToCart(currentCart, productID);
                }
            } else {
                showError((await response.json()).message);
            }
        })
    }
  }
  
  function updateCart(cartId, productID, currentQuantity, addedQuantity) {
      const totalQuantity = currentQuantity + parseInt(addedQuantity);
      fetch(`/api/carts/${cartId}/product/${productID}`, {
          method: 'PUT',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({
              quantity: totalQuantity
          })
      }).then(async response => {
          if (response.ok) {
              await showSuccessAndReload();
          } else {
            showError((await response.json()).message);
        }
      });
  }
  
  function addNewProductToCart(cartId, productID) {
      fetch(`/api/carts/${cartId}/product/${productID}`, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          }
      }).then(async response => {
          if (response.ok) {
              await showSuccessAndReload('Product Added Successfully to cart');
          } else {
            showError((await response.json()).message);
        }
      });
  }
  
  async function showSuccessAndReload(text) {
      Swal.fire({
          icon: 'success',
          title: 'Success!',
          text
      }).then(() => {
          window.location.reload();
      });
  }
  
  function showError(errorMessage) {
      Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: errorMessage ?? 'Something went wrong!'
      });
  }
  