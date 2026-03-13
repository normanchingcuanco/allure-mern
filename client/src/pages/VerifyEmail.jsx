<template>

<div class="verify-container">

<h2>Email Verification</h2>

<p v-if="loading">Verifying your email...</p>

<p v-if="success" class="success">
Email verified successfully. You can now login.
</p>

<p v-if="error" class="error">
Verification failed or token expired.
</p>

<button v-if="success" @click="goToLogin">
Go to Login
</button>

</div>

</template>


<script>

import api from "../api"

export default {

data() {
return {
loading: true,
success: false,
error: false
}
},

async mounted() {

try {

const token = this.$route.params.token

await api.get(`/verify-email/${token}`)

this.success = true

} catch {

this.error = true

}

this.loading = false

},

methods: {

goToLogin() {
this.$router.push("/login")
}

}

}

</script>


<style>

.verify-container {
max-width: 500px;
margin: auto;
padding: 40px;
text-align: center;
}

.success {
color: green;
}

.error {
color: red;
}

</style>