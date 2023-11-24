/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

function removeItem(productId) {
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
            fetch(`/api/carts/${localStorage.getItem("cartID")}/product/${productId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
                .then(async response => {
                    if (response.ok) {
                       await showSuccessAndReload('Product successfully removed from cart');
                    } else {
                        throw new Error('Failed to remove item from cart.');
                    }
                })
                .catch(error => {
                    console.error('Error removing item from cart:', error);
                    Swal.fire(
                        'Error!',
                        'Failed to remove item from your cart.',
                        'error'
                    );
                });
        }
    });
  }
  
  function finalizePurchase() {
    const cartId = JSON.parse(localStorage.getItem('cartId'))
    fetch(`/api/carts/${cartId}/finalize-purchase`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(response => {
            if (response.ok) {
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
            Swal.fire(
                'Error!',
                'Failed to finalize purchase.',
                'error'
            );
        });
  }
  