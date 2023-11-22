/* eslint-disable no-undef */
// eslint-disable-next-line no-unused-vars
function confirmDelete(userId) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this user!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        deleteUser(userId);
      }
    });
  }

  // eslint-disable-next-line no-unused-vars
  function confirmToggleRole(userId, currentRole) {
    const newRole = currentRole === 'BASIC' ? 'PREMIUM' : 'BASIC';
    Swal.fire({
      title: 'Are you sure?',
      text: `Do you want to toggle the role to ${newRole}?`,
      icon: 'info',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, toggle it!'
    }).then((result) => {
      if (result.isConfirmed) {
        toggleUserRole(userId, newRole);
      }
    });
  }

  function deleteUser(userId) {
    fetch(`/api/users/${userId}`, {
      method: 'DELETE'
    })
    .then(response => {
      if (response.ok) {
        // Reload the user list after successful deletion
        location.reload();
      } else {
        throw new Error('Failed to delete user');
      }
    })
    .catch(error => {
      console.error(error);
      // Handle error with a SweetAlert
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Something went wrong!'
      });
    });
  }

  function toggleUserRole(userId, role) {
    fetch(`/api/users/premium/${userId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ role })
    })
    .then(async response => {
      const body = await response.json();
      if (response.ok) {
        // Reload the user list after successful role toggle
        location.reload();
      } 
      else if(response.status == 400)
      {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: body.message
          });
      }
      else {
        throw new Error('Failed to toggle user role');
      }
    })
    .catch(error => {
      console.error(error);
      // Handle error with a SweetAlert
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Something went wrong!'
      });
    });
  }