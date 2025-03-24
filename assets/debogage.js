// Envoie du formulaire grâce à mailto

let form = document.querySelector("form")
let baliseNom = document.getElementById("nom")
let nom = baliseNom.value
let email = document.getElementById("email").value 
let message = document.getElementById("message").value
console.log("hello")

// form.addEventListener("submit", (e) => {
//     e.preventDefault()
//     console.log(nom)
// })