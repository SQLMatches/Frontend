const emailReg = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

export default {
  data () {
    return {
      emailRegExp: new RegExp(emailReg),
      emailState: null
    }
  },
  methods: {
    validateEmail () {
      this.emailState = this.emailRegExp.test(this.form.email)
    }
  }
}
