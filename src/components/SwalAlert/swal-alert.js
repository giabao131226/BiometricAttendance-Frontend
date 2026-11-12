import Swal from 'sweetalert2'

export default function SwalAlert({ status, title,message, time }) {
    Swal.fire({
        toast: true,
        position: "top-end",
        icon: status === "success" ? "success" : "error",
        title: title,
        text: message,
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true
    })
}