import Swal from 'sweetalert2'

export default function SwalAlert({ status, title,message, time = 3000 }) {
    Swal.fire({
        toast: true,
        position: "top-end",
        icon: status === true ? "success" : "error",
        title: title,
        text: message,
        showConfirmButton: false,
        timer: time,
        timerProgressBar: true
    })
}