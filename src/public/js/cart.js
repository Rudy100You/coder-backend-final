/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
// Function to remove item from the cart
function removeItem(productId) {
  // Display confirmation using SweetAlert
  Swal.fire({
      title: 'Are you sure?',
      text: 'This item will be removed from your cart!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, remove it!'
  }).then((result) => {
      if (result.isConfirmed) {
          // Make a call to remove the item using productId
          fetch(`/api/carts/{{cartId}}/product/${productId}`, {
              method: 'PUT',
              headers: {
                  'Content-Type': 'application/json'
              }
          })
              .then(response => {
                  if (response.ok) {
                      // Refresh the cart view after successful removal
                      // You might need to reload the page or update the cart dynamically
                      location.reload(); // Example: Reload the page
                  } else {
                      throw new Error('Failed to remove item from cart.');
                  }
              })
              .catch(error => {
                  console.error('Error removing item from cart:', error);
                  // Handle error with SweetAlert
                  Swal.fire(
                      'Error!',
                      'Failed to remove item from your cart.',
                      'error'
                  );
              });
      }
  });
}

// Function to finalize the purchase
function finalizePurchase() {
  const cartId = localStorage.getItem('cartId')
  // Make a call to finalize the purchase
  fetch(`/api/carts/${cartId}/finalize-purchase`, {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      }
  })
      .then(response => {
          if (response.ok) {
              // Success message using SweetAlert
              Swal.fire(
                  'Purchase Completed!',
                  'Your purchase has been finalized.',
                  'success'
              );
          } else {
              throw new Error('Failed to finalize purchase.');
          }
      })
      .catch(error => {
          console.error('Error finalizing purchase:', error);
          // Handle error with SweetAlert
          Swal.fire(
              'Error!',
              'Failed to finalize purchase.',
              'error'
          );
      });
}