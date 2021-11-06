$(document).ready(function () {
  $('#logout').click(() => logout())
})

const logout = () => {
  localStorage.removeItem('user')
}
