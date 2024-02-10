export class Popup {

    static popupControl() {
        let openPopup = document.getElementById('popup-opened');
        let popupClosed = document.getElementById('popup-closed');
        let popup = document.getElementById('popup');
        let body = document.getElementById('body');

        openPopup.onclick = function () {
            popup.classList.add('open');
        }

        popupClosed.onclick =function () {
            popup.classList.remove('open');
        }
    }
}