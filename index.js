function searchItem() {
    alert("Search icon clicked!");
}
     function trackWhatsappClick(e, url) {
    e.preventDefault();
    fetch('track_whatsapp.php')
        .then(() => {
            window.open(url, '_blank');
        })
        .catch(() => {
            window.open(url, '_blank');
        });
}
 