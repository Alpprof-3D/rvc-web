document.getElementById('startBtn').addEventListener('click', async () => {
    const fileInput = document.getElementById('audioInput');
    const modelIdInput = document.getElementById('hfModelId'); // Önce öğeyi alalım
    const btn = document.getElementById('startBtn');
    const songList = document.getElementById('songList');

    // HATA KONTROLÜ: Öğeler sayfada var mı?
    if (!fileInput || !modelIdInput) {
        console.error("Gerekli HTML öğeleri bulunamadı! ID'leri kontrol edin.");
        return;
    }

    const modelId = modelIdInput.value;

    if (!fileInput.files[0]) {
        alert("Lütfen önce bir ses dosyası seçin!");
        return;
    }

    btn.innerText = "İŞLENİYOR...";
    btn.disabled = true;

    try {
        const audioData = await fileInput.files[0].arrayBuffer();

        const response = await fetch(
            `https://api-inference.huggingface.co/models/${modelId}`,
            {
                method: "POST",
                body: audioData,
            }
        );

        if (!response.ok) throw new Error("API erişimi şu an sağlanamıyor.");

        const result = await response.json();
        
        const item = document.createElement('div');
        item.className = 'song-item';
        item.innerHTML = `<span>Sonuç: ${JSON.stringify(result).substring(0, 40)}...</span>`;
        songList.prepend(item);

    } catch (error) {
        alert("Hata: " + error.message);
    } finally {
        btn.innerText = "ANALİZ ET & BAŞLAT";
        btn.disabled = false;
    }
});
