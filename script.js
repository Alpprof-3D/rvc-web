document.getElementById('startBtn').addEventListener('click', async () => {
    const fileInput = document.getElementById('audioInput');
    const token = document.getElementById('hfToken').value;
    const modelId = document.getElementById('hfModelId').value;
    const btn = document.getElementById('startBtn');
    const songList = document.getElementById('songList');

    if (!fileInput.files[0] || !token) {
        alert("Lütfen önce bir ses dosyası seçin ve HF Token girin!");
        return;
    }

    btn.innerText = "İŞLENİYOR (BULUT)...";
    btn.disabled = true;

    try {
        const audioData = await fileInput.files[0].arrayBuffer();

        const response = await fetch(
            `https://api-inference.huggingface.co/models/${modelId}`,
            {
                headers: { Authorization: `Bearer ${token}` },
                method: "POST",
                body: audioData,
            }
        );

        const result = await response.json();
        
        // Listeye ekle
        const item = document.createElement('div');
        item.className = 'song-item';
        item.innerHTML = `
            <span>Sonuç: ${JSON.stringify(result).substring(0, 50)}...</span>
            <button class="play-btn">✓</button>
        `;
        songList.prepend(item);

    } catch (error) {
        alert("Hata: " + error.message);
    } finally {
        btn.innerText = "BULUTTA BAŞLAT";
        btn.disabled = false;
    }
});
