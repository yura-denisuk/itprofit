import IMask from "imask";
import "../../styles/style.scss";
import {Popup} from "./popup";

class Form {

    constructor() {
        Popup.popupControl();

        new IMask(document.getElementById('phone'), {
            mask: "+{375}(00)000-00-00"
        })

        this.fields = [
            {
                name: 'name',
                id: 'name',
                element: null,
                valid: false,
            },
            {
                name: 'phone',
                id: 'phone',
                element: null,
                valid: false,
            },
            {
                name: 'email',
                id: 'email',
                element: null,
                regex: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
                valid: false,
            },
            {
                name: 'message',
                id: 'message',
                element: null,
                valid: false,
            },
        ];

        const that = this;
        this.fields.forEach(item => {
            item.element = document.getElementById(item.id);
            item.element.onchange = function () {
                that.validateField.call(that, item, this);
            }
        });

        this.processElement = document.getElementById('process');
        this.processElement.onclick = function () {
            that.processForm();
        }
    }

    validateField(field, element) {
        if (!element.value || !element.value.match(field.regex)) {
            element.parentNode.style.borderColor = 'red';
            element.parentNode.nextElementSibling.style.display = 'block';
            field.valid = false;
        } else {
            element.parentNode.removeAttribute('style');
            element.parentNode.nextElementSibling.style.display = 'none';
            field.valid = true;
        }
        this.validateForm();
    }

    validateForm() {
        const isValid = this.fields.every(item => item.valid);
        if (isValid) {
            this.processElement.removeAttribute('disabled');
        } else {
            this.processElement.setAttribute('disabled', 'disabled');
        }
        return isValid;
    }

    async processForm() {

        if (this.validateForm()) {
            try {
                const response = await fetch('http://localhost:9090/api/registration', {
                    method: "POST",
                    headers: {
                        'Content-type': 'application/json',
                        'Accept': 'application/json',
                    },
                    body: JSON.stringify({
                        name: this.fields.find(item => item.name === 'name').element.value,
                        phone: this.fields.find(item => item.name === 'phone').element.value,
                        email: this.fields.find(item => item.name === 'email').element.value,
                        message: this.fields.find(item => item.name === 'message').element.value,
                    })
                })

                if (response.status < 200 || response.status >= 300) {
                    throw new Error('Ошибка в отправке запроса. Сервер не доступен.');
                }

                const result = await response.json();

                if (result) {
                    if (result.status === 'error') {
                        throw new Error('Ошибки в заполнении формы: ' + result.fields.name + ', ' +
                            result.fields.phone + ', ' + result.fields.email + ', ' +
                            result.fields.message);
                    }

                    this.fields.find(item => item.name === 'name').element.value = '';
                    this.fields.find(item => item.name === 'phone').element.value = '';
                    this.fields.find(item => item.name === 'email').element.value = '';
                    this.fields.find(item => item.name === 'message').element.value = '';
                    alert(result.msg);
                }

            } catch (error) {
                alert('Сервер временно не работает.');
            }
        }
    }
}

new Form();