document.getElementById('startBtn').addEventListener('click', async () => {
    const fileInput = document.getElementById('audioInput');
    const modelId = document.getElementById('hfModelId').value;
    const btn = document.getElementById('startBtn');
    const songList = document.getElementById('songList');

    if (!fileInput.files[0]) {
        alert("Lütfen bir ses dosyası seçin!");
        return;
    }

    btn.innerText = "HALKA AÇIK SUNUCUYA BAĞLANIYOR...";
    btn.disabled = true;

    try {
        const audioData = await fileInput.files[0].arrayBuffer();

        // Token gönderilmiyor, doğrudan public istek yapılıyor
        const response = await fetch(
            `https://api-inference.huggingface.co/models/${modelId}`,
            {
                method: "POST",
                body: audioData,
            }
        );

        if (response.status === 503) {
            throw new Error("Model şu an yükleniyor, lütfen 20 saniye sonra tekrar deneyin.");
        }

        if (!response.ok) {
            throw new Error("Halka açık erişim şu an kısıtlı veya model Token gerektiriyor.");
        }

        const result = await response.json();
        
        const item = document.createElement('div');
        item.className = 'song-item';
        item.innerHTML = `
            <span>Analiz Sonucu: ${JSON.stringify(result.text || result).substring(0, 45)}...</span>
            <button style="background:#222; border:none; color:#00ffcc; border-radius:50%; width:30px; height:30px;">✓</button>
        `;
        songList.prepend(item);

    } catch (error) {
        alert(error.message);
    } finally {
        btn.innerText = "ANALİZ ET & BAŞLAT";
        btn.disabled = false;
    }
});
