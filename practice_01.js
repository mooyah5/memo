function blockUI() {
    const start = Date.now();
    while (Date.now() - start < 3000) { }
    window.alert("끝!")
}
blockUI();