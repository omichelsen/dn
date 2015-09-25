// Init fastclick
if ('addEventListener' in document) {
    document.addEventListener('DOMContentLoaded', function () {
        FastClick.attach(document.body);
    }, false);
}

// Prevent content scroll on touch devices
if ('ontouchstart' in window) {
    document.getElementById('page-main').addEventListener('touchmove', function (e) {
        e.preventDefault();
    });
}
